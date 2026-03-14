from flask import Blueprint, request, jsonify
from sqlalchemy.orm import sessionmaker
from adapters.orm.models import Usuario, AdminHotel, Base
from sqlalchemy import create_engine
import os
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

bp = Blueprint('auth', __name__)

DATABASE_URL = os.getenv('AUTH_DATABASE_URL', 'postgresql://user:password@localhost:5432/travelhub')
SECRET_KEY = os.getenv('JWT_SECRET', 'supersecretkey')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

@bp.route('/sign-up', methods=['POST'])
def sign_up():
    data = request.json
    session = Session()
    if session.query(Usuario).filter_by(email=data['email']).first():
        session.close()
        return jsonify({'error': 'Email already exists'}), 400
    user = Usuario(
        nombre=data['nombre'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        activo=True,
        fecha_registro=datetime.datetime.utcnow(),
        telefono=data.get('telefono', ''),
        pais=data.get('pais', ''),
        idioma_preferido=data.get('idioma_preferido', 'es'),
        rol=data.get('rol', 'user')
    )
    session.add(user)
    session.commit()
    session.close()
    return jsonify({'message': 'User created'}), 201

@bp.route('/sign-in', methods=['POST'])
def sign_in():
    data = request.json
    session = Session()
    user = session.query(Usuario).filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password_hash, data['password']):
        session.close()
        return jsonify({'error': 'Invalid credentials'}), 401
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, SECRET_KEY, algorithm='HS256')
    session.close()
    return jsonify({'token': token})

@bp.route('/sign-out', methods=['POST'])
def sign_out():
    # En JWT, el sign-out es manejado en el cliente (borrar token)
    return jsonify({'message': 'Signed out'}), 200


def _get_user_id_from_header(req) -> int | None:
    user_id = req.headers.get('X-User-Id')
    try:
        return int(user_id) if user_id else None
    except (ValueError, TypeError):
        return None


@bp.route('/profile', methods=['GET'])
def get_profile():
    user_id = _get_user_id_from_header(request)
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    session = Session()
    try:
        user = session.query(Usuario).filter_by(id=user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({
            'id': user.id,
            'nombre': user.nombre,
            'email': user.email,
            'telefono': user.telefono or '',
            'pais': user.pais or '',
            'idioma_preferido': user.idioma_preferido or 'es',
        }), 200
    finally:
        session.close()


@bp.route('/profile', methods=['PUT'])
def update_profile():
    user_id = _get_user_id_from_header(request)
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json(silent=True) or {}
    session = Session()
    try:
        user = session.query(Usuario).filter_by(id=user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        if 'nombre' in data:
            user.nombre = data['nombre']
        if 'telefono' in data:
            user.telefono = data['telefono']
        if 'pais' in data:
            user.pais = data['pais']
        if 'idioma_preferido' in data:
            user.idioma_preferido = data['idioma_preferido']

        # Cambio de email: verificar unicidad
        if 'email' in data and data['email'] != user.email:
            if session.query(Usuario).filter_by(email=data['email']).first():
                return jsonify({'error': 'Email ya está en uso'}), 409
            user.email = data['email']

        # Cambio de contraseña
        if 'password' in data and data['password']:
            user.password_hash = generate_password_hash(data['password'])

        session.commit()
        return jsonify({
            'id': user.id,
            'nombre': user.nombre,
            'email': user.email,
            'telefono': user.telefono or '',
            'pais': user.pais or '',
            'idioma_preferido': user.idioma_preferido or 'es',
        }), 200
    finally:
        session.close()
