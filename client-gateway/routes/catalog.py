import requests
from flask import Blueprint, request, jsonify
from config import CATALOG_SERVICE_URL
from middleware import verify_token

bp = Blueprint('catalog', __name__, url_prefix='/catalog')


@bp.route('/cities', methods=['GET'])
def get_cities():
    """
    Listar ciudades disponibles
    ---
    tags:
      - Catálogo
    responses:
      200:
        description: Lista de ciudades
        schema:
          type: array
          items:
            type: string
          example: ["Bogotá", "Medellín", "Cartagena"]
      503:
        description: Servicio de catálogo no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.get(f'{CATALOG_SERVICE_URL}/cities', timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@bp.route('/hotels', methods=['GET'])
def get_hotels():
    """
    Buscar hoteles con filtros y paginación
    ---
    tags:
      - Catálogo
    parameters:
      - name: nombre
        in: query
        type: string
        description: Filtrar por nombre
      - name: ciudad
        in: query
        type: string
        description: Filtrar por ciudad
      - name: pais
        in: query
        type: string
        description: Filtrar por país
      - name: estrellas
        in: query
        type: integer
        description: Filtrar por número de estrellas
      - name: capacidad
        in: query
        type: integer
        description: Capacidad mínima requerida
      - name: page
        in: query
        type: integer
        default: 1
      - name: per_page
        in: query
        type: integer
        default: 10
    responses:
      200:
        description: Lista paginada de hoteles
        schema:
          $ref: '#/definitions/HotelesResponse'
      503:
        description: Servicio de catálogo no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.get(f'{CATALOG_SERVICE_URL}/hotels', params=request.args, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@bp.route('/hotels/mine', methods=['GET'])
@verify_token
def get_my_hotel():
    """
    Obtener el hotel del administrador autenticado
    ---
    tags:
      - Catálogo
    security:
      - Bearer: []
    responses:
      200:
        description: Datos del hotel administrado
        schema:
          $ref: '#/definitions/Hotel'
      401:
        description: Token inválido o expirado
        schema:
          $ref: '#/definitions/Error'
      404:
        description: Hotel no encontrado
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de catálogo no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.get(f'{CATALOG_SERVICE_URL}/hotels/admin/{request.user_id}', timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@bp.route('/hotels/<int:hotel_id>', methods=['GET'])
def get_hotel_detail(hotel_id):
    """
    Detalle de un hotel
    ---
    tags:
      - Catálogo
    parameters:
      - name: hotel_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Datos del hotel
        schema:
          $ref: '#/definitions/Hotel'
      404:
        description: Hotel no encontrado
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de catálogo no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.get(f'{CATALOG_SERVICE_URL}/hotels/{hotel_id}', timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@bp.route('/hotels', methods=['POST'])
@verify_token
def create_hotel():
    """
    Crear un hotel
    ---
    tags:
      - Catálogo
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [nombre, ciudad, pais, estrellas]
          properties:
            nombre:
              type: string
              example: Hotel Santamaría
            ciudad:
              type: string
              example: Bogotá
            pais:
              type: string
              example: Colombia
            estrellas:
              type: integer
              example: 4
            descripcion:
              type: string
    responses:
      201:
        description: Hotel creado exitosamente
        schema:
          $ref: '#/definitions/Hotel'
      400:
        description: Datos inválidos
        schema:
          $ref: '#/definitions/Error'
      401:
        description: Token inválido o expirado
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de catálogo no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        body = request.json or {}
        body['admin_id'] = request.user_id
        response = requests.post(f'{CATALOG_SERVICE_URL}/hotels', json=body, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@bp.route('/hotels/<int:hotel_id>', methods=['PUT'])
@verify_token
def update_hotel(hotel_id):
    """
    Actualizar un hotel
    ---
    tags:
      - Catálogo
    security:
      - Bearer: []
    parameters:
      - name: hotel_id
        in: path
        type: integer
        required: true
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            nombre:
              type: string
            ciudad:
              type: string
            pais:
              type: string
            estrellas:
              type: integer
            descripcion:
              type: string
    responses:
      200:
        description: Hotel actualizado exitosamente
        schema:
          $ref: '#/definitions/Hotel'
      401:
        description: Token inválido o expirado
        schema:
          $ref: '#/definitions/Error'
      404:
        description: Hotel no encontrado
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de catálogo no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.put(f'{CATALOG_SERVICE_URL}/hotels/{hotel_id}', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@bp.route('/hotels/<int:hotel_id>/image', methods=['POST'])
@verify_token
def upload_hotel_image(hotel_id):
    """
    Subir imagen de portada del hotel
    ---
    tags:
      - Catálogo
    security:
      - Bearer: []
    consumes:
      - multipart/form-data
    parameters:
      - name: hotel_id
        in: path
        type: integer
        required: true
      - name: file
        in: formData
        type: file
        required: true
        description: Imagen del hotel (jpg, png)
    responses:
      200:
        description: Imagen subida correctamente
        schema:
          type: object
          properties:
            image_url:
              type: string
              example: "https://bucket.s3.amazonaws.com/hotel-1.jpg"
      401:
        description: Token inválido o expirado
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de catálogo no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.post(
            f'{CATALOG_SERVICE_URL}/hotels/{hotel_id}/image',
            files={'file': (
                request.files['file'].filename,
                request.files['file'].stream,
                request.files['file'].content_type,
            )},
            timeout=30,
        )
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@bp.route('/rooms', methods=['GET'])
def get_rooms():
    """
    Listar habitaciones
    ---
    tags:
      - Catálogo
    parameters:
      - name: hotel_id
        in: query
        type: integer
        description: Filtrar por hotel
    responses:
      200:
        description: Lista de habitaciones
        schema:
          type: array
          items:
            $ref: '#/definitions/Habitacion'
      503:
        description: Servicio de catálogo no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.get(f'{CATALOG_SERVICE_URL}/rooms', params=request.args, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@bp.route('/rooms', methods=['POST'])
@verify_token
def create_room():
    """
    Crear una habitación
    ---
    tags:
      - Catálogo
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [hotel_id, tipo, capacidad, precio_noche]
          properties:
            hotel_id:
              type: integer
              example: 1
            tipo:
              type: string
              example: Doble
            nombre:
              type: string
              example: Suite 101
            capacidad:
              type: integer
              example: 2
            precio_noche:
              type: number
              example: 150000
            descripcion:
              type: string
    responses:
      201:
        description: Habitación creada exitosamente
        schema:
          $ref: '#/definitions/Habitacion'
      400:
        description: Datos inválidos
        schema:
          $ref: '#/definitions/Error'
      401:
        description: Token inválido o expirado
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de catálogo no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.post(f'{CATALOG_SERVICE_URL}/rooms', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@bp.route('/rooms/<int:room_id>', methods=['PUT'])
@verify_token
def update_room(room_id):
    """
    Actualizar una habitación
    ---
    tags:
      - Catálogo
    security:
      - Bearer: []
    parameters:
      - name: room_id
        in: path
        type: integer
        required: true
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            tipo:
              type: string
            nombre:
              type: string
            capacidad:
              type: integer
            precio_noche:
              type: number
            descripcion:
              type: string
    responses:
      200:
        description: Habitación actualizada exitosamente
        schema:
          $ref: '#/definitions/Habitacion'
      401:
        description: Token inválido o expirado
        schema:
          $ref: '#/definitions/Error'
      404:
        description: Habitación no encontrada
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de catálogo no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.put(f'{CATALOG_SERVICE_URL}/rooms/{room_id}', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@bp.route('/rooms/<int:room_id>', methods=['DELETE'])
@verify_token
def delete_room(room_id):
    """
    Eliminar (dar de baja) una habitación
    ---
    tags:
      - Catálogo
    security:
      - Bearer: []
    parameters:
      - name: room_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Habitación marcada como eliminada
        schema:
          $ref: '#/definitions/MessageResponse'
      401:
        description: Token inválido o expirado
        schema:
          $ref: '#/definitions/Error'
      404:
        description: Habitación no encontrada
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de catálogo no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.delete(f'{CATALOG_SERVICE_URL}/rooms/{room_id}', timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503


@bp.route('/rooms/<int:room_id>/restore', methods=['PATCH'])
@verify_token
def restore_room(room_id):
    """
    Restaurar una habitación eliminada
    ---
    tags:
      - Catálogo
    security:
      - Bearer: []
    parameters:
      - name: room_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Habitación restaurada exitosamente
        schema:
          $ref: '#/definitions/MessageResponse'
      401:
        description: Token inválido o expirado
        schema:
          $ref: '#/definitions/Error'
      404:
        description: Habitación no encontrada
        schema:
          $ref: '#/definitions/Error'
      503:
        description: Servicio de catálogo no disponible
        schema:
          $ref: '#/definitions/Error'
    """
    try:
        response = requests.patch(f'{CATALOG_SERVICE_URL}/rooms/{room_id}/restore', timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Catalog service unavailable'}), 503
