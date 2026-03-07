from flask import Blueprint, jsonify, request, current_app
from sqlalchemy.orm import sessionmaker
from adapters.orm.models import Hotel, Habitacion, Base
from sqlalchemy import create_engine
import os

bp = Blueprint('hotels', __name__)

DATABASE_URL = os.getenv('CATALOG_DATABASE_URL', 'postgresql://user:password@localhost:5432/travelhub')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

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
            'activo': h.activo
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

@bp.route('/rooms', methods=['GET'])
def get_rooms():
    cache = current_app.cache
    cache_key = 'rooms:all'
    
    # Intentar obtener del cache
    cached_result = cache.get(cache_key)
    if cached_result:
        response = jsonify(cached_result)
        response.headers['X-Cache'] = 'HIT'
        return response
    
    # Si no está en cache, consultar la base de datos
    session = Session()
    rooms = session.query(Habitacion).all()
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
