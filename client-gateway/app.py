from flask import Flask, request, jsonify
import requests
import os
import jwt
from functools import wraps

app = Flask(__name__)

AUTH_SERVICE_URL = os.getenv('AUTH_SERVICE_URL', 'http://localhost:5000')
CATALOG_SERVICE_URL = os.getenv('CATALOG_SERVICE_URL', 'http://localhost:5001')
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
            jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)