from flask import Blueprint, jsonify, request, current_app
from sqlalchemy.orm import sessionmaker
from adapters.orm.models import Hotel, Habitacion, Base
from sqlalchemy import create_engine
import os
import uuid
import boto3
from botocore.exceptions import BotoCoreError, ClientError

bp = Blueprint('hotels', __name__)

DATABASE_URL = os.getenv('CATALOG_DATABASE_URL', 'postgresql://user:password@localhost:5432/travelhub')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

S3_BUCKET = os.getenv('S3_BUCKET', 'travelhub-images-proyecto')
S3_REGION = os.getenv('S3_REGION', 'us-east-1')

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}

def _allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def make_cache_key_hotels():
    """Genera una cache key basada en los parámetros de la query"""
    args = request.args
    key_parts = [
        f"nombre:{args.get('nombre', '')}",
        f"ciudad:{args.get('ciudad', '')}",
        f"pais:{args.get('pais', '')}",
        f"estrellas:{args.get('estrellas', '')}",
        f"activo:{args.get('activo', '')}",
        f"page:{args.get('page', '1')}",
        f"per_page:{args.get('per_page', '20')}"
    ]
    return 'hotels:' + ':'.join(key_parts)

@bp.route('/cities', methods=['GET'])
def get_cities():
    """Devuelve la lista de ciudades distintas que tienen hoteles activos."""
    cache = current_app.cache
    cache_key = 'cities:all'

    cached = cache.get(cache_key)
    if cached is not None:
        response = jsonify(cached)
        response.headers['X-Cache'] = 'HIT'
        return response

    session = Session()
    try:
        cities = (
            session.query(Hotel.ciudad)
            .filter(Hotel.activo.is_(True))
            .distinct()
            .order_by(Hotel.ciudad)
            .all()
        )
        result = [c.ciudad for c in cities if c.ciudad]
        cache.set(cache_key, result)
        response = jsonify(result)
        response.headers['X-Cache'] = 'MISS'
        return response, 200
    finally:
        session.close()


@bp.route('/hotels', methods=['GET'])
def get_hotels():
    cache = current_app.cache
    cache_key = make_cache_key_hotels()
    
    # Intentar obtener del cache
    cached_result = cache.get(cache_key)
    if cached_result:
        response = jsonify(cached_result)
        response.headers['X-Cache'] = 'HIT'
        return response
    
    # Si no está en cache, consultar la base de datos
    session = Session()
    query = session.query(Hotel)
    # Filtros
    nombre = request.args.get('nombre')
    ciudad = request.args.get('ciudad')
    pais = request.args.get('pais')
    estrellas = request.args.get('estrellas')
    activo = request.args.get('activo')
    if nombre:
        query = query.filter(Hotel.nombre.ilike(f'%{nombre}%'))
    if ciudad:
        query = query.filter(Hotel.ciudad.ilike(f'%{ciudad}%'))
    if pais:
        query = query.filter(Hotel.pais.ilike(f'%{pais}%'))
    if estrellas:
        query = query.filter(Hotel.estrellas == int(estrellas))
    if activo is not None:
        if activo.lower() == 'true':
            query = query.filter(Hotel.activo.is_(True))
        elif activo.lower() == 'false':
            query = query.filter(Hotel.activo.is_(False))
    # Paginación
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    total = query.count()
    hotels = query.offset((page - 1) * per_page).limit(per_page).all()
    result = [
        {
            'id': h.id,
            'nombre': h.nombre,
            'ciudad': h.ciudad,
            'pais': h.pais,
            'estrellas': h.estrellas,
            'activo': h.activo,
            'image_url': h.image_url,
            'descripcion': h.descripcion,
            'direccion': h.direccion,
        } for h in hotels
    ]
    session.close()
    
    response_data = {
        'total': total,
        'page': page,
        'per_page': per_page,
        'hotels': result
    }
    
    # Guardar en cache
    cache.set(cache_key, response_data)
    
    response = jsonify(response_data)
    response.headers['X-Cache'] = 'MISS'
    return response

@bp.route('/hotels/<int:hotel_id>', methods=['GET'])
def get_hotel(hotel_id):
    session = Session()
    try:
        hotel = session.query(Hotel).filter(Hotel.id == hotel_id).first()
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        return jsonify({
            'id': hotel.id,
            'admin_id': hotel.admin_id,
            'nombre': hotel.nombre,
            'descripcion': hotel.descripcion,
            'direccion': hotel.direccion,
            'ciudad': hotel.ciudad,
            'pais': hotel.pais,
            'estrellas': hotel.estrellas,
            'activo': hotel.activo,
            'image_url': hotel.image_url,
        }), 200
    finally:
        session.close()


@bp.route('/hotels/admin/<int:admin_id>', methods=['GET'])
def get_hotel_by_admin(admin_id):
    session = Session()
    try:
        hotel = session.query(Hotel).filter(Hotel.admin_id == admin_id).first()
        if not hotel:
            return jsonify({'error': 'No hotel found for this admin'}), 404
        return jsonify({
            'id': hotel.id,
            'admin_id': hotel.admin_id,
            'nombre': hotel.nombre,
            'descripcion': hotel.descripcion,
            'direccion': hotel.direccion,
            'ciudad': hotel.ciudad,
            'pais': hotel.pais,
            'estrellas': hotel.estrellas,
            'activo': hotel.activo,
            'image_url': hotel.image_url,
        }), 200
    finally:
        session.close()


@bp.route('/hotels', methods=['POST'])
def create_hotel():
    data = request.json
    session = Session()
    try:
        import datetime
        hotel = Hotel(
            admin_id=data.get('admin_id'),
            nombre=data['nombre'],
            descripcion=data.get('descripcion', ''),
            direccion=data.get('direccion', ''),
            ciudad=data['ciudad'],
            pais=data['pais'],
            estrellas=data.get('estrellas', 3),
            activo=True,
            fecha_creacion=datetime.datetime.utcnow(),
            image_url=data.get('image_url', ''),
        )
        session.add(hotel)
        session.commit()
        cache = current_app.cache
        cache.clear()
        return jsonify({
            'id': hotel.id,
            'admin_id': hotel.admin_id,
            'nombre': hotel.nombre,
            'ciudad': hotel.ciudad,
            'pais': hotel.pais,
            'estrellas': hotel.estrellas,
            'activo': hotel.activo,
        }), 201
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@bp.route('/hotels/<int:hotel_id>', methods=['PUT'])
def update_hotel(hotel_id):
    data = request.json
    session = Session()
    try:
        hotel = session.query(Hotel).filter(Hotel.id == hotel_id).first()
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        if 'nombre' in data:
            hotel.nombre = data['nombre']
        if 'descripcion' in data:
            hotel.descripcion = data['descripcion']
        if 'direccion' in data:
            hotel.direccion = data['direccion']
        if 'ciudad' in data:
            hotel.ciudad = data['ciudad']
        if 'pais' in data:
            hotel.pais = data['pais']
        if 'estrellas' in data:
            hotel.estrellas = data['estrellas']
        if 'image_url' in data:
            hotel.image_url = data['image_url']
        session.commit()
        cache = current_app.cache
        cache.clear()
        return jsonify({
            'id': hotel.id,
            'admin_id': hotel.admin_id,
            'nombre': hotel.nombre,
            'descripcion': hotel.descripcion,
            'direccion': hotel.direccion,
            'ciudad': hotel.ciudad,
            'pais': hotel.pais,
            'estrellas': hotel.estrellas,
            'activo': hotel.activo,
            'image_url': hotel.image_url,
        }), 200
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@bp.route('/rooms', methods=['POST'])
def create_room():
    data = request.json
    session = Session()
    try:
        room = Habitacion(
            hotel_id=data['hotel_id'],
            nombre=data['nombre'],
            tipo=data.get('tipo', 'estandar'),
            capacidad=data.get('capacidad', 2),
            precio_noche=data['precio_noche'],
            moneda=data.get('moneda', 'COP'),
            disponible=True,
            imagen_url=data.get('imagen_url', ''),
        )
        session.add(room)
        session.commit()
        cache = current_app.cache
        cache.clear()
        return jsonify({
            'id': room.id,
            'hotel_id': room.hotel_id,
            'nombre': room.nombre,
            'tipo': room.tipo,
            'capacidad': room.capacidad,
            'precio_noche': float(room.precio_noche),
            'moneda': room.moneda,
            'disponible': room.disponible,
        }), 201
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@bp.route('/rooms/<int:room_id>', methods=['PUT'])
def update_room(room_id):
    data = request.json
    session = Session()
    try:
        room = session.query(Habitacion).filter(Habitacion.id == room_id).first()
        if not room:
            return jsonify({'error': 'Room not found'}), 404
        if 'nombre' in data:
            room.nombre = data['nombre']
        if 'tipo' in data:
            room.tipo = data['tipo']
        if 'capacidad' in data:
            room.capacidad = data['capacidad']
        if 'precio_noche' in data:
            room.precio_noche = data['precio_noche']
        if 'moneda' in data:
            room.moneda = data['moneda']
        if 'disponible' in data:
            room.disponible = data['disponible']
        session.commit()
        cache = current_app.cache
        cache.clear()
        return jsonify({
            'id': room.id,
            'hotel_id': room.hotel_id,
            'nombre': room.nombre,
            'tipo': room.tipo,
            'capacidad': room.capacidad,
            'precio_noche': float(room.precio_noche),
            'moneda': room.moneda,
            'disponible': room.disponible,
        }), 200
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@bp.route('/rooms/<int:room_id>', methods=['DELETE'])
def delete_room(room_id):
    session = Session()
    try:
        room = session.query(Habitacion).filter(Habitacion.id == room_id).first()
        if not room:
            return jsonify({'error': 'Room not found'}), 404
        session.delete(room)
        session.commit()
        cache = current_app.cache
        cache.clear()
        return jsonify({'message': 'Room deleted'}), 200
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@bp.route('/rooms', methods=['GET'])
def get_rooms():
    cache = current_app.cache

    hotel_id = request.args.get('hotel_id')
    cache_key = f'rooms:hotel:{hotel_id}' if hotel_id else 'rooms:all'

    # Intentar obtener del cache
    cached_result = cache.get(cache_key)
    if cached_result:
        response = jsonify(cached_result)
        response.headers['X-Cache'] = 'HIT'
        return response

    # Si no está en cache, consultar la base de datos
    session = Session()
    query = session.query(Habitacion)
    if hotel_id:
        query = query.filter(Habitacion.hotel_id == int(hotel_id))
    rooms = query.all()
    result = [
        {
            'id': r.id,
            'hotel_id': r.hotel_id,
            'nombre': r.nombre,
            'tipo': r.tipo,
            'capacidad': r.capacidad,
            'precio_noche': float(r.precio_noche),
            'moneda': r.moneda,
            'disponible': r.disponible
        } for r in rooms
    ]
    session.close()
    
    # Guardar en cache
    cache.set(cache_key, result)
    
    response = jsonify(result)
    response.headers['X-Cache'] = 'MISS'
    return response

@bp.route('/cache/clear', methods=['POST'])
def clear_cache():
    """Endpoint para limpiar el cache manualmente"""
    try:
        cache = current_app.cache
        cache.clear()
        return jsonify({'message': 'Cache cleared successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/cache/stats', methods=['GET'])
def cache_stats():
    """Endpoint para ver estadísticas del cache (útil para debugging)"""
    try:
        cache = current_app.cache
        return jsonify({
            'cache_type': 'SimpleCache',
            'default_ttl': int(os.getenv('CACHE_TTL', 300)),
            'info': 'In-memory cache (per instance)'
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/hotels/<int:hotel_id>/image', methods=['POST'])
def upload_hotel_image(hotel_id):
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if not file or not file.filename:
        return jsonify({'error': 'Empty file'}), 400
    if not _allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed. Use jpg, jpeg, png or webp'}), 400
    if file.content_length and file.content_length > 5 * 1024 * 1024:
        return jsonify({'error': 'File exceeds 5 MB limit'}), 400

    session = Session()
    try:
        hotel = session.query(Hotel).filter(Hotel.id == hotel_id).first()
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404

        ext = file.filename.rsplit('.', 1)[1].lower()
        key = f"hotels/{uuid.uuid4().hex}.{ext}"

        s3 = boto3.client('s3', region_name=S3_REGION)
        s3.upload_fileobj(
            file,
            S3_BUCKET,
            key,
            ExtraArgs={'ContentType': file.content_type or 'image/jpeg'},
        )

        image_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{key}"
        hotel.image_url = image_url
        session.commit()

        current_app.cache.clear()

        return jsonify({'image_url': image_url}), 200
    except (BotoCoreError, ClientError) as e:
        session.rollback()
        return jsonify({'error': f'S3 upload failed: {str(e)}'}), 500
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()
