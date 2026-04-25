import pytest
import json
from werkzeug.security import generate_password_hash

class TestAuthEndpoints:
    """Pruebas para los endpoints de autenticación"""

    def test_sign_up_success(self, client, monkeypatch):
        """Test de registro exitoso"""
        # Mock de la sesión de BD
        class MockUser:
            def __init__(self, **kwargs):
                for key, value in kwargs.items():
                    setattr(self, key, value)
        
        class MockSession:
            def query(self, model):
                return self
            def filter_by(self, **kwargs):
                return self
            def first(self):
                return None
            def add(self, obj):
                pass
            def commit(self):
                pass
            def close(self):
                pass
        
        def mock_session():
            return MockSession()
        
        import adapters.http.auth as auth_module
        original_session = auth_module.Session
        auth_module.Session = mock_session
        
        response = client.post('/sign-up', 
            data=json.dumps({
                'nombre': 'Test User',
                'email': 'test@example.com',
                'password': 'password123',
                'telefono': '1234567890',
                'pais': 'Colombia'
            }),
            content_type='application/json'
        )
        
        auth_module.Session = original_session
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['message'] == 'User created'

    def test_sign_up_hotel_role_returns_hotel_id(self, client, monkeypatch):
        """Test que sign-up con rol hotel retorna hotel_id en la respuesta"""
        call_count = [0]

        class MockUser:
            id = 42
            def __init__(self, **kwargs):
                for key, value in kwargs.items():
                    setattr(self, key, value)

        created_user = MockUser()

        class MockSession:
            def query(self, model):
                return self
            def filter_by(self, **kwargs):
                return self
            def first(self):
                return None
            def add(self, obj):
                pass
            def commit(self):
                pass
            def delete(self, obj):
                pass
            def close(self):
                pass

        def mock_session():
            return MockSession()

        import requests as real_requests
        import adapters.http.auth as auth_module

        class MockCatalogResponse:
            status_code = 201
            def json(self):
                return {'id': 7, 'nombre': 'Hotel Test'}

        original_session = auth_module.Session
        original_post = auth_module.http_requests.post
        auth_module.Session = mock_session
        auth_module.http_requests.post = lambda *a, **kw: MockCatalogResponse()

        response = client.post('/sign-up',
            data=json.dumps({
                'nombre': 'Admin Hotel',
                'email': 'admin@hotel.com',
                'password': 'pass123',
                'rol': 'hotel',
                'hotel': {
                    'nombre': 'Hotel Test',
                    'ciudad': 'Bogotá',
                    'pais': 'Colombia',
                    'direccion': 'Calle 1',
                    'estrellas': 3,
                }
            }),
            content_type='application/json'
        )

        auth_module.Session = original_session
        auth_module.http_requests.post = original_post

        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['message'] == 'User created'
        assert 'hotel_id' in data
        assert data['hotel_id'] == 7

    def test_sign_up_duplicate_email(self, client, monkeypatch):
        """Test de registro con email duplicado"""
        class MockUser:
            email = 'existing@example.com'
        
        class MockSession:
            def query(self, model):
                return self
            def filter_by(self, **kwargs):
                return self
            def first(self):
                return MockUser()
            def close(self):
                pass
        
        def mock_session():
            return MockSession()
        
        import adapters.http.auth as auth_module
        original_session = auth_module.Session
        auth_module.Session = mock_session
        
        response = client.post('/sign-up',
            data=json.dumps({
                'nombre': 'Test User',
                'email': 'existing@example.com',
                'password': 'password123'
            }),
            content_type='application/json'
        )
        
        auth_module.Session = original_session
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'already exists' in data['error']

    def test_sign_in_success(self, client, monkeypatch):
        """Test de login exitoso"""
        class MockRol:
            value = 'user'

        class MockUser:
            id = 1
            email = 'test@example.com'
            password_hash = generate_password_hash('password123')
            rol = MockRol()
        
        class MockSession:
            def query(self, model):
                return self
            def filter_by(self, **kwargs):
                return self
            def first(self):
                return MockUser()
            def close(self):
                pass
        
        def mock_session():
            return MockSession()
        
        import adapters.http.auth as auth_module
        original_session = auth_module.Session
        auth_module.Session = mock_session
        
        response = client.post('/sign-in',
            data=json.dumps({
                'email': 'test@example.com',
                'password': 'password123'
            }),
            content_type='application/json'
        )
        
        auth_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'token' in data

    def test_sign_in_invalid_credentials(self, client, monkeypatch):
        """Test de login con credenciales inválidas"""
        class MockSession:
            def query(self, model):
                return self
            def filter_by(self, **kwargs):
                return self
            def first(self):
                return None
            def close(self):
                pass
        
        def mock_session():
            return MockSession()
        
        import adapters.http.auth as auth_module
        original_session = auth_module.Session
        auth_module.Session = mock_session
        
        response = client.post('/sign-in',
            data=json.dumps({
                'email': 'nonexistent@example.com',
                'password': 'wrongpassword'
            }),
            content_type='application/json'
        )
        
        auth_module.Session = original_session
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Invalid credentials' in data['error']

    def test_sign_out(self, client):
        """Test de logout"""
        response = client.post('/sign-out')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'Signed out' in data['message']

    def test_health_check(self, client):
        """Test de health check"""
        response = client.get('/')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'Auth Service' in data['message']

    def test_health_endpoint(self, client):
        """Test del endpoint /health para ALB"""
        response = client.get('/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
        assert data['service'] == 'auth-service'
        # En tests, la BD puede no estar disponible
        assert 'database' in data


class TestProfileEndpoints:
    """Pruebas para los endpoints de perfil de usuario"""

    def _mock_user(self, **overrides):
        from adapters.orm.models import RolEnum
        class MockUser:
            id = 1
            nombre = 'Usuario Test'
            email = 'test@example.com'
            password_hash = ''
            telefono = '3001234567'
            pais = 'Colombia'
            idioma_preferido = 'es'
            rol = RolEnum('user')
        for k, v in overrides.items():
            setattr(MockUser, k, v)
        return MockUser

    def _mock_session_with_user(self, user_obj):
        class MockQuery:
            def filter_by(self, **kwargs):
                return self
            def first(self):
                return user_obj
        class MockSession:
            def query(self, model):
                return MockQuery()
            def commit(self):
                pass
            def rollback(self):
                pass
            def close(self):
                pass
        return MockSession

    # ── GET /profile ──────────────────────────────────────────────────────────

    def test_get_profile_success(self, client, monkeypatch):
        """GET /profile con X-User-Id válido retorna datos del usuario"""
        MockUser = self._mock_user()
        MockSession = self._mock_session_with_user(MockUser())

        import adapters.http.auth as auth_module
        original_session = auth_module.Session
        auth_module.Session = lambda: MockSession()

        response = client.get('/profile', headers={'X-User-Id': '1'})

        auth_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['email'] == 'test@example.com'
        assert data['nombre'] == 'Usuario Test'
        assert 'rol' in data

    def test_get_profile_unauthorized(self, client):
        """GET /profile sin X-User-Id retorna 401"""
        response = client.get('/profile')
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Unauthorized' in data['error']

    def test_get_profile_not_found(self, client, monkeypatch):
        """GET /profile con usuario inexistente retorna 404"""
        class MockQuery:
            def filter_by(self, **kwargs):
                return self
            def first(self):
                return None
        class MockSession:
            def query(self, model):
                return MockQuery()
            def close(self):
                pass

        import adapters.http.auth as auth_module
        original_session = auth_module.Session
        auth_module.Session = lambda: MockSession()

        response = client.get('/profile', headers={'X-User-Id': '999'})

        auth_module.Session = original_session
        assert response.status_code == 404
        data = json.loads(response.data)
        assert 'not found' in data['error'].lower()

    # ── PUT /profile ──────────────────────────────────────────────────────────

    def test_update_profile_success(self, client, monkeypatch):
        """PUT /profile actualiza nombre y teléfono"""
        MockUser = self._mock_user()
        user_obj = MockUser()
        MockSession = self._mock_session_with_user(user_obj)

        import adapters.http.auth as auth_module
        original_session = auth_module.Session
        auth_module.Session = lambda: MockSession()

        response = client.put('/profile',
            data=json.dumps({'nombre': 'Nuevo Nombre', 'telefono': '3009999999'}),
            content_type='application/json',
            headers={'X-User-Id': '1'},
        )

        auth_module.Session = original_session
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['nombre'] == 'Nuevo Nombre'

    def test_update_profile_unauthorized(self, client):
        """PUT /profile sin X-User-Id retorna 401"""
        response = client.put('/profile',
            data=json.dumps({'nombre': 'X'}),
            content_type='application/json',
        )
        assert response.status_code == 401

    def test_update_profile_not_found(self, client, monkeypatch):
        """PUT /profile con usuario inexistente retorna 404"""
        class MockQuery:
            def filter_by(self, **kwargs):
                return self
            def first(self):
                return None
        class MockSession:
            def query(self, model):
                return MockQuery()
            def close(self):
                pass

        import adapters.http.auth as auth_module
        original_session = auth_module.Session
        auth_module.Session = lambda: MockSession()

        response = client.put('/profile',
            data=json.dumps({'nombre': 'X'}),
            content_type='application/json',
            headers={'X-User-Id': '999'},
        )

        auth_module.Session = original_session
        assert response.status_code == 404

    def test_update_profile_email_conflict(self, client, monkeypatch):
        """PUT /profile con email ya en uso retorna 409"""
        from adapters.orm.models import RolEnum
        MockUser = self._mock_user()
        user_obj = MockUser()

        class ExistingEmail:
            email = 'taken@example.com'

        call_count = [0]

        class MockQuery:
            def filter_by(self, **kwargs):
                call_count[0] += 1
                # Primera llamada: usuario actual (por id)
                # Segunda llamada: buscar email duplicado
                self._kwargs = kwargs
                return self
            def first(self):
                if call_count[0] == 1:
                    return user_obj
                return ExistingEmail()

        class MockSession:
            def query(self, model):
                return MockQuery()
            def close(self):
                pass

        import adapters.http.auth as auth_module
        original_session = auth_module.Session
        auth_module.Session = lambda: MockSession()

        response = client.put('/profile',
            data=json.dumps({'email': 'taken@example.com'}),
            content_type='application/json',
            headers={'X-User-Id': '1'},
        )

        auth_module.Session = original_session
        assert response.status_code == 409

    def test_update_profile_password_change(self, client, monkeypatch):
        """PUT /profile con password actualiza el hash"""
        MockUser = self._mock_user()
        user_obj = MockUser()
        MockSession = self._mock_session_with_user(user_obj)

        import adapters.http.auth as auth_module
        original_session = auth_module.Session
        auth_module.Session = lambda: MockSession()

        response = client.put('/profile',
            data=json.dumps({'password': 'NuevaClave@1234'}),
            content_type='application/json',
            headers={'X-User-Id': '1'},
        )

        auth_module.Session = original_session
        assert response.status_code == 200


class TestSignUpEdgeCases:
    """Casos de borde del sign-up"""

    def test_sign_up_hotel_catalog_error(self, client, monkeypatch):
        """sign-up con rol hotel retorna 500 si catalog falla"""
        class MockSession:
            def query(self, model):
                return self
            def filter_by(self, **kwargs):
                return self
            def first(self):
                return None
            def add(self, obj):
                pass
            def commit(self):
                pass
            def delete(self, obj):
                pass
            def close(self):
                pass

        import adapters.http.auth as auth_module

        class BadCatalogResponse:
            status_code = 500
            def json(self):
                return {'error': 'internal error'}

        original_session = auth_module.Session
        original_post = auth_module.http_requests.post
        auth_module.Session = lambda: MockSession()
        auth_module.http_requests.post = lambda *a, **kw: BadCatalogResponse()

        response = client.post('/sign-up',
            data=json.dumps({
                'nombre': 'Admin',
                'email': 'admin2@hotel.com',
                'password': 'Pass1234@',
                'rol': 'hotel',
                'hotel': {'nombre': 'H', 'ciudad': 'Bogotá', 'pais': 'Colombia'},
            }),
            content_type='application/json',
        )

        auth_module.Session = original_session
        auth_module.http_requests.post = original_post
        assert response.status_code == 500

    def test_sign_up_hotel_catalog_connection_error(self, client, monkeypatch):
        """sign-up con rol hotel retorna 503 si catalog no está disponible"""
        import requests as real_requests

        class MockSession:
            def query(self, model):
                return self
            def filter_by(self, **kwargs):
                return self
            def first(self):
                return None
            def add(self, obj):
                pass
            def commit(self):
                pass
            def delete(self, obj):
                pass
            def close(self):
                pass

        import adapters.http.auth as auth_module

        original_session = auth_module.Session
        original_post = auth_module.http_requests.post
        auth_module.Session = lambda: MockSession()
        auth_module.http_requests.post = lambda *a, **kw: (_ for _ in ()).throw(
            real_requests.exceptions.ConnectionError('refused')
        )

        response = client.post('/sign-up',
            data=json.dumps({
                'nombre': 'Admin',
                'email': 'admin3@hotel.com',
                'password': 'Pass1234@',
                'rol': 'hotel',
                'hotel': {'nombre': 'H', 'ciudad': 'Bogotá', 'pais': 'Colombia'},
            }),
            content_type='application/json',
        )

        auth_module.Session = original_session
        auth_module.http_requests.post = original_post
        assert response.status_code == 503

