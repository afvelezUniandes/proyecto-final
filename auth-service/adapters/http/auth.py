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
