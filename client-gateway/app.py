from flask import Flask, request, jsonify
import requests
import os
import jwt
from functools import wraps

app = Flask(__name__)

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

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port)