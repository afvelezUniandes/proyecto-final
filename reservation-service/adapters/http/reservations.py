from flask import Blueprint, jsonify, request
from sqlalchemy.orm import sessionmaker
from adapters.orm.models import Reserva, Pago
from sqlalchemy import create_engine, text
import os
import datetime
import random
import string
import requests as http_requests

bp = Blueprint('reservations', __name__)

DATABASE_URL = os.getenv('RESERVATION_DATABASE_URL', 'postgresql://user:password@localhost:5432/travelhub')
NOTIFICATION_SERVICE_URL = os.getenv('NOTIFICATION_SERVICE_URL', 'http://localhost:5004')
AUTH_SERVICE_URL = os.getenv('AUTH_SERVICE_URL', 'http://localhost:5000')
CATALOG_SERVICE_URL = os.getenv('CATALOG_SERVICE_URL', 'http://localhost:5001')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)


def _get_user_email(user_id: int) -> str | None:
    """Obtiene el email del usuario desde auth-service. Falla silenciosamente."""
    try:
        resp = http_requests.get(
            f'{AUTH_SERVICE_URL}/profile',
            headers={'X-User-Id': str(user_id)},
            timeout=3,
        )
        if resp.status_code == 200:
            return resp.json().get('email')
    except Exception:
        pass
    return None


def _get_hotel_room_info(hotel_id: int, habitacion_id: int) -> tuple[str, str]:
    """Obtiene nombre del hotel y tipo de habitación. Devuelve strings vacíos si falla."""
    nombre_hotel = ''
    tipo_habitacion = ''
    try:
        resp = http_requests.get(f'{CATALOG_SERVICE_URL}/hotels/{hotel_id}', timeout=3)
        if resp.status_code == 200:
            nombre_hotel = resp.json().get('nombre', '')
    except Exception:
        pass
    try:
        resp = http_requests.get(
            f'{CATALOG_SERVICE_URL}/rooms',
            params={'hotel_id': hotel_id},
            timeout=3,
        )
        if resp.status_code == 200:
            rooms = resp.json() if isinstance(resp.json(), list) else resp.json().get('rooms', [])
            for r in rooms:
                if r.get('id') == habitacion_id:
                    tipo_habitacion = r.get('tipo') or r.get('nombre', '')
                    break
    except Exception:
        pass
    return nombre_hotel, tipo_habitacion


def _notify(user_id: int, tipo: str, titulo: str, mensaje: str, extra: dict | None = None):
    """Envía notificación al notification-service. Falla silenciosamente."""
    try:
        payload = {
            'user_id': user_id,
            'tipo': tipo,
            'titulo': titulo,
            'mensaje': mensaje,
        }
        if extra:
            payload.update(extra)
        http_requests.post(
            f'{NOTIFICATION_SERVICE_URL}/notifications',
            json=payload,
            timeout=3,
        )
    except Exception:
        pass


def get_user_id_from_request(request):
    """Lee el user_id del header X-User-Id inyectado por el client-gateway.
    El gateway ya validó el JWT — los micros confían en este header.
    """
    user_id = request.headers.get('X-User-Id')
    if not user_id:
        return None
    try:
        return int(user_id)
    except (ValueError, TypeError):
        return None


def generate_codigo():
    year = datetime.datetime.utcnow().year
    suffix = ''.join(random.choices(string.digits, k=4))
    return f"TH-{year}-{suffix}"


def reserva_to_dict(r):
    return {
        'id': r.id,
        'usuario_id': r.usuario_id,
        'habitacion_id': r.habitacion_id,
        'hotel_id': r.hotel_id,
        'fecha_checkin': str(r.fecha_checkin),
        'fecha_checkout': str(r.fecha_checkout),
        'num_huespedes': r.num_huespedes,
        'fecha_creacion': str(r.fecha_creacion),
        'fecha_cancelacion': str(r.fecha_cancelacion) if r.fecha_cancelacion else None,
        'codigo': r.codigo,
        'monto_total': float(r.monto_total),
        'moneda': r.moneda,
        'estado': r.estado,
    }


# ──────────────────────────────────────────────
# GET /reservations  — listar reservas del usuario
# ──────────────────────────────────────────────
@bp.route('/reservations', methods=['GET'])
def get_reservations():
    user_id = get_user_id_from_request(request)
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    session = Session()
    try:
        estado = request.args.get('estado')
        query = session.query(Reserva).filter(Reserva.usuario_id == user_id)
        if estado:
            query = query.filter(Reserva.estado == estado)
        reservas = query.order_by(Reserva.fecha_creacion.desc()).all()
        return jsonify([reserva_to_dict(r) for r in reservas]), 200
    finally:
        session.close()


# ──────────────────────────────────────────────
# GET /reservations/<id>  — detalle de una reserva
# ──────────────────────────────────────────────
@bp.route('/reservations/<int:reserva_id>', methods=['GET'])
def get_reservation(reserva_id):
    user_id = get_user_id_from_request(request)
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    session = Session()
    try:
        reserva = session.query(Reserva).filter(
            Reserva.id == reserva_id,
            Reserva.usuario_id == user_id
        ).first()
        if not reserva:
            return jsonify({'error': 'Reservation not found'}), 404
        return jsonify(reserva_to_dict(reserva)), 200
    finally:
        session.close()


# ──────────────────────────────────────────────
# POST /reservations  — crear reserva
# ──────────────────────────────────────────────
@bp.route('/reservations', methods=['POST'])
def create_reservation():
    user_id = get_user_id_from_request(request)
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.json
    required = ['habitacion_id', 'hotel_id', 'fecha_checkin', 'fecha_checkout', 'num_huespedes', 'monto_total']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400

    session = Session()
    try:
        checkin = datetime.date.fromisoformat(data['fecha_checkin'])
        checkout = datetime.date.fromisoformat(data['fecha_checkout'])
        if checkout <= checkin:
            return jsonify({'error': 'checkout must be after checkin'}), 400

        # Validar que la habitación no esté ya reservada en esas fechas
        conflicto = session.query(Reserva).filter(
            Reserva.habitacion_id == data['habitacion_id'],
            Reserva.estado == 'confirmada',
            Reserva.fecha_checkin < checkout,
            Reserva.fecha_checkout > checkin
        ).first()
        if conflicto:
            return jsonify({'error': 'La habitación no está disponible para las fechas seleccionadas'}), 409

        codigo = generate_codigo()
        # Garantizar unicidad del código
        while session.query(Reserva).filter(Reserva.codigo == codigo).first():
            codigo = generate_codigo()

        reserva = Reserva(
            usuario_id=user_id,
            habitacion_id=data['habitacion_id'],
            hotel_id=data['hotel_id'],
            fecha_checkin=checkin,
            fecha_checkout=checkout,
            num_huespedes=data['num_huespedes'],
            monto_total=data['monto_total'],
            moneda=data.get('moneda', 'COP'),
            estado='confirmada',
            codigo=codigo
        )
        session.add(reserva)
        session.flush()

        # Crear pago automático
        pago = Pago(
            reserva_id=reserva.id,
            monto=data['monto_total'],
            metodo_pago=data.get('metodo_pago', 'tarjeta'),
            estado='completado'
        )
        session.add(pago)
        session.commit()

        email = _get_user_email(user_id)
        nombre_hotel = data.get('nombre_hotel', '')
        tipo_habitacion = data.get('tipo_habitacion', '')
        _notify(
            user_id=user_id,
            tipo='reserva_creada',
            titulo='Reserva confirmada',
            mensaje=f'Tu reserva {reserva.codigo} ha sido confirmada. Check-in: {checkin}, Check-out: {checkout}.',
            extra={
                'email': email,
                'codigo': reserva.codigo,
                'nombre_hotel': nombre_hotel,
                'tipo_habitacion': tipo_habitacion,
                'fecha_checkin': str(checkin),
                'fecha_checkout': str(checkout),
                'num_huespedes': data['num_huespedes'],
                'monto_total': str(data['monto_total']),
                'moneda': data.get('moneda', 'COP'),
            },
        )

        return jsonify(reserva_to_dict(reserva)), 201
    except ValueError as e:
        session.rollback()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        session.close()


# ──────────────────────────────────────────────
# PATCH /reservations/<id>/hotel-cancel  — cancelar reserva como admin del hotel
# Requiere header X-Hotel-Id que el gateway valida contra el hotel_id de la reserva.
# ──────────────────────────────────────────────
@bp.route('/reservations/<int:reserva_id>/hotel-cancel', methods=['PATCH'])
def hotel_cancel_reservation(reserva_id):
    hotel_id = request.headers.get('X-Hotel-Id')
    if not hotel_id:
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        hotel_id = int(hotel_id)
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid hotel id'}), 400

    session = Session()
    try:
        reserva = session.query(Reserva).filter(
            Reserva.id == reserva_id,
            Reserva.hotel_id == hotel_id
        ).first()
        if not reserva:
            return jsonify({'error': 'Reservation not found'}), 404
        if reserva.estado != 'confirmada':
            return jsonify({'error': 'Only confirmed reservations can be cancelled'}), 400

        reserva.estado = 'cancelada'
        reserva.fecha_cancelacion = datetime.datetime.now()
        session.commit()
        return jsonify(reserva_to_dict(reserva)), 200
    finally:
        session.close()


# ──────────────────────────────────────────────
# GET /reservations/hotel/<hotel_id>/reservations/<reserva_id>  — detalle de una reserva del hotel
# ──────────────────────────────────────────────
@bp.route('/reservations/hotel/<int:hotel_id>/reservations/<int:reserva_id>', methods=['GET'])
def get_hotel_reservation_detail(hotel_id, reserva_id):
    hotel_id_header = request.headers.get('X-Hotel-Id')
    if not hotel_id_header:
        return jsonify({'error': 'Unauthorized'}), 401
    session = Session()
    try:
        reserva = session.query(Reserva).filter(
            Reserva.id == reserva_id,
            Reserva.hotel_id == hotel_id
        ).first()
        if not reserva:
            return jsonify({'error': 'Reservation not found'}), 404
        return jsonify(reserva_to_dict(reserva)), 200
    finally:
        session.close()


# ──────────────────────────────────────────────
# ──────────────────────────────────────────────
@bp.route('/reservations/hotel/<int:hotel_id>', methods=['GET'])
def get_hotel_reservations(hotel_id):
    session = Session()
    try:
        estado = request.args.get('estado')
        codigo = request.args.get('codigo')
        fecha_desde = request.args.get('fecha_desde')
        fecha_hasta = request.args.get('fecha_hasta')

        query = session.query(Reserva).filter(Reserva.hotel_id == hotel_id)
        if estado:
            query = query.filter(Reserva.estado == estado)
        if codigo:
            query = query.filter(Reserva.codigo.ilike(f'%{codigo}%'))
        if fecha_desde:
            query = query.filter(Reserva.fecha_checkin >= datetime.date.fromisoformat(fecha_desde))
        if fecha_hasta:
            query = query.filter(Reserva.fecha_checkout <= datetime.date.fromisoformat(fecha_hasta))

        reservas = query.order_by(Reserva.fecha_creacion.desc()).all()
        return jsonify([reserva_to_dict(r) for r in reservas]), 200
    finally:
        session.close()


# ──────────────────────────────────────────────
# GET /reservations/occupied-rooms  — habitaciones ocupadas en un rango de fechas
# Público (sin auth). Overlap estricto: checkout day disponible.
# ──────────────────────────────────────────────
@bp.route('/reservations/occupied-rooms', methods=['GET'])
def get_occupied_rooms():
    hotel_id = request.args.get('hotel_id')
    fecha_checkin = request.args.get('fecha_checkin')
    fecha_checkout = request.args.get('fecha_checkout')

    if not all([hotel_id, fecha_checkin, fecha_checkout]):
        return jsonify({'error': 'Se requieren hotel_id, fecha_checkin y fecha_checkout'}), 400

    try:
        checkin = datetime.date.fromisoformat(fecha_checkin)
        checkout = datetime.date.fromisoformat(fecha_checkout)
    except ValueError:
        return jsonify({'error': 'Formato de fecha inválido (YYYY-MM-DD)'}), 400

    if checkout <= checkin:
        return jsonify({'error': 'checkout debe ser posterior a checkin'}), 400

    session = Session()
    try:
        # Overlap estricto con ambos extremos: existing_checkin < new_checkout AND existing_checkout > new_checkin
        # Si existing_checkout == new_checkin → no hay conflicto (el día de checkout está disponible)
        reservas = session.query(Reserva).filter(
            Reserva.hotel_id == int(hotel_id),
            Reserva.estado == 'confirmada',
            Reserva.fecha_checkin < checkout,
            Reserva.fecha_checkout > checkin
        ).all()
        return jsonify({'occupied_room_ids': list({r.habitacion_id for r in reservas})}), 200
    finally:
        session.close()


# ──────────────────────────────────────────────
# PATCH /reservations/<id>/cancel  — cancelar reserva
# ──────────────────────────────────────────────
@bp.route('/reservations/<int:reserva_id>/cancel', methods=['PATCH'])
def cancel_reservation(reserva_id):
    user_id = get_user_id_from_request(request)
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    session = Session()
    try:
        reserva = session.query(Reserva).filter(
            Reserva.id == reserva_id,
            Reserva.usuario_id == user_id
        ).first()
        if not reserva:
            return jsonify({'error': 'Reservation not found'}), 404
        if reserva.estado != 'confirmada':
            return jsonify({'error': 'Only confirmed reservations can be cancelled'}), 400

        reserva.estado = 'cancelada'
        reserva.fecha_cancelacion = datetime.datetime.now()
        session.commit()

        email = _get_user_email(user_id)
        nombre_hotel, tipo_habitacion = _get_hotel_room_info(reserva.hotel_id, reserva.habitacion_id)
        _notify(
            user_id=user_id,
            tipo='reserva_cancelada',
            titulo='Reserva cancelada',
            mensaje=f'Tu reserva {reserva.codigo} ha sido cancelada exitosamente.',
            extra={
                'email': email,
                'codigo': reserva.codigo,
                'nombre_hotel': nombre_hotel,
                'tipo_habitacion': tipo_habitacion,
                'fecha_checkin': str(reserva.fecha_checkin),
                'fecha_checkout': str(reserva.fecha_checkout),
                'monto_total': str(reserva.monto_total),
                'moneda': reserva.moneda or 'COP',
            },
        )

        return jsonify(reserva_to_dict(reserva)), 200
    finally:
        session.close()
