import pytest
import json
from decimal import Decimal

class TestHotelsEndpoints:
    """Pruebas para los endpoints de hoteles"""

    def test_get_hotels_empty(self, client, monkeypatch):
        """Test de obtener hoteles cuando no hay datos"""
        class MockQuery:
            def __init__(self):
                self._group_by = False
            def filter(self, *args):
                return self
            def exists(self):
                return self
            def group_by(self, *args):
                self._group_by = True
                return self
            def count(self):
                return 0
            def offset(self, n):
                return self
            def limit(self, n):
                return self
            def all(self):
                if self._group_by:
                    return []
                return []
        
        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass
        
        def mock_session():
            return MockSession()
        
        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = mock_session
        
        response = client.get('/hotels')
        
        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'hotels' in data
        assert len(data['hotels']) == 0
        assert data['total'] == 0

    def test_get_hotels_with_data(self, client, monkeypatch):
        """Test de obtener hoteles con datos"""
        class MockHotel:
            id = 1
            nombre = 'Hotel Test'
            ciudad = 'Bogotá'
            pais = 'Colombia'
            estrellas = 5
            activo = True
            image_url = None
            descripcion = 'Hotel de prueba'
            direccion = 'Calle 1 # 1-1'
        
        class MockQuery:
            def __init__(self):
                self._group_by = False
            def filter(self, *args):
                return self
            def filter_by(self, **kwargs):
                return self
            def exists(self):
                return self
            def group_by(self, *args):
                self._group_by = True
                return self
            def count(self):
                return 1
            def offset(self, n):
                return self
            def limit(self, n):
                return self
            def all(self):
                if self._group_by:
                    return []
                return [MockHotel()]
        
        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass
        
        def mock_session():
            return MockSession()
        
        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = mock_session
        
        response = client.get('/hotels')
        
        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data['hotels']) == 1
        assert data['hotels'][0]['nombre'] == 'Hotel Test'

    def test_get_hotels_filter_by_city(self, client, monkeypatch):
        """Test de filtrar hoteles por ciudad"""
        class MockHotel:
            id = 1
            nombre = 'Hotel Bogotá'
            ciudad = 'Bogotá'
            pais = 'Colombia'
            estrellas = 4
            activo = True
            image_url = None
            descripcion = None
            direccion = None
        
        class MockQuery:
            def __init__(self):
                self._group_by = False
            def filter(self, *args):
                return self
            def exists(self):
                return self
            def group_by(self, *args):
                self._group_by = True
                return self
            def count(self):
                return 1
            def offset(self, n):
                return self
            def limit(self, n):
                return self
            def all(self):
                if self._group_by:
                    return []
                return [MockHotel()]
        
        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass
        
        def mock_session():
            return MockSession()
        
        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = mock_session
        
        response = client.get('/hotels?ciudad=Bogotá')
        
        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data['hotels']) == 1
        assert data['hotels'][0]['ciudad'] == 'Bogotá'

    def test_get_hotels_filter_by_stars(self, client, monkeypatch):
        """Test de filtrar hoteles por estrellas"""
        class MockHotel:
            id = 1
            nombre = 'Hotel 5 Estrellas'
            ciudad = 'Medellín'
            pais = 'Colombia'
            estrellas = 5
            activo = True
            image_url = None
            descripcion = None
            direccion = None
        
        class MockQuery:
            def __init__(self):
                self._group_by = False
            def filter(self, *args):
                return self
            def exists(self):
                return self
            def group_by(self, *args):
                self._group_by = True
                return self
            def count(self):
                return 1
            def offset(self, n):
                return self
            def limit(self, n):
                return self
            def all(self):
                if self._group_by:
                    return []
                return [MockHotel()]
        
        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass
        
        def mock_session():
            return MockSession()
        
        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = mock_session
        
        response = client.get('/hotels?estrellas=5')
        
        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['hotels'][0]['estrellas'] == 5

    def test_get_hotels_pagination(self, client, monkeypatch):
        """Test de paginación de hoteles"""
        hotels = [type('MockHotel', (), {
            'id': i,
            'nombre': f'Hotel {i}',
            'ciudad': 'Bogotá',
            'pais': 'Colombia',
            'estrellas': 4,
            'activo': True,
            'image_url': None,
            'descripcion': None,
            'direccion': None,
        }) for i in range(1, 6)]
        
        class MockQuery:
            def __init__(self):
                self._group_by = False
            def filter(self, *args):
                return self
            def exists(self):
                return self
            def group_by(self, *args):
                self._group_by = True
                return self
            def count(self):
                return 50
            def offset(self, n):
                return self
            def limit(self, n):
                return self
            def all(self):
                if self._group_by:
                    return []
                return hotels
        
        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass
        
        def mock_session():
            return MockSession()
        
        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = mock_session
        
        response = client.get('/hotels?page=2&per_page=5')
        
        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['page'] == 2
        assert data['per_page'] == 5
        assert data['total'] == 50

    def test_get_rooms(self, client, monkeypatch):
        """Test de obtener habitaciones"""
        class MockRoom:
            id = 1
            hotel_id = 1
            nombre = 'Suite 101'
            tipo = 'Suite'
            capacidad = 2
            precio_noche = Decimal('350.00')
            moneda = 'COP'
            disponible = True
            descripcion = ''

        class MockQuery:
            def filter(self, *args):
                return self
            def all(self):
                return [MockRoom()]

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass

        def mock_session():
            return MockSession()

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = mock_session

        response = client.get('/rooms')

        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]['nombre'] == 'Suite 101'
        assert data[0]['tipo'] == 'Suite'

    def test_get_rooms_filter_by_hotel_id(self, client, monkeypatch):
        """Test de obtener habitaciones filtradas por hotel_id"""
        class MockRoom:
            id = 2
            hotel_id = 5
            nombre = 'Doble 202'
            tipo = 'Doble'
            capacidad = 2
            precio_noche = Decimal('200.00')
            moneda = 'COP'
            disponible = True
            descripcion = ''

        class MockQuery:
            def filter(self, *args):
                return self
            def all(self):
                return [MockRoom()]

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass

        def mock_session():
            return MockSession()

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = mock_session

        response = client.get('/rooms?hotel_id=5')

        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]['hotel_id'] == 5

    def test_get_hotel_by_id(self, client, monkeypatch):
        """Test de obtener un hotel por ID"""
        class MockHotel:
            id = 1
            admin_id = 10
            nombre = 'Hotel Test'
            descripcion = 'Un hotel de prueba'
            direccion = 'Calle 1 # 1-1'
            ciudad = 'Bogotá'
            pais = 'Colombia'
            estrellas = 4
            activo = True
            image_url = 'https://example.com/foto.jpg'

        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return MockHotel()

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass

        def mock_session():
            return MockSession()

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = mock_session

        response = client.get('/hotels/1')

        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['id'] == 1
        assert data['nombre'] == 'Hotel Test'
        assert data['descripcion'] == 'Un hotel de prueba'
        assert data['direccion'] == 'Calle 1 # 1-1'
        assert data['image_url'] == 'https://example.com/foto.jpg'

    def test_get_hotel_by_id_not_found(self, client, monkeypatch):
        """Test de obtener un hotel por ID que no existe"""
        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return None

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass

        def mock_session():
            return MockSession()

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = mock_session

        response = client.get('/hotels/9999')

        hotels_module.Session = original_session
        assert response.status_code == 404
        data = json.loads(response.data)
        assert 'error' in data

    def test_get_hotels_returns_image_url(self, client, monkeypatch):
        """Test que GET /hotels incluye image_url, descripcion y direccion"""
        class MockHotel:
            id = 1
            nombre = 'Hotel Imagen'
            ciudad = 'Bogotá'
            pais = 'Colombia'
            estrellas = 3
            activo = True
            image_url = 'https://s3.amazonaws.com/hotels/foto.jpg'
            descripcion = 'Hotel con imagen'
            direccion = 'Cra 7 # 32-15'

        class MockQuery:
            def __init__(self):
                self._group_by = False
            def filter(self, *args):
                return self
            def exists(self):
                return self
            def group_by(self, *args):
                self._group_by = True
                return self
            def count(self):
                return 1
            def offset(self, n):
                return self
            def limit(self, n):
                return self
            def all(self):
                if self._group_by:
                    return []
                return [MockHotel()]

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass

        def mock_session():
            return MockSession()

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = mock_session

        response = client.get('/hotels')

        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        hotel = data['hotels'][0]
        assert 'image_url' in hotel
        assert 'descripcion' in hotel
        assert 'direccion' in hotel
        assert hotel['image_url'] == 'https://s3.amazonaws.com/hotels/foto.jpg'

    def test_health_check(self, client):
        """Test de health check"""
        response = client.get('/')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'Catalog Service' in data['message']

    def test_health_endpoint(self, client):
        """Test del endpoint /health para ALB"""
        response = client.get('/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
        assert data['service'] == 'catalog-service'
        # En tests, la BD puede no estar disponible 
        assert 'database' in data


class TestAdditionalEndpoints:
    """Pruebas para endpoints de ciudades, CRUD y upload de imagen"""

    # ── helpers ──────────────────────────────────────────────────────────────

    def _mock_hotel(self, **overrides):
        class MockHotel:
            id = 1
            admin_id = 10
            nombre = 'Hotel Test'
            descripcion = 'Desc'
            direccion = 'Calle 1'
            ciudad = 'Bogotá'
            pais = 'Colombia'
            estrellas = 4
            activo = True
            image_url = None
        for k, v in overrides.items():
            setattr(MockHotel, k, v)
        return MockHotel

    def _mock_room(self):
        class MockRoom:
            id = 1
            hotel_id = 1
            nombre = 'Suite'
            tipo = 'suite'
            capacidad = 2
            precio_noche = Decimal('200.00')
            moneda = 'COP'
            disponible = True
            descripcion = None
        return MockRoom

    # ── GET /cities ───────────────────────────────────────────────────────────

    def test_get_cities(self, client, monkeypatch):
        """Test del endpoint /cities"""
        class CityRow:
            ciudad = 'Bogotá'

        class MockQuery:
            def filter(self, *args):
                return self
            def distinct(self):
                return self
            def order_by(self, *args):
                return self
            def all(self):
                return [CityRow()]

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.get('/cities')

        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'Bogotá' in data

    # ── GET /hotels/admin/<id> ────────────────────────────────────────────────

    def test_get_hotel_by_admin_found(self, client, monkeypatch):
        MockHotel = self._mock_hotel()

        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return MockHotel()

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.get('/hotels/admin/10')

        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['admin_id'] == 10

    def test_get_hotel_by_admin_not_found(self, client, monkeypatch):
        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return None

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.get('/hotels/admin/999')

        hotels_module.Session = original_session
        assert response.status_code == 404

    # ── POST /hotels ──────────────────────────────────────────────────────────

    def test_create_hotel(self, client, monkeypatch):
        class MockHotel:
            id = 99
            admin_id = 5
            nombre = 'Nuevo Hotel'
            ciudad = 'Medellín'
            pais = 'Colombia'
            estrellas = 3
            activo = True

        class MockSession:
            def add(self, obj):
                pass
            def commit(self):
                pass
            def rollback(self):
                pass
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session

        added_hotel = None

        def mock_session_factory():
            ms = MockSession()
            return ms

        import unittest.mock as mock_mod
        with mock_mod.patch('adapters.http.hotels.Hotel') as MockHotelClass, \
             mock_mod.patch('adapters.http.hotels.Session', mock_session_factory):
            instance = MockHotelClass.return_value
            instance.id = 99
            instance.admin_id = 5
            instance.nombre = 'Nuevo Hotel'
            instance.descripcion = ''
            instance.direccion = ''
            instance.ciudad = 'Medellín'
            instance.pais = 'Colombia'
            instance.estrellas = 3
            instance.activo = True
            instance.image_url = ''

            response = client.post('/hotels',
                data=json.dumps({
                    'nombre': 'Nuevo Hotel',
                    'ciudad': 'Medellín',
                    'pais': 'Colombia',
                    'admin_id': 5,
                }),
                content_type='application/json'
            )

        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['nombre'] == 'Nuevo Hotel'

    # ── PUT /hotels/<id> ──────────────────────────────────────────────────────

    def test_update_hotel(self, client, monkeypatch):
        MockHotel = self._mock_hotel()
        hotel_obj = MockHotel()

        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return hotel_obj

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def commit(self):
                pass
            def rollback(self):
                pass
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.put('/hotels/1',
            data=json.dumps({'nombre': 'Hotel Actualizado', 'image_url': 'https://s3.example.com/foto.jpg'}),
            content_type='application/json'
        )

        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['nombre'] == 'Hotel Actualizado'

    def test_update_hotel_not_found(self, client, monkeypatch):
        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return None

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def rollback(self):
                pass
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.put('/hotels/9999',
            data=json.dumps({'nombre': 'X'}),
            content_type='application/json'
        )

        hotels_module.Session = original_session
        assert response.status_code == 404

    # ── POST /rooms ───────────────────────────────────────────────────────────

    def _mock_session_for_create(self, existing_room=None):
        """Helper que devuelve un Session mock cuya .query().filter().first() retorna existing_room."""
        class MockQuery:
            def filter(self, *args, **kwargs):
                return self
            def first(self):
                return existing_room

        class MockSession:
            def query(self, *args, **kwargs):
                return MockQuery()
            def add(self, obj):
                pass
            def commit(self):
                pass
            def rollback(self):
                pass
            def close(self):
                pass
        return MockSession

    def test_create_room(self, client, monkeypatch):
        import unittest.mock as mock_mod

        MockSessionCls = self._mock_session_for_create(existing_room=None)

        with mock_mod.patch('adapters.http.hotels.Habitacion') as MockRoomClass, \
             mock_mod.patch('adapters.http.hotels.Session', lambda: MockSessionCls()):
            instance = MockRoomClass.return_value
            instance.id = 10
            instance.hotel_id = 1
            instance.nombre = 'Doble'
            instance.tipo = 'doble'
            instance.capacidad = 2
            instance.precio_noche = Decimal('150000')
            instance.moneda = 'COP'
            instance.disponible = True
            instance.descripcion = 'WiFi'

            response = client.post('/rooms',
                data=json.dumps({
                    'hotel_id': 1,
                    'nombre': 'Doble',
                    'precio_noche': 150000,
                    'capacidad': 2,
                    'descripcion': 'WiFi',
                }),
                content_type='application/json'
            )

        assert response.status_code == 201

    def test_create_room_duplicate_name_returns_409(self, client):
        import adapters.http.hotels as hotels_module

        class ExistingRoom:
            id = 99

        MockSessionCls = self._mock_session_for_create(existing_room=ExistingRoom())
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSessionCls()

        response = client.post('/rooms',
            data=json.dumps({
                'hotel_id': 1,
                'nombre': 'Doble',
                'precio_noche': 150000,
            }),
            content_type='application/json'
        )

        hotels_module.Session = original_session
        assert response.status_code == 409
        assert 'nombre' in json.loads(response.data)['error'].lower()

    def test_create_room_negative_capacity_returns_400(self, client):
        response = client.post('/rooms',
            data=json.dumps({
                'hotel_id': 1,
                'nombre': 'Doble',
                'precio_noche': 150000,
                'capacidad': -1,
            }),
            content_type='application/json'
        )
        assert response.status_code == 400

    def test_create_room_invalid_price_returns_400(self, client):
        response = client.post('/rooms',
            data=json.dumps({
                'hotel_id': 1,
                'nombre': 'Doble',
                'precio_noche': 0,
            }),
            content_type='application/json'
        )
        assert response.status_code == 400

    def test_create_room_missing_name_returns_400(self, client):
        response = client.post('/rooms',
            data=json.dumps({
                'hotel_id': 1,
                'nombre': '   ',
                'precio_noche': 150000,
            }),
            content_type='application/json'
        )
        assert response.status_code == 400

    # ── PUT /rooms/<id> ───────────────────────────────────────────────────────

    def test_update_room(self, client, monkeypatch):
        MockRoom = self._mock_room()
        room_obj = MockRoom()

        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return room_obj

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def commit(self):
                pass
            def rollback(self):
                pass
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.put('/rooms/1',
            data=json.dumps({'precio_noche': 300000, 'disponible': False}),
            content_type='application/json'
        )

        hotels_module.Session = original_session
        assert response.status_code == 200

    def test_update_room_not_found(self, client, monkeypatch):
        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return None

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def rollback(self):
                pass
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.put('/rooms/9999',
            data=json.dumps({'precio_noche': 100}),
            content_type='application/json'
        )

        hotels_module.Session = original_session
        assert response.status_code == 404

    # ── DELETE /rooms/<id> ────────────────────────────────────────────────────

    def test_delete_room(self, client, monkeypatch):
        """Soft delete exitoso: habitación sin reservas activas."""
        MockRoom = self._mock_room()
        room_obj = MockRoom()

        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return room_obj

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def execute(self, stmt, params=None):
                # Sin reservas activas
                class Result:
                    def scalar(self):
                        return 0
                return Result()
            def commit(self):
                pass
            def rollback(self):
                pass
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.delete('/rooms/1')

        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'deleted' in data['message'].lower()
        # Soft delete: disponible=False, eliminada=True
        assert room_obj.eliminada is True
        assert room_obj.disponible is False

    def test_delete_room_not_found(self, client, monkeypatch):
        """404 cuando la habitación no existe o ya está eliminada."""
        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return None

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def rollback(self):
                pass
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.delete('/rooms/9999')

        hotels_module.Session = original_session
        assert response.status_code == 404

    def test_delete_room_with_active_reservations_returns_409(self, client, monkeypatch):
        """409 cuando la habitación tiene reservas confirmadas activas."""
        MockRoom = self._mock_room()
        room_obj = MockRoom()

        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return room_obj

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def execute(self, stmt, params=None):
                # 2 reservas activas
                class Result:
                    def scalar(self):
                        return 2
                return Result()
            def rollback(self):
                pass
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.delete('/rooms/1')

        hotels_module.Session = original_session
        assert response.status_code == 409
        data = json.loads(response.data)
        assert 'reservas activas' in data['error'].lower()

    def test_delete_room_preserves_historical_data(self, client, monkeypatch):
        """El registro de la habitación permanece en BD tras el soft delete."""
        MockRoom = self._mock_room()
        room_obj = MockRoom()
        room_obj.eliminada = False
        room_obj.disponible = True

        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return room_obj

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def execute(self, stmt, params=None):
                class Result:
                    def scalar(self):
                        return 0
                return Result()
            def commit(self):
                pass
            def rollback(self):
                pass
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.delete('/rooms/1')

        hotels_module.Session = original_session
        assert response.status_code == 200
        # El objeto sigue existiendo en memoria (no fue borrado de BD)
        assert room_obj is not None
        assert room_obj.id == 1
        assert room_obj.eliminada is True

    def test_get_rooms_excludes_deleted(self, client, monkeypatch):
        """GET /rooms no retorna habitaciones con eliminada=True."""
        class MockRoom:
            id = 1
            hotel_id = 1
            nombre = 'Activa'
            tipo = 'doble'
            capacidad = 2
            precio_noche = Decimal('150000')
            moneda = 'COP'
            disponible = True
            descripcion = None
            eliminada = False

        # Solo retorna la habitación activa (el filtro eliminada==False ya aplicó)
        class MockQuery:
            def filter(self, *args):
                return self
            def all(self):
                return [MockRoom()]

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.get('/rooms?hotel_id=1')

        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert all(r.get('eliminada', False) is False for r in data)

    def test_restore_room(self, client, monkeypatch):
        """PATCH /rooms/<id>/restore reactiva una habitación eliminada."""
        class MockRoom:
            id = 5
            hotel_id = 1
            nombre = 'Suite Eliminada'
            tipo = 'suite'
            capacidad = 2
            precio_noche = Decimal('200000')
            moneda = 'COP'
            disponible = False
            descripcion = None
            eliminada = True

        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return MockRoom()

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def commit(self):
                pass
            def rollback(self):
                pass
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.patch('/rooms/5/restore')

        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['eliminada'] is False
        assert data['disponible'] is True

    def test_restore_room_not_found(self, client, monkeypatch):
        """PATCH /rooms/<id>/restore retorna 404 si la habitación no existe o no está eliminada."""
        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return None

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def rollback(self):
                pass
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.patch('/rooms/999/restore')

        hotels_module.Session = original_session
        assert response.status_code == 404

    def test_get_rooms_includes_deleted_with_param(self, client, monkeypatch):
        """GET /rooms?include_deleted=true retorna también habitaciones eliminadas."""
        class MockRoomActive:
            id = 1; hotel_id = 1; nombre = 'Activa'; tipo = 'doble'
            capacidad = 2; precio_noche = Decimal('100000'); moneda = 'COP'
            disponible = True; descripcion = None; eliminada = False

        class MockRoomDeleted:
            id = 2; hotel_id = 1; nombre = 'Eliminada'; tipo = 'suite'
            capacidad = 3; precio_noche = Decimal('200000'); moneda = 'COP'
            disponible = False; descripcion = None; eliminada = True

        class MockQuery:
            def filter(self, *args):
                return self
            def all(self):
                return [MockRoomActive(), MockRoomDeleted()]

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        response = client.get('/rooms?hotel_id=1&include_deleted=true')

        hotels_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 2
        eliminadas = [r for r in data if r.get('eliminada') is True]
        assert len(eliminadas) == 1


    def test_clear_cache(self, client):
        response = client.post('/cache/clear')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'cleared' in data['message'].lower()

    def test_cache_stats(self, client):
        response = client.get('/cache/stats')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'cache_type' in data

    # ── POST /hotels/<id>/image ───────────────────────────────────────────────

    def test_upload_hotel_image_no_file(self, client):
        response = client.post('/hotels/1/image')
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data

    def test_upload_hotel_image_invalid_type(self, client, monkeypatch):
        import io
        data = {'file': (io.BytesIO(b'data'), 'doc.pdf')}
        response = client.post('/hotels/1/image', data=data, content_type='multipart/form-data')
        assert response.status_code == 400
        resp_data = json.loads(response.data)
        assert 'not allowed' in resp_data['error']

    def test_upload_hotel_image_success(self, client, monkeypatch):
        import io, unittest.mock as mock_mod

        MockHotel = self._mock_hotel()
        hotel_obj = MockHotel()

        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return hotel_obj

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def commit(self):
                pass
            def rollback(self):
                pass
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        mock_s3 = mock_mod.MagicMock()
        with mock_mod.patch('adapters.http.hotels.boto3.client', return_value=mock_s3):
            data = {'file': (io.BytesIO(b'fake image data'), 'hotel.jpg')}
            response = client.post('/hotels/1/image', data=data, content_type='multipart/form-data')

        hotels_module.Session = original_session
        assert response.status_code == 200
        resp_data = json.loads(response.data)
        assert 'image_url' in resp_data
        assert 'travelhub-images-proyecto' in resp_data['image_url']

    def test_upload_hotel_image_hotel_not_found(self, client, monkeypatch):
        import io, unittest.mock as mock_mod

        class MockQuery:
            def filter(self, *args):
                return self
            def first(self):
                return None

        class MockSession:
            def query(self, *args):
                return MockQuery()
            def rollback(self):
                pass
            def close(self):
                pass

        import adapters.http.hotels as hotels_module
        original_session = hotels_module.Session
        hotels_module.Session = lambda: MockSession()

        data = {'file': (io.BytesIO(b'fake image data'), 'hotel.jpg')}
        response = client.post('/hotels/9999/image', data=data, content_type='multipart/form-data')

        hotels_module.Session = original_session
        assert response.status_code == 404
