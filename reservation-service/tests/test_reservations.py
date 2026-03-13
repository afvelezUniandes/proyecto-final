import pytest
import json
import datetime


def auth_header(user_id=1):
    return {'X-User-Id': str(user_id)}


# ─────────────────────────────────────────────
# Helpers de mock
# ─────────────────────────────────────────────

class MockReserva:
    id = 1
    usuario_id = 1
    habitacion_id = 10
    hotel_id = 2
    fecha_checkin = datetime.date(2026, 3, 15)
    fecha_checkout = datetime.date(2026, 3, 20)
    num_huespedes = 2
    fecha_creacion = datetime.datetime(2026, 3, 1, 12, 0, 0)
    codigo = 'TH-2026-0001'
    monto_total = 2250000.00
    moneda = 'COP'
    estado = 'confirmada'


class MockSession:
    def __init__(self, reservas=None):
        self._reservas = reservas or []
        self._added = []

    def query(self, model):
        return self

    def filter(self, *args):
        return self

    def filter_by(self, **kwargs):
        return self

    def order_by(self, *args):
        return self

    def all(self):
        return self._reservas

    def first(self):
        return self._reservas[0] if self._reservas else None

    def add(self, obj):
        self._added.append(obj)

    def flush(self):
        if self._added:
            self._added[-1].id = 99

    def commit(self):
        pass

    def rollback(self):
        pass

    def close(self):
        pass


# ─────────────────────────────────────────────
# Tests
# ─────────────────────────────────────────────

class TestGetReservations:

    def test_get_reservations_unauthorized(self, client):
        """Sin token devuelve 401."""
        response = client.get('/reservations')
        assert response.status_code == 401

    def test_get_reservations_empty(self, client, monkeypatch):
        """Usuario sin reservas devuelve lista vacía."""
        import adapters.http.reservations as mod
        monkeypatch.setattr(mod, 'Session', lambda: MockSession([]))

        response = client.get('/reservations', headers=auth_header())
        assert response.status_code == 200
        assert json.loads(response.data) == []

    def test_get_reservations_with_data(self, client, monkeypatch):
        """Usuario con reservas devuelve lista con datos."""
        import adapters.http.reservations as mod
        monkeypatch.setattr(mod, 'Session', lambda: MockSession([MockReserva()]))

        response = client.get('/reservations', headers=auth_header())
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 1
        assert data[0]['codigo'] == 'TH-2026-0001'
        assert data[0]['estado'] == 'confirmada'


class TestGetReservation:

    def test_get_reservation_not_found(self, client, monkeypatch):
        """Reserva inexistente devuelve 404."""
        import adapters.http.reservations as mod
        monkeypatch.setattr(mod, 'Session', lambda: MockSession([]))

        response = client.get('/reservations/999', headers=auth_header())
        assert response.status_code == 404

    def test_get_reservation_found(self, client, monkeypatch):
        """Reserva existente devuelve datos correctos."""
        import adapters.http.reservations as mod
        monkeypatch.setattr(mod, 'Session', lambda: MockSession([MockReserva()]))

        response = client.get('/reservations/1', headers=auth_header())
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['codigo'] == 'TH-2026-0001'
        assert data['monto_total'] == 2250000.0


class TestCreateReservation:

    def test_create_reservation_unauthorized(self, client):
        """Sin token devuelve 401."""
        response = client.post('/reservations', data='{}', content_type='application/json')
        assert response.status_code == 401

    def test_create_reservation_missing_fields(self, client, monkeypatch):
        """Faltan campos requeridos devuelve 400."""
        import adapters.http.reservations as mod
        monkeypatch.setattr(mod, 'Session', lambda: MockSession([]))

        response = client.post(
            '/reservations',
            data=json.dumps({'habitacion_id': 1}),
            content_type='application/json',
            headers=auth_header()
        )
        assert response.status_code == 400

    def test_create_reservation_invalid_dates(self, client, monkeypatch):
        """checkout antes que checkin devuelve 400."""
        import adapters.http.reservations as mod
        monkeypatch.setattr(mod, 'Session', lambda: MockSession([]))

        payload = {
            'habitacion_id': 10,
            'hotel_id': 2,
            'fecha_checkin': '2026-03-20',
            'fecha_checkout': '2026-03-15',
            'num_huespedes': 2,
            'monto_total': 500000
        }
        response = client.post(
            '/reservations',
            data=json.dumps(payload),
            content_type='application/json',
            headers=auth_header()
        )
        assert response.status_code == 400

    def test_create_reservation_success(self, client, monkeypatch):
        """Reserva válida se crea exitosamente."""
        import adapters.http.reservations as mod

        class CreateMockSession(MockSession):
            def first(self):
                # primera llamada (check código único) → None; segunda → MockReserva
                return None

        monkeypatch.setattr(mod, 'Session', lambda: CreateMockSession([]))

        payload = {
            'habitacion_id': 10,
            'hotel_id': 2,
            'fecha_checkin': '2026-03-15',
            'fecha_checkout': '2026-03-20',
            'num_huespedes': 2,
            'monto_total': 2250000
        }
        response = client.post(
            '/reservations',
            data=json.dumps(payload),
            content_type='application/json',
            headers=auth_header()
        )
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'codigo' in data
        assert data['estado'] == 'confirmada'
        assert data['monto_total'] == 2250000.0


class TestCancelReservation:

    def test_cancel_unauthorized(self, client):
        """Sin token devuelve 401."""
        response = client.patch('/reservations/1/cancel')
        assert response.status_code == 401

    def test_cancel_not_found(self, client, monkeypatch):
        """Reserva inexistente devuelve 404."""
        import adapters.http.reservations as mod
        monkeypatch.setattr(mod, 'Session', lambda: MockSession([]))

        response = client.patch('/reservations/999/cancel', headers=auth_header())
        assert response.status_code == 404

    def test_cancel_already_cancelled(self, client, monkeypatch):
        """Cancelar una reserva ya cancelada devuelve 400."""
        import adapters.http.reservations as mod

        class CancelledReserva(MockReserva):
            estado = 'cancelada'

        monkeypatch.setattr(mod, 'Session', lambda: MockSession([CancelledReserva()]))

        response = client.patch('/reservations/1/cancel', headers=auth_header())
        assert response.status_code == 400

    def test_cancel_success(self, client, monkeypatch):
        """Cancelar reserva confirmada devuelve 200 con estado cancelada."""
        import adapters.http.reservations as mod

        class MutableReserva(MockReserva):
            estado = 'confirmada'

        mock_session = MockSession([MutableReserva()])
        monkeypatch.setattr(mod, 'Session', lambda: mock_session)

        response = client.patch('/reservations/1/cancel', headers=auth_header())
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['estado'] == 'cancelada'


class TestHealthAndRoot:

    def test_health(self, client):
        response = client.get('/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['service'] == 'reservation-service'

    def test_root(self, client):
        response = client.get('/')
        assert response.status_code == 200
