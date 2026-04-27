from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
CORS(app)

AUTH_SERVICE_URL = os.getenv('AUTH_SERVICE_URL', 'http://localhost:5000')
CATALOG_SERVICE_URL = os.getenv('CATALOG_SERVICE_URL', 'http://localhost:5001')
RESERVATION_SERVICE_URL = os.getenv('RESERVATION_SERVICE_URL', 'http://localhost:5002')
JWT_SECRET = os.getenv('JWT_SECRET', 'supersecretkey')

def verify_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            # Inyectar user_id como atributo de request para usarlo en los proxies
            request.user_id = payload.get('user_id')
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/')
def hello():
    return {'message': 'Client Gateway - OK', 'services': {
        'auth': AUTH_SERVICE_URL,
        'catalog': CATALOG_SERVICE_URL
    }}

@app.route('/health')
def health():
    """Health check endpoint para ALB"""
    health_status = {
        'status': 'healthy',
        'service': 'client-gateway',
        'backends': {}
    }
    status_code = 200
    
    # Verificar conectividad con auth service
    try:
        response = requests.get(f'{AUTH_SERVICE_URL}/health', timeout=2)
        health_status['backends']['auth'] = 'connected' if response.status_code == 200 else 'degraded'
    except:
        health_status['backends']['auth'] = 'unreachable'
        health_status['status'] = 'degraded'
        status_code = 200  # Gateway sigue healthy aunque backends fallen
    
    # Verificar conectividad con catalog service
    try:
        response = requests.get(f'{CATALOG_SERVICE_URL}/health', timeout=2)
        health_status['backends']['catalog'] = 'connected' if response.status_code == 200 else 'degraded'
    except:
        health_status['backends']['catalog'] = 'unreachable'
        health_status['status'] = 'degraded'
        status_code = 200  # Gateway sigue healthy aunque backends fallen
    
    return jsonify(health_status), status_code

# Auth endpoints (sin validación de token)
@app.route('/auth/sign-up', methods=['POST'])
def sign_up():
    try:
        response = requests.post(f'{AUTH_SERVICE_URL}/sign-up', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Auth service unavailable'}), 503

@app.route('/auth/sign-in', methods=['POST'])
def sign_in():
    try:
        response = requests.post(f'{AUTH_SERVICE_URL}/sign-in', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Auth service unavailable'}), 503

@app.route('/auth/sign-out', methods=['POST'])
@verify_token
def sign_out():
    try:
        response = requests.post(f'{AUTH_SERVICE_URL}/sign-out', timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Auth service unavailable'}), 503

# Catalog endpoints (públicos por ahora, puedes agregar @verify_token si lo necesitas)
@app.route('/catalog/cities', methods=['GET'])
def get_cities():
    try:
        response = requests.get(f'{CATALOG_SERVICE_URL}/cities', timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@app.route('/catalog/hotels', methods=['GET'])
def get_hotels():
    try:
        response = requests.get(f'{CATALOG_SERVICE_URL}/hotels', params=request.args, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Catalog service unavailable'}), 503

@app.route('/catalog/rooms', methods=['GET'])
def get_rooms():
    try:
        response = requests.get(f'{CATALOG_SERVICE_URL}/rooms', params=request.args, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Catalog service unavailable'}), 503

# Reservation endpoints (requieren token JWT)
@app.route('/reservations/occupied-rooms', methods=['GET'])
def get_occupied_rooms_public():
    """Endpoint público — sin token. Devuelve IDs de habitaciones ocupadas en fechas dadas."""
    try:
        response = requests.get(
            f'{RESERVATION_SERVICE_URL}/reservations/occupied-rooms',
            params=request.args, timeout=5
        )
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503


@app.route('/reservations', methods=['GET'])
@verify_token
def get_reservations():
    try:
        headers = {'X-User-Id': str(request.user_id)}
        response = requests.get(f'{RESERVATION_SERVICE_URL}/reservations', params=request.args, headers=headers, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503

@app.route('/reservations/<int:reserva_id>', methods=['GET'])
@verify_token
def get_reservation(reserva_id):
    try:
        headers = {'X-User-Id': str(request.user_id)}
        response = requests.get(f'{RESERVATION_SERVICE_URL}/reservations/{reserva_id}', headers=headers, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503

@app.route('/reservations', methods=['POST'])
@verify_token
def create_reservation():
    try:
        headers = {'X-User-Id': str(request.user_id)}
        response = requests.post(f'{RESERVATION_SERVICE_URL}/reservations', json=request.json, headers=headers, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503

@app.route('/reservations/<int:reserva_id>/cancel', methods=['PATCH'])
@verify_token
def cancel_reservation(reserva_id):
    try:
        headers = {'X-User-Id': str(request.user_id)}
        response = requests.patch(f'{RESERVATION_SERVICE_URL}/reservations/{reserva_id}/cancel', headers=headers, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503

# Profile endpoints
@app.route('/auth/profile', methods=['GET'])
@verify_token
def get_profile():
    try:
        headers = {'X-User-Id': str(request.user_id)}
        response = requests.get(f'{AUTH_SERVICE_URL}/profile', headers=headers, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Auth service unavailable'}), 503

@app.route('/auth/profile', methods=['PUT'])
@verify_token
def update_profile():
    try:
        headers = {'X-User-Id': str(request.user_id)}
        response = requests.put(f'{AUTH_SERVICE_URL}/profile', json=request.json, headers=headers, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Auth service unavailable'}), 503

# Hotel admin endpoints
@app.route('/catalog/hotels/mine', methods=['GET'])
@verify_token
def get_my_hotel():
    try:
        response = requests.get(f'{CATALOG_SERVICE_URL}/hotels/admin/{request.user_id}', timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@app.route('/catalog/hotels/<int:hotel_id>', methods=['GET'])
def get_hotel_detail(hotel_id):
    try:
        response = requests.get(f'{CATALOG_SERVICE_URL}/hotels/{hotel_id}', timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@app.route('/catalog/hotels', methods=['POST'])
@verify_token
def create_hotel():
    try:
        body = request.json or {}
        body['admin_id'] = request.user_id
        response = requests.post(f'{CATALOG_SERVICE_URL}/hotels', json=body, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@app.route('/catalog/hotels/<int:hotel_id>', methods=['PUT'])
@verify_token
def update_hotel(hotel_id):
    try:
        response = requests.put(f'{CATALOG_SERVICE_URL}/hotels/{hotel_id}', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@app.route('/catalog/hotels/<int:hotel_id>/image', methods=['POST'])
@verify_token
def upload_hotel_image(hotel_id):
    try:
        response = requests.post(
            f'{CATALOG_SERVICE_URL}/hotels/{hotel_id}/image',
            files={'file': (request.files['file'].filename, request.files['file'].stream, request.files['file'].content_type)},
            timeout=30,
        )
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@app.route('/catalog/rooms', methods=['POST'])
@verify_token
def create_room():
    try:
        response = requests.post(f'{CATALOG_SERVICE_URL}/rooms', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@app.route('/catalog/rooms/<int:room_id>', methods=['PUT'])
@verify_token
def update_room(room_id):
    try:
        response = requests.put(f'{CATALOG_SERVICE_URL}/rooms/{room_id}', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@app.route('/catalog/rooms/<int:room_id>', methods=['DELETE'])
@verify_token
def delete_room(room_id):
    try:
        response = requests.delete(f'{CATALOG_SERVICE_URL}/rooms/{room_id}', timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@app.route('/reservations/hotel/<int:hotel_id>', methods=['GET'])
@verify_token
def get_hotel_reservations(hotel_id):
    try:
        resp = requests.get(
            f'{RESERVATION_SERVICE_URL}/reservations/hotel/{hotel_id}',
            params=request.args, timeout=5
        )
        if resp.status_code != 200:
            return jsonify(resp.json()), resp.status_code

        reservations = resp.json()

        # ── Enrich with room data (one call for all rooms of this hotel) ──
        room_map = {}
        try:
            rooms_resp = requests.get(
                f'{CATALOG_SERVICE_URL}/rooms',
                params={'hotel_id': hotel_id}, timeout=3
            )
            if rooms_resp.status_code == 200:
                for r in rooms_resp.json():
                    room_map[r['id']] = r
        except Exception:
            pass

        # ── Enrich with user data (one call per unique usuario_id) ──
        user_map = {}
        unique_user_ids = {r['usuario_id'] for r in reservations if r.get('usuario_id')}
        for uid in unique_user_ids:
            try:
                u_resp = requests.get(f'{AUTH_SERVICE_URL}/users/{uid}', timeout=3)
                if u_resp.status_code == 200:
                    user_map[uid] = u_resp.json()
            except Exception:
                pass

        # ── Build enriched response ──
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


@app.route('/reservations/hotel/<int:hotel_id>/stats', methods=['GET'])
@verify_token
def get_hotel_stats(hotel_id):
    """Calcula estadísticas del hotel a partir de las reservas reales."""
    try:
        resp = requests.get(
            f'{RESERVATION_SERVICE_URL}/reservations/hotel/{hotel_id}',
            timeout=5
        )
        if resp.status_code != 200:
            return jsonify(resp.json()), resp.status_code

        reservations = resp.json()
        now = datetime.date.today()
        month_start = now.replace(day=1)

        reservas_activas = sum(1 for r in reservations if r.get('estado') == 'confirmada')
        ingresos_mes = sum(
            float(r.get('monto_total', 0)) for r in reservations
            if r.get('estado') in ('confirmada', 'completada')
            and r.get('fecha_creacion', '')[:10] >= str(month_start)
        )

        # Ocupación semanal: porcentaje de días con al menos una reserva activa en los últimos 7 días
        weekly = []
        dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
        today_weekday = now.weekday()
        for i in range(7):
            day_offset = (i - today_weekday) % 7
            day = now + datetime.timedelta(days=day_offset - 6)
            count = sum(
                1 for r in reservations
                if r.get('estado') == 'confirmada'
                and r.get('fecha_checkin', '') <= str(day) <= r.get('fecha_checkout', '')
            )
            total_rooms = max(count, 1)
            weekly.append({'dia': dias[i], 'porcentaje': min(100, count * 20)})

        return jsonify({
            'reservas_activas': reservas_activas,
            'reservas_activas_delta': 0,
            'tasa_ocupacion': min(100, reservas_activas * 10),
            'tasa_ocupacion_delta': 0,
            'ingresos_mes': ingresos_mes,
            'ingresos_mes_delta': 0,
            'calificacion_promedio': 0,
            'total_resenas': 0,
            'weekly_occupancy': weekly,
        }), 200
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503


@app.route('/reservations/hotel/<int:hotel_id>/reservations/<int:reserva_id>/cancel', methods=['PATCH'])
@verify_token
def hotel_cancel_reservation(hotel_id, reserva_id):
    """Cancela una reserva como administrador del hotel."""
    try:
        headers = {'X-Hotel-Id': str(hotel_id)}
        resp = requests.patch(
            f'{RESERVATION_SERVICE_URL}/reservations/{reserva_id}/hotel-cancel',
            headers=headers, timeout=5
        )
        return jsonify(resp.json()), resp.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Reservation service unavailable'}), 503


if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port)