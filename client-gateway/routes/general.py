import requests
from flask import Blueprint, jsonify
from config import AUTH_SERVICE_URL, CATALOG_SERVICE_URL, RESERVATION_SERVICE_URL

bp = Blueprint('general', __name__)


@bp.route('/')
def hello():
    """
    Estado del gateway
    ---
    tags:
      - General
    responses:
      200:
        description: Gateway activo y servicios configurados
    """
    return {'message': 'Client Gateway - OK', 'services': {
        'auth': AUTH_SERVICE_URL,
        'catalog': CATALOG_SERVICE_URL,
        'reservations': RESERVATION_SERVICE_URL,
    }}


@bp.route('/health')
def health():
    """
    Estado de salud del gateway y sus backends
    ---
    tags:
      - General
    responses:
      200:
        description: Estado del gateway y conectividad con servicios backend
        schema:
          type: object
          properties:
            status:
              type: string
              example: healthy
            service:
              type: string
              example: client-gateway
            backends:
              type: object
    """
    health_status = {
        'status': 'healthy',
        'service': 'client-gateway',
        'backends': {},
    }
    status_code = 200

    try:
        response = requests.get(f'{AUTH_SERVICE_URL}/health', timeout=2)
        health_status['backends']['auth'] = 'connected' if response.status_code == 200 else 'degraded'
    except Exception:
        health_status['backends']['auth'] = 'unreachable'
        health_status['status'] = 'degraded'

    try:
        response = requests.get(f'{CATALOG_SERVICE_URL}/health', timeout=2)
        health_status['backends']['catalog'] = 'connected' if response.status_code == 200 else 'degraded'
    except Exception:
        health_status['backends']['catalog'] = 'unreachable'
        health_status['status'] = 'degraded'

    try:
        response = requests.get(f'{RESERVATION_SERVICE_URL}/health', timeout=2)
        health_status['backends']['reservations'] = 'connected' if response.status_code == 200 else 'degraded'
    except Exception:
        health_status['backends']['reservations'] = 'unreachable'
        health_status['status'] = 'degraded'

    return jsonify(health_status), status_code
