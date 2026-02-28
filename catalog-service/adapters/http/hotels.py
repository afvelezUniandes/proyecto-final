from flask import Blueprint, jsonify, request
from sqlalchemy.orm import sessionmaker
from adapters.orm.models import Hotel, Habitacion, Base
from sqlalchemy import create_engine
import os

bp = Blueprint('hotels', __name__)

DATABASE_URL = os.getenv('CATALOG_DATABASE_URL', 'postgresql://user:password@localhost:5432/travelhub')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

@bp.route('/hotels', methods=['GET'])
def get_hotels():
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
    return jsonify({
        'total': total,
        'page': page,
        'per_page': per_page,
        'hotels': result
    })

@bp.route('/rooms', methods=['GET'])
def get_rooms():
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
    return jsonify(result)
