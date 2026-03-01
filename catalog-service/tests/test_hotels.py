import pytest
import json
from decimal import Decimal

class TestHotelsEndpoints:
    """Pruebas para los endpoints de hoteles"""

    def test_get_hotels_empty(self, client, monkeypatch):
        """Test de obtener hoteles cuando no hay datos"""
        class MockQuery:
            def filter(self, *args):
                return self
            def count(self):
                return 0
            def offset(self, n):
                return self
            def limit(self, n):
                return self
            def all(self):
                return []
        
        class MockSession:
            def query(self, model):
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
        
        class MockQuery:
            def filter(self, *args):
                return self
            def filter_by(self, **kwargs):
                return self
            def count(self):
                return 1
            def offset(self, n):
                return self
            def limit(self, n):
                return self
            def all(self):
                return [MockHotel()]
        
        class MockSession:
            def query(self, model):
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
        
        class MockQuery:
            def filter(self, *args):
                return self
            def count(self):
                return 1
            def offset(self, n):
                return self
            def limit(self, n):
                return self
            def all(self):
                return [MockHotel()]
        
        class MockSession:
            def query(self, model):
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
        
        class MockQuery:
            def filter(self, *args):
                return self
            def count(self):
                return 1
            def offset(self, n):
                return self
            def limit(self, n):
                return self
            def all(self):
                return [MockHotel()]
        
        class MockSession:
            def query(self, model):
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
            'activo': True
        }) for i in range(1, 6)]
        
        class MockQuery:
            def filter(self, *args):
                return self
            def count(self):
                return 50
            def offset(self, n):
                return self
            def limit(self, n):
                return self
            def all(self):
                return hotels
        
        class MockSession:
            def query(self, model):
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
        
        class MockQuery:
            def all(self):
                return [MockRoom()]
        
        class MockSession:
            def query(self, model):
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

