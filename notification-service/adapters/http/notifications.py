from flask import Blueprint, request, jsonify
from adapters.orm.models import Notificacion
from config import engine, JWT_SECRET
from sqlalchemy.orm import Session
import jwt

bp = Blueprint('notifications', __name__)


def _get_user_id(auth_header: str | None) -> int | None:
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    try:
        payload = jwt.decode(auth_header[7:], JWT_SECRET, algorithms=['HS256'])
        uid = payload.get('user_id') or payload.get('sub') or payload.get('id')
        return int(uid) if uid else None
    except Exception:
        return None


def _notif_dict(n: Notificacion) -> dict:
    return {
        'id': n.id,
        'user_id': n.user_id,
        'tipo': n.tipo,
        'titulo': n.titulo,
        'mensaje': n.mensaje,
        'leida': n.leida,
        'fecha_creacion': n.fecha_creacion.isoformat() if n.fecha_creacion else None,
    }


# ── GET /notifications ─────────────────────────────────────────────
@bp.route('/notifications', methods=['GET'])
def get_notifications():
    user_id = _get_user_id(request.headers.get('Authorization'))
    if not user_id:
        return jsonify({'error': 'No autorizado'}), 401

    with Session(engine) as session:
        notifs = (
            session.query(Notificacion)
            .filter_by(user_id=user_id)
            .order_by(Notificacion.fecha_creacion.desc())
            .all()
        )
        return jsonify([_notif_dict(n) for n in notifs]), 200


# ── POST /notifications  (uso interno desde otros servicios) ───────
@bp.route('/notifications', methods=['POST'])
def create_notification():
    data = request.get_json(silent=True) or {}
    for field in ('user_id', 'tipo', 'titulo', 'mensaje'):
        if field not in data:
            return jsonify({'error': f'Campo requerido: {field}'}), 400

    with Session(engine) as session:
        n = Notificacion(
            user_id=int(data['user_id']),
            tipo=data['tipo'],
            titulo=data['titulo'],
            mensaje=data['mensaje'],
        )
        session.add(n)
        session.commit()
        session.refresh(n)
        return jsonify(_notif_dict(n)), 201


# ── PATCH /notifications/<id>/read ────────────────────────────────
@bp.route('/notifications/<int:notif_id>/read', methods=['PATCH'])
def mark_read(notif_id: int):
    user_id = _get_user_id(request.headers.get('Authorization'))
    if not user_id:
        return jsonify({'error': 'No autorizado'}), 401

    with Session(engine) as session:
        n = session.query(Notificacion).filter_by(id=notif_id, user_id=user_id).first()
        if not n:
            return jsonify({'error': 'Notificación no encontrada'}), 404
        n.leida = True
        session.commit()
        return jsonify({'message': 'Marcada como leída'}), 200


# ── PATCH /notifications/read-all ─────────────────────────────────
@bp.route('/notifications/read-all', methods=['PATCH'])
def mark_all_read():
    user_id = _get_user_id(request.headers.get('Authorization'))
    if not user_id:
        return jsonify({'error': 'No autorizado'}), 401

    with Session(engine) as session:
        session.query(Notificacion).filter_by(user_id=user_id, leida=False).update({'leida': True})
        session.commit()
        return jsonify({'message': 'Todas marcadas como leídas'}), 200


# ── DELETE /notifications/<id> ────────────────────────────────────
@bp.route('/notifications/<int:notif_id>', methods=['DELETE'])
def delete_notification(notif_id: int):
    user_id = _get_user_id(request.headers.get('Authorization'))
    if not user_id:
        return jsonify({'error': 'No autorizado'}), 401

    with Session(engine) as session:
        n = session.query(Notificacion).filter_by(id=notif_id, user_id=user_id).first()
        if not n:
            return jsonify({'error': 'Notificación no encontrada'}), 404
        session.delete(n)
        session.commit()
        return jsonify({'message': 'Eliminada'}), 200
