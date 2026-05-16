import datetime
import calendar as cal_mod
import requests
from flask import Blueprint, request, jsonify
from config import AUTH_SERVICE_URL, CATALOG_SERVICE_URL, RESERVATION_SERVICE_URL
from middleware import verify_token

bp = Blueprint('reservations', __name__, url_prefix='/reservations')


@bp.route('/occupied-rooms', methods=['GET'])
def get_occupied_rooms_public():
    """
    Habitaciones ocupadas en un rango de fechas
    ---
    tags:
      - Reservas
    parameters:
      - name: fecha_checkin
        in: query
        type: string
        format: date
        required: true
        example: "2025-01-15"
      - name: fecha_checkout
        in: query
        type: string
        format: date
        required: true
        example: "2025-01-20"
    responses:
      200:
        description: IDs de habitaciones ocupadas en el rango de fechas
        schema:
          type: array
          items:
            type: integer
      503:
        description: Servicio de reservas no disponible
    """
    try:
        response = requests.get(
            f'{RESERVATION_SERVICE_URL}/reservations/occupied-rooms',
            params=request.args, timeout=5,
        )
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503


@bp.route('', methods=['GET'])
@verify_token
def get_reservations():
    """
    Listar reservas del usuario autenticado
    ---
    tags:
      - Reservas
    security:
      - Bearer: []
    responses:
      200:
        description: Lista de reservas del usuario
      401:
        description: Token inválido o expirado
      503:
        description: Servicio de reservas no disponible
    """
    try:
        headers = {'X-User-Id': str(request.user_id)}
        response = requests.get(
            f'{RESERVATION_SERVICE_URL}/reservations',
            params=request.args, headers=headers, timeout=5,
        )
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503


@bp.route('/<int:reserva_id>', methods=['GET'])
@verify_token
def get_reservation(reserva_id):
    """
    Detalle de una reserva
    ---
    tags:
      - Reservas
    security:
      - Bearer: []
    parameters:
      - name: reserva_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Detalle de la reserva
      401:
        description: Token inválido o expirado
      404:
        description: Reserva no encontrada
      503:
        description: Servicio de reservas no disponible
    """
    try:
        headers = {'X-User-Id': str(request.user_id)}
        response = requests.get(
            f'{RESERVATION_SERVICE_URL}/reservations/{reserva_id}',
            headers=headers, timeout=5,
        )
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503


@bp.route('', methods=['POST'])
@verify_token
def create_reservation():
    """
    Crear una reserva
    ---
    tags:
      - Reservas
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [habitacion_id, fecha_checkin, fecha_checkout]
          properties:
            habitacion_id:
              type: integer
              example: 1
            fecha_checkin:
              type: string
              format: date
              example: "2025-06-01"
            fecha_checkout:
              type: string
              format: date
              example: "2025-06-05"
    responses:
      201:
        description: Reserva creada exitosamente
      400:
        description: Datos inválidos o habitación no disponible
      401:
        description: Token inválido o expirado
      503:
        description: Servicio de reservas no disponible
    """
    try:
        headers = {'X-User-Id': str(request.user_id)}
        response = requests.post(
            f'{RESERVATION_SERVICE_URL}/reservations',
            json=request.json, headers=headers, timeout=5,
        )
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503


@bp.route('/<int:reserva_id>/cancel', methods=['PATCH'])
@verify_token
def cancel_reservation(reserva_id):
    """
    Cancelar una reserva
    ---
    tags:
      - Reservas
    security:
      - Bearer: []
    parameters:
      - name: reserva_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Reserva cancelada exitosamente
      401:
        description: Token inválido o expirado
      404:
        description: Reserva no encontrada
      503:
        description: Servicio de reservas no disponible
    """
    try:
        headers = {'X-User-Id': str(request.user_id)}
        response = requests.patch(
            f'{RESERVATION_SERVICE_URL}/reservations/{reserva_id}/cancel',
            headers=headers, timeout=5,
        )
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503


@bp.route('/hotel/<int:hotel_id>', methods=['GET'])
@verify_token
def get_hotel_reservations(hotel_id):
    """
    Listar reservas de un hotel (vista administrador)
    ---
    tags:
      - Reservas
    security:
      - Bearer: []
    parameters:
      - name: hotel_id
        in: path
        type: integer
        required: true
      - name: estado
        in: query
        type: string
        description: Filtrar por estado (confirmada, cancelada, completada)
    responses:
      200:
        description: Lista enriquecida de reservas del hotel con datos de huésped y habitación
      401:
        description: Token inválido o expirado
      503:
        description: Servicio de reservas no disponible
    """
    try:
        resp = requests.get(
            f'{RESERVATION_SERVICE_URL}/reservations/hotel/{hotel_id}',
            params=request.args, timeout=5,
        )
        if resp.status_code != 200:
            return jsonify(resp.json()), resp.status_code

        reservations = resp.json()

        # Enrich with room data (one call for all rooms of this hotel)
        room_map = {}
        try:
            rooms_resp = requests.get(
                f'{CATALOG_SERVICE_URL}/rooms',
                params={'hotel_id': hotel_id}, timeout=3,
            )
            if rooms_resp.status_code == 200:
                for r in rooms_resp.json():
                    room_map[r['id']] = r
        except Exception:
            pass

        # Enrich with user data (one call per unique usuario_id)
        user_map = {}
        unique_user_ids = {r['usuario_id'] for r in reservations if r.get('usuario_id')}
        for uid in unique_user_ids:
            try:
                u_resp = requests.get(f'{AUTH_SERVICE_URL}/users/{uid}', timeout=3)
                if u_resp.status_code == 200:
                    user_map[uid] = u_resp.json()
            except Exception:
                pass

        enriched = []
        for r in reservations:
            room = room_map.get(r.get('habitacion_id'), {})
            user = user_map.get(r.get('usuario_id'), {})
            noches = 0
            try:
                ci = datetime.date.fromisoformat(r['fecha_checkin'])
                co = datetime.date.fromisoformat(r['fecha_checkout'])
                noches = (co - ci).days
            except Exception:
                pass
            enriched.append({
                **r,
                'habitacion_nombre': room.get('nombre') or room.get('tipo') or f"Hab. {r.get('habitacion_id')}",
                'precio_noche': room.get('precio_noche', 0),
                'noches': noches,
                'huesped_nombre': user.get('nombre', f"Huésped #{r.get('usuario_id')}"),
                'huesped_email': user.get('email', ''),
                'huesped_telefono': user.get('telefono', ''),
                'huesped_pais': user.get('pais', ''),
                'huesped_idioma': user.get('idioma_preferido', 'es'),
            })

        return jsonify(enriched), 200
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503


@bp.route('/hotel/<int:hotel_id>/stats', methods=['GET'])
@verify_token
def get_hotel_stats(hotel_id):
    """
    Estadísticas del hotel — KPIs del dashboard
    ---
    tags:
      - Reservas
    security:
      - Bearer: []
    parameters:
      - name: hotel_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: KPIs del hotel
        schema:
          type: object
          properties:
            reservas_activas:
              type: integer
            tasa_ocupacion:
              type: integer
            ingresos_mes:
              type: number
            weekly_occupancy:
              type: array
      401:
        description: Token inválido o expirado
      503:
        description: Servicio de reservas no disponible
    """
    try:
        resp = requests.get(
            f'{RESERVATION_SERVICE_URL}/reservations/hotel/{hotel_id}',
            timeout=5,
        )
        if resp.status_code != 200:
            return jsonify(resp.json()), resp.status_code

        reservations = resp.json()
        now = datetime.date.today()
        month_start = now.replace(day=1)
        days_in_month = cal_mod.monthrange(now.year, now.month)[1]
        month_end = now.replace(day=days_in_month)

        reservas_activas = sum(1 for r in reservations if r.get('estado') == 'confirmada')
        ingresos_mes = sum(
            float(r.get('monto_total', 0)) for r in reservations
            if r.get('estado') in ('confirmada', 'completada')
            and r.get('fecha_creacion', '')[:10] >= str(month_start)
        )

        total_rooms = 0
        try:
            rooms_resp = requests.get(
                f'{CATALOG_SERVICE_URL}/rooms', params={'hotel_id': hotel_id}, timeout=3,
            )
            if rooms_resp.status_code == 200:
                total_rooms = len(rooms_resp.json())
        except Exception:
            pass

        occupied_room_days: set = set()
        for r in reservations:
            if r.get('estado') not in ('confirmada', 'completada'):
                continue
            try:
                ci = datetime.date.fromisoformat(r['fecha_checkin'])
                co = datetime.date.fromisoformat(r['fecha_checkout'])
                start = max(ci, month_start)
                end = min(co, month_end)
                d = start
                while d < end:
                    occupied_room_days.add((r.get('habitacion_id'), str(d)))
                    d += datetime.timedelta(days=1)
            except Exception:
                pass

        if total_rooms > 0:
            tasa_ocupacion = round(len(occupied_room_days) / (total_rooms * days_in_month) * 100)
        else:
            tasa_ocupacion = min(100, reservas_activas * 10)

        weekly = []
        dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
        week_start = now - datetime.timedelta(days=now.weekday())
        for i in range(7):
            day = week_start + datetime.timedelta(days=i)
            if day > now:
                pct = 0
            else:
                count = sum(
                    1 for r in reservations
                    if r.get('estado') in ('confirmada', 'completada')
                    and r.get('fecha_checkin', '') <= str(day) < r.get('fecha_checkout', '')
                )
                pct = round(count / total_rooms * 100) if total_rooms > 0 else min(100, count * 20)
            weekly.append({
                'dia': dias[day.weekday()],
                'dia_num': day.day,
                'mes_num': day.month,
                'porcentaje': min(100, pct),
                'es_hoy': day == now,
            })

        return jsonify({
            'reservas_activas': reservas_activas,
            'reservas_activas_delta': 0,
            'tasa_ocupacion': min(100, tasa_ocupacion),
            'tasa_ocupacion_delta': 0,
            'ingresos_mes': ingresos_mes,
            'ingresos_mes_delta': 0,
            'calificacion_promedio': 0,
            'total_resenas': 0,
            'weekly_occupancy': weekly,
        }), 200
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503


@bp.route('/hotel/<int:hotel_id>/reservations/<int:reserva_id>', methods=['GET'])
@verify_token
def get_hotel_reservation_detail(hotel_id, reserva_id):
    """
    Detalle enriquecido de una reserva del hotel
    ---
    tags:
      - Reservas
    security:
      - Bearer: []
    parameters:
      - name: hotel_id
        in: path
        type: integer
        required: true
      - name: reserva_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Detalle de la reserva con datos del huésped y habitación
      401:
        description: Token inválido o expirado
      404:
        description: Reserva no encontrada
      503:
        description: Servicio de reservas no disponible
    """
    try:
        headers = {'X-Hotel-Id': str(hotel_id)}
        resp = requests.get(
            f'{RESERVATION_SERVICE_URL}/reservations/hotel/{hotel_id}/reservations/{reserva_id}',
            headers=headers, timeout=5,
        )
        if resp.status_code != 200:
            return jsonify(resp.json()), resp.status_code

        r = resp.json()

        room = {}
        try:
            room_resp = requests.get(f'{CATALOG_SERVICE_URL}/rooms/{r["habitacion_id"]}', timeout=3)
            if room_resp.status_code == 200:
                room = room_resp.json()
        except Exception:
            pass

        user = {}
        try:
            u_resp = requests.get(f'{AUTH_SERVICE_URL}/users/{r["usuario_id"]}', timeout=3)
            if u_resp.status_code == 200:
                user = u_resp.json()
        except Exception:
            pass

        noches = 0
        try:
            ci = datetime.date.fromisoformat(r['fecha_checkin'])
            co = datetime.date.fromisoformat(r['fecha_checkout'])
            noches = (co - ci).days
        except Exception:
            pass

        enriched = {
            **r,
            'habitacion_nombre': room.get('nombre') or room.get('tipo') or f"Hab. {r.get('habitacion_id')}",
            'precio_noche': room.get('precio_noche', 0),
            'noches': noches,
            'huesped_nombre': user.get('nombre', f"Huésped #{r.get('usuario_id')}"),
            'huesped_email': user.get('email', ''),
            'huesped_telefono': user.get('telefono', ''),
            'huesped_pais': user.get('pais', ''),
            'huesped_idioma': user.get('idioma_preferido', 'es'),
        }
        return jsonify(enriched), 200
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503


@bp.route('/hotel/<int:hotel_id>/reservations/<int:reserva_id>/cancel', methods=['PATCH'])
@verify_token
def hotel_cancel_reservation(hotel_id, reserva_id):
    """
    Cancelar una reserva como administrador del hotel
    ---
    tags:
      - Reservas
    security:
      - Bearer: []
    parameters:
      - name: hotel_id
        in: path
        type: integer
        required: true
      - name: reserva_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Reserva cancelada por el hotel
      401:
        description: Token inválido o expirado
      404:
        description: Reserva no encontrada
      503:
        description: Servicio de reservas no disponible
    """
    try:
        headers = {'X-Hotel-Id': str(hotel_id)}
        resp = requests.patch(
            f'{RESERVATION_SERVICE_URL}/reservations/{reserva_id}/hotel-cancel',
            headers=headers, timeout=5,
        )
        return jsonify(resp.json()), resp.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503
