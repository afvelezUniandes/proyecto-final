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
        class MockUser:
            id = 1
            email = 'test@example.com'
            password_hash = generate_password_hash('password123')
        
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
