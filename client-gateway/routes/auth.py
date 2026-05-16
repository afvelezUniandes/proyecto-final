import requests
from flask import Blueprint, request, jsonify
from config import AUTH_SERVICE_URL
from middleware import verify_token

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/sign-up', methods=['POST'])
def sign_up():
    """
    Registro de un nuevo usuario
    ---
    tags:
      - Autenticación
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [email, password, nombre, rol]
          properties:
            email:
              type: string
              example: usuario@correo.com
            password:
              type: string
              example: MiPassword123
            nombre:
              type: string
              example: Juan Pérez
            rol:
              type: string
              enum: [cliente, hotel]
              example: cliente
            telefono:
              type: string
              example: "+573001234567"
            pais:
              type: string
              example: Colombia
    responses:
      201:
        description: Usuario creado exitosamente
        schema:
          $ref: '#/definitions/Usuario'
      400:
        description: Datos inválidos o campos faltantes
        schema:
          $ref: '#/definitions/Error'
      409:
        description: Email ya registrado
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de autenticación no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.post(f'{AUTH_SERVICE_URL}/sign-up', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Auth service unavailable'}), 503


@bp.route('/sign-in', methods=['POST'])
def sign_in():
    """
    Inicio de sesión
    ---
    tags:
      - Autenticación
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [email, password]
          properties:
            email:
              type: string
              example: usuario@correo.com
            password:
              type: string
              example: MiPassword123
    responses:
      200:
        description: Token JWT generado
        schema:
          $ref: '#/definitions/TokenResponse'
      401:
        description: Credenciales inválidas
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de autenticación no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.post(f'{AUTH_SERVICE_URL}/sign-in', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Auth service unavailable'}), 503


@bp.route('/sign-out', methods=['POST'])
@verify_token
def sign_out():
    """
    Cierre de sesión
    ---
    tags:
      - Autenticación
    security:
      - Bearer: []
    responses:
      200:
        description: Sesión cerrada exitosamente
        schema:
          $ref: '#/definitions/MessageResponse'
      401:
        description: Token inválido o expirado
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de autenticación no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.post(f'{AUTH_SERVICE_URL}/sign-out', timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Auth service unavailable'}), 503


@bp.route('/profile', methods=['GET'])
@verify_token
def get_profile():
    """
    Obtener perfil del usuario autenticado
    ---
    tags:
      - Autenticación
    security:
      - Bearer: []
    responses:
      200:
        description: Datos del perfil del usuario
        schema:
          $ref: '#/definitions/Usuario'
      401:
        description: Token inválido o expirado
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de autenticación no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        headers = {'X-User-Id': str(request.user_id)}
        response = requests.get(f'{AUTH_SERVICE_URL}/profile', headers=headers, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Auth service unavailable'}), 503


@bp.route('/profile', methods=['PUT'])
@verify_token
def update_profile():
    """
    Actualizar perfil del usuario autenticado
    ---
    tags:
      - Autenticación
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            nombre:
              type: string
            telefono:
              type: string
            pais:
              type: string
            idioma_preferido:
              type: string
              example: es
    responses:
      200:
        description: Perfil actualizado exitosamente
        schema:
          $ref: '#/definitions/Usuario'
      401:
        description: Token inválido o expirado
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de autenticación no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        headers = {'X-User-Id': str(request.user_id)}
        response = requests.put(f'{AUTH_SERVICE_URL}/profile', json=request.json, headers=headers, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Auth service unavailable'}), 503
