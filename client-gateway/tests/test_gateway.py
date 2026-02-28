import pytest
import json
import jwt
import datetime
from unittest.mock import Mock, patch
import requests

class TestGatewayRouting:
    """Pruebas para el enrutamiento del gateway"""

    def test_health_check(self, client):
        """Test de health check del gateway"""
        response = client.get('/')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'Client Gateway' in data['message']
        assert 'services' in data

    @patch('requests.post')
    def test_sign_up_routing(self, mock_post, client):
        """Test de enrutamiento de sign-up"""
        mock_response = Mock()
        mock_response.json.return_value = {'message': 'User created'}
        mock_response.status_code = 201
        mock_post.return_value = mock_response
        
        response = client.post('/auth/sign-up',
            data=json.dumps({
                'nombre': 'Test User',
                'email': 'test@example.com',
                'password': 'password123'
            }),
            content_type='application/json'
        )
        
        assert response.status_code == 201
        assert mock_post.called
        data = json.loads(response.data)
        assert data['message'] == 'User created'

    @patch('requests.post')
    def test_sign_in_routing(self, mock_post, client):
        """Test de enrutamiento de sign-in"""
        mock_response = Mock()
        mock_response.json.return_value = {'token': 'fake_token'}
        mock_response.status_code = 200
        mock_post.return_value = mock_response
        
        response = client.post('/auth/sign-in',
            data=json.dumps({
                'email': 'test@example.com',
                'password': 'password123'
            }),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        assert mock_post.called
        data = json.loads(response.data)
        assert 'token' in data

    @patch('requests.post')
    def test_sign_out_with_valid_token(self, mock_post, client):
        """Test de sign-out con token válido"""
        mock_response = Mock()
        mock_response.json.return_value = {'message': 'Signed out'}
        mock_response.status_code = 200
        mock_post.return_value = mock_response
        
        # Crear un token válido
        token = jwt.encode({
            'user_id': 1,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, 'test_secret', algorithm='HS256')
        
        response = client.post('/auth/sign-out',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'Signed out' in data['message']

    def test_sign_out_without_token(self, client):
        """Test de sign-out sin token"""
        response = client.post('/auth/sign-out')
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Token is missing' in data['error']

    def test_sign_out_with_invalid_token(self, client):
        """Test de sign-out con token inválido"""
        response = client.post('/auth/sign-out',
            headers={'Authorization': 'Bearer invalid_token'}
        )
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Invalid token' in data['error']

    def test_sign_out_with_expired_token(self, client):
        """Test de sign-out con token expirado"""
        # Crear un token expirado
        token = jwt.encode({
            'user_id': 1,
            'exp': datetime.datetime.utcnow() - datetime.timedelta(hours=1)
        }, 'test_secret', algorithm='HS256')
        
        response = client.post('/auth/sign-out',
            headers={'Authorization': f'Bearer {token}'}
        )
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Token has expired' in data['error']

    @patch('requests.get')
    def test_get_hotels_routing(self, mock_get, client):
        """Test de enrutamiento de obtener hoteles"""
        mock_response = Mock()
        mock_response.json.return_value = {
            'total': 1,
            'page': 1,
            'per_page': 20,
            'hotels': [{'id': 1, 'nombre': 'Hotel Test'}]
        }
        mock_response.status_code = 200
        mock_get.return_value = mock_response
        
        response = client.get('/catalog/hotels')
        
        assert response.status_code == 200
        assert mock_get.called
        data = json.loads(response.data)
        assert 'hotels' in data

    @patch('requests.get')
    def test_get_hotels_with_filters(self, mock_get, client):
        """Test de enrutamiento con filtros"""
        mock_response = Mock()
        mock_response.json.return_value = {
            'total': 1,
            'page': 1,
            'per_page': 20,
            'hotels': [{'id': 1, 'nombre': 'Hotel Bogotá', 'ciudad': 'Bogotá'}]
        }
        mock_response.status_code = 200
        mock_get.return_value = mock_response
        
        response = client.get('/catalog/hotels?ciudad=Bogotá&estrellas=5')
        
        assert response.status_code == 200
        assert mock_get.called
        # Verificar que los parámetros se pasaron correctamente
        call_args = mock_get.call_args
        assert 'params' in call_args.kwargs

    @patch('requests.get')
    def test_get_rooms_routing(self, mock_get, client):
        """Test de enrutamiento de obtener habitaciones"""
        mock_response = Mock()
        mock_response.json.return_value = [
            {'id': 1, 'nombre': 'Suite 101', 'tipo': 'Suite'}
        ]
        mock_response.status_code = 200
        mock_get.return_value = mock_response
        
        response = client.get('/catalog/rooms')
        
        assert response.status_code == 200
        assert mock_get.called
        data = json.loads(response.data)
        assert isinstance(data, list)

    @patch('requests.post')
    def test_auth_service_unavailable(self, mock_post, client):
        """Test de servicio de autenticación no disponible"""
        mock_post.side_effect = requests.exceptions.RequestException('Connection error')
        
        response = client.post('/auth/sign-in',
            data=json.dumps({
                'email': 'test@example.com',
                'password': 'password123'
            }),
            content_type='application/json'
        )
        
        assert response.status_code == 503
        data = json.loads(response.data)
        assert 'unavailable' in data['error']

    @patch('requests.get')
    def test_catalog_service_unavailable(self, mock_get, client):
        """Test de servicio de catálogo no disponible"""
        mock_get.side_effect = requests.exceptions.RequestException('Connection error')
        
        response = client.get('/catalog/hotels')
        
        assert response.status_code == 503
        data = json.loads(response.data)
        assert 'unavailable' in data['error']

class TestJWTValidation:
    """Pruebas para la validación de JWT"""

    def test_verify_token_decorator(self, client):
        """Test del decorador de verificación de token"""
        # Crear un token válido
        token = jwt.encode({
            'user_id': 1,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, 'test_secret', algorithm='HS256')
        
        # Intentar acceder a un endpoint protegido
        with patch('requests.post') as mock_post:
            mock_response = Mock()
            mock_response.json.return_value = {'message': 'Signed out'}
            mock_response.status_code = 200
            mock_post.return_value = mock_response
            
            response = client.post('/auth/sign-out',
                headers={'Authorization': f'Bearer {token}'}
            )
            
            assert response.status_code == 200

    @patch('requests.post')
    def test_token_without_bearer_prefix(self, mock_post, client):
        """Test de token sin prefijo Bearer"""
        mock_response = Mock()
        mock_response.json.return_value = {'message': 'Signed out'}
        mock_response.status_code = 200
        mock_post.return_value = mock_response
        
        token = jwt.encode({
            'user_id': 1,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, 'test_secret', algorithm='HS256')
        
        response = client.post('/auth/sign-out',
            headers={'Authorization': token}
        )
        
        # El código maneja tokens sin Bearer, así que debería funcionar
        assert response.status_code == 200
