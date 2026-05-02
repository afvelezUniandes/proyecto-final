import pytest
import jwt
import datetime
from unittest.mock import patch, MagicMock

from adapters.orm.models import Notificacion
from adapters.http.notifications import _send_email_async
from config import engine
from sqlalchemy.orm import Session


def make_token(user_id: int) -> str:
    return jwt.encode(
        {
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        },
        'test_secret',
        algorithm='HS256',
    )


# ─────────────────────────────────────────────────────────────────────
# POST /notifications
# ─────────────────────────────────────────────────────────────────────
class TestCreateNotification:
    def test_create_basic_returns_201(self, client):
        resp = client.post('/notifications', json={
            'user_id': 1, 'tipo': 'info', 'titulo': 'Hola', 'mensaje': 'Test',
        })
        assert resp.status_code == 201
        data = resp.get_json()
        assert data['titulo'] == 'Hola'
        assert data['leida'] is False
        assert data['email_enviado'] is False

    def test_missing_required_field_returns_400(self, client):
        resp = client.post('/notifications', json={
            'user_id': 1, 'tipo': 'info', 'titulo': 'Sin mensaje',
        })
        assert resp.status_code == 400
        assert 'Campo requerido' in resp.get_json()['error']

    def test_reserva_creada_with_email_starts_thread(self, client):
        with patch('adapters.http.notifications.threading.Thread') as mock_thread:
            instance = MagicMock()
            mock_thread.return_value = instance
            resp = client.post('/notifications', json={
                'user_id': 1,
                'tipo': 'reserva_creada',
                'titulo': 'Reserva confirmada',
                'mensaje': 'Tu reserva TH-2026-0001',
                'email': 'viajero@test.com',
                'codigo': 'TH-2026-0001',
                'nombre_hotel': 'Hotel Bogotá',
                'tipo_habitacion': 'Suite',
                'fecha_checkin': '2026-06-01',
                'fecha_checkout': '2026-06-05',
                'num_huespedes': 2,
                'monto_total': '800000',
                'moneda': 'COP',
            })
        assert resp.status_code == 201
        mock_thread.assert_called_once()
        instance.start.assert_called_once()

    def test_reserva_cancelada_with_email_starts_thread(self, client):
        with patch('adapters.http.notifications.threading.Thread') as mock_thread:
            instance = MagicMock()
            mock_thread.return_value = instance
            resp = client.post('/notifications', json={
                'user_id': 1,
                'tipo': 'reserva_cancelada',
                'titulo': 'Reserva cancelada',
                'mensaje': 'Tu reserva TH-2026-0002 fue cancelada.',
                'email': 'viajero@test.com',
                'codigo': 'TH-2026-0002',
                'nombre_hotel': 'Hotel Medellín',
                'tipo_habitacion': 'Doble',
                'fecha_checkin': '2026-07-01',
                'fecha_checkout': '2026-07-03',
                'monto_total': '400000',
                'moneda': 'COP',
            })
        assert resp.status_code == 201
        mock_thread.assert_called_once()

    def test_no_email_field_does_not_start_thread(self, client):
        with patch('adapters.http.notifications.threading.Thread') as mock_thread:
            resp = client.post('/notifications', json={
                'user_id': 1,
                'tipo': 'reserva_creada',
                'titulo': 'Sin email',
                'mensaje': 'Sin destinatario',
            })
        assert resp.status_code == 201
        mock_thread.assert_not_called()

    def test_tipo_generico_does_not_start_thread(self, client):
        with patch('adapters.http.notifications.threading.Thread') as mock_thread:
            resp = client.post('/notifications', json={
                'user_id': 1,
                'tipo': 'info',
                'titulo': 'Genérica',
                'mensaje': 'Mensaje',
                'email': 'alguien@test.com',
            })
        assert resp.status_code == 201
        mock_thread.assert_not_called()


# ─────────────────────────────────────────────────────────────────────
# GET /notifications
# ─────────────────────────────────────────────────────────────────────
class TestGetNotifications:
    def test_without_token_returns_401(self, client):
        resp = client.get('/notifications')
        assert resp.status_code == 401

    def test_with_valid_token_returns_list(self, client):
        client.post('/notifications', json={
            'user_id': 20, 'tipo': 'info', 'titulo': 'Msg20', 'mensaje': 'Hola',
        })
        token = make_token(20)
        resp = client.get('/notifications', headers={'Authorization': f'Bearer {token}'})
        assert resp.status_code == 200
        data = resp.get_json()
        assert isinstance(data, list)
        assert any(n['titulo'] == 'Msg20' for n in data)

    def test_only_returns_own_notifications(self, client):
        client.post('/notifications', json={
            'user_id': 30, 'tipo': 'info', 'titulo': 'OtroUser', 'mensaje': 'X',
        })
        token = make_token(99)
        resp = client.get('/notifications', headers={'Authorization': f'Bearer {token}'})
        assert resp.status_code == 200
        data = resp.get_json()
        assert all(n['user_id'] == 99 for n in data)

    def test_email_status_fields_present(self, client):
        client.post('/notifications', json={
            'user_id': 21, 'tipo': 'info', 'titulo': 'Fields', 'mensaje': 'Check',
        })
        token = make_token(21)
        resp = client.get('/notifications', headers={'Authorization': f'Bearer {token}'})
        assert resp.status_code == 200
        data = resp.get_json()
        assert len(data) >= 1
        assert 'email_enviado' in data[0]
        assert 'email_error' in data[0]


# ─────────────────────────────────────────────────────────────────────
# PATCH /notifications/<id>/read
# ─────────────────────────────────────────────────────────────────────
class TestMarkRead:
    def test_mark_read_success(self, client):
        resp = client.post('/notifications', json={
            'user_id': 40, 'tipo': 'info', 'titulo': 'Marcar', 'mensaje': 'Leída',
        })
        notif_id = resp.get_json()['id']
        token = make_token(40)
        resp = client.patch(f'/notifications/{notif_id}/read',
                            headers={'Authorization': f'Bearer {token}'})
        assert resp.status_code == 200

    def test_mark_read_unauthorized(self, client):
        resp = client.patch('/notifications/1/read')
        assert resp.status_code == 401

    def test_mark_read_not_found(self, client):
        token = make_token(40)
        resp = client.patch('/notifications/99999/read',
                            headers={'Authorization': f'Bearer {token}'})
        assert resp.status_code == 404

    def test_cannot_mark_read_other_user_notification(self, client):
        resp = client.post('/notifications', json={
            'user_id': 50, 'tipo': 'info', 'titulo': 'Ajena', 'mensaje': 'X',
        })
        notif_id = resp.get_json()['id']
        token = make_token(51)  # diferente user
        resp = client.patch(f'/notifications/{notif_id}/read',
                            headers={'Authorization': f'Bearer {token}'})
        assert resp.status_code == 404


# ─────────────────────────────────────────────────────────────────────
# PATCH /notifications/read-all
# ─────────────────────────────────────────────────────────────────────
class TestMarkAllRead:
    def test_mark_all_read_success(self, client):
        user_id = 60
        for i in range(3):
            client.post('/notifications', json={
                'user_id': user_id, 'tipo': 'info',
                'titulo': f'N{i}', 'mensaje': 'Msg',
            })
        token = make_token(user_id)
        resp = client.patch('/notifications/read-all',
                            headers={'Authorization': f'Bearer {token}'})
        assert resp.status_code == 200

    def test_mark_all_read_unauthorized(self, client):
        resp = client.patch('/notifications/read-all')
        assert resp.status_code == 401


# ─────────────────────────────────────────────────────────────────────
# _send_email_async — comportamiento interno
# ─────────────────────────────────────────────────────────────────────
class TestSendEmailAsync:
    def _create_notif(self, tipo: str) -> int:
        with Session(engine) as session:
            n = Notificacion(user_id=70, tipo=tipo, titulo='T', mensaje='M')
            session.add(n)
            session.commit()
            return n.id

    def test_reserva_creada_marks_email_enviado_true(self):
        notif_id = self._create_notif('reserva_creada')
        with patch('adapters.http.notifications.send_reservation_created',
                   return_value=(True, None)):
            _send_email_async(notif_id, 'reserva_creada', {
                'email': 'ok@test.com',
                'codigo': 'TH-X',
                'nombre_hotel': 'H', 'tipo_habitacion': 'T',
                'fecha_checkin': '2026-05-01', 'fecha_checkout': '2026-05-02',
                'num_huespedes': 1, 'monto_total': '100000', 'moneda': 'COP',
            })
        with Session(engine) as session:
            n = session.get(Notificacion, notif_id)
            assert n.email_enviado is True
            assert n.email_error is None

    def test_reserva_cancelada_marks_email_enviado_true(self):
        notif_id = self._create_notif('reserva_cancelada')
        with patch('adapters.http.notifications.send_reservation_cancelled',
                   return_value=(True, None)):
            _send_email_async(notif_id, 'reserva_cancelada', {
                'email': 'ok@test.com',
                'codigo': 'TH-Y',
                'nombre_hotel': 'H', 'tipo_habitacion': 'T',
                'fecha_checkin': '2026-06-01', 'fecha_checkout': '2026-06-02',
                'monto_total': '200000', 'moneda': 'COP',
            })
        with Session(engine) as session:
            n = session.get(Notificacion, notif_id)
            assert n.email_enviado is True

    def test_email_failure_stores_error_message(self):
        notif_id = self._create_notif('reserva_creada')
        with patch('adapters.http.notifications.send_reservation_created',
                   return_value=(False, 'SendGrid error 403')):
            _send_email_async(notif_id, 'reserva_creada', {
                'email': 'fail@test.com',
                'codigo': 'TH-Z',
                'nombre_hotel': 'H', 'tipo_habitacion': 'T',
                'fecha_checkin': '2026-05-01', 'fecha_checkout': '2026-05-02',
                'num_huespedes': 1, 'monto_total': '100000', 'moneda': 'COP',
            })
        with Session(engine) as session:
            n = session.get(Notificacion, notif_id)
            assert n.email_enviado is False
            assert n.email_error == 'SendGrid error 403'

    def test_no_email_skips_send(self):
        with patch('adapters.http.notifications.send_reservation_created') as mock_send:
            _send_email_async(999, 'reserva_creada', {'email': None})
            mock_send.assert_not_called()

    def test_unknown_tipo_skips_send(self):
        with patch('adapters.http.notifications.send_reservation_created') as mock_created:
            with patch('adapters.http.notifications.send_reservation_cancelled') as mock_cancel:
                _send_email_async(999, 'otro_tipo', {'email': 'x@test.com'})
                mock_created.assert_not_called()
                mock_cancel.assert_not_called()
