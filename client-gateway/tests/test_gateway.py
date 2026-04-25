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

    def test_health_endpoint(self, client):
        """Test del endpoint /health para ALB"""
        with patch('requests.get') as mock_get:
            # Mock de las respuestas de los servicios backend
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {'status': 'healthy'}
            mock_get.return_value = mock_response
            
            response = client.get('/health')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert data['service'] == 'client-gateway'
            assert 'backends' in data


def _valid_token():
    """Genera un JWT válido para tests"""
    return jwt.encode(
        {'user_id': 1, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
        'test_secret',
        algorithm='HS256',
    )


class TestCatalogProtectedRoutes:
    """Endpoints de catálogo que requieren token"""

    @patch('requests.get')
    def test_get_cities(self, mock_get, client):
        mock_get.return_value = Mock(json=lambda: ['Bogotá', 'Medellín'], status_code=200)
        response = client.get('/catalog/cities')
        assert response.status_code == 200
        assert mock_get.called

    @patch('requests.get')
    def test_get_hotel_detail(self, mock_get, client):
        mock_get.return_value = Mock(json=lambda: {'id': 1, 'nombre': 'Hotel'}, status_code=200)
        response = client.get('/catalog/hotels/1')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['id'] == 1

    @patch('requests.get')
    def test_get_hotel_detail_service_unavailable(self, mock_get, client):
        mock_get.side_effect = requests.exceptions.RequestException('refused')
        response = client.get('/catalog/hotels/1')
        assert response.status_code == 503

    @patch('requests.get')
    def test_get_my_hotel(self, mock_get, client):
        mock_get.return_value = Mock(json=lambda: {'id': 5, 'admin_id': 1}, status_code=200)
        response = client.get('/catalog/hotels/mine',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 200

    def test_get_my_hotel_no_token(self, client):
        response = client.get('/catalog/hotels/mine')
        assert response.status_code == 401

    @patch('requests.post')
    def test_create_hotel(self, mock_post, client):
        mock_post.return_value = Mock(json=lambda: {'id': 10}, status_code=201)
        response = client.post('/catalog/hotels',
            data=json.dumps({'nombre': 'H', 'ciudad': 'Bogotá', 'pais': 'Colombia'}),
            content_type='application/json',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 201

    @patch('requests.put')
    def test_update_hotel(self, mock_put, client):
        mock_put.return_value = Mock(json=lambda: {'id': 1, 'nombre': 'Nuevo'}, status_code=200)
        response = client.put('/catalog/hotels/1',
            data=json.dumps({'nombre': 'Nuevo'}),
            content_type='application/json',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 200

    @patch('requests.post')
    def test_create_room(self, mock_post, client):
        mock_post.return_value = Mock(json=lambda: {'id': 3}, status_code=201)
        response = client.post('/catalog/rooms',
            data=json.dumps({'hotel_id': 1, 'nombre': 'Suite', 'precio_noche': 200000}),
            content_type='application/json',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 201

    @patch('requests.put')
    def test_update_room(self, mock_put, client):
        mock_put.return_value = Mock(json=lambda: {'id': 1}, status_code=200)
        response = client.put('/catalog/rooms/1',
            data=json.dumps({'precio_noche': 300000}),
            content_type='application/json',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 200

    @patch('requests.delete')
    def test_delete_room(self, mock_delete, client):
        mock_delete.return_value = Mock(json=lambda: {'message': 'deleted'}, status_code=200)
        response = client.delete('/catalog/rooms/1',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 200

    @patch('requests.post')
    def test_create_room_service_unavailable(self, mock_post, client):
        mock_post.side_effect = requests.exceptions.RequestException('refused')
        response = client.post('/catalog/rooms',
            data=json.dumps({'hotel_id': 1, 'nombre': 'Suite', 'precio_noche': 200000}),
            content_type='application/json',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 503


class TestReservationRoutes:
    """Endpoints de reservas"""

    @patch('requests.get')
    def test_get_occupied_rooms_public(self, mock_get, client):
        mock_get.return_value = Mock(json=lambda: {'occupied_room_ids': [1, 2]}, status_code=200)
        response = client.get('/reservations/occupied-rooms?hotel_id=1&fecha_checkin=2026-05-01&fecha_checkout=2026-05-05')
        assert response.status_code == 200

    @patch('requests.get')
    def test_get_occupied_rooms_unavailable(self, mock_get, client):
        mock_get.side_effect = requests.exceptions.RequestException('refused')
        response = client.get('/reservations/occupied-rooms')
        assert response.status_code == 503

    @patch('requests.get')
    def test_get_reservations(self, mock_get, client):
        mock_get.return_value = Mock(json=lambda: [], status_code=200)
        response = client.get('/reservations',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 200

    def test_get_reservations_no_token(self, client):
        response = client.get('/reservations')
        assert response.status_code == 401

    @patch('requests.get')
    def test_get_reservation_by_id(self, mock_get, client):
        mock_get.return_value = Mock(json=lambda: {'id': 1}, status_code=200)
        response = client.get('/reservations/1',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 200

    @patch('requests.post')
    def test_create_reservation(self, mock_post, client):
        mock_post.return_value = Mock(json=lambda: {'id': 99}, status_code=201)
        response = client.post('/reservations',
            data=json.dumps({'habitacion_id': 1, 'fecha_checkin': '2026-06-01', 'fecha_checkout': '2026-06-03'}),
            content_type='application/json',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 201

    @patch('requests.patch')
    def test_cancel_reservation(self, mock_patch, client):
        mock_patch.return_value = Mock(json=lambda: {'message': 'cancelled'}, status_code=200)
        response = client.patch('/reservations/1/cancel',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 200

    @patch('requests.get')
    def test_get_hotel_reservations(self, mock_get, client):
        mock_get.return_value = Mock(json=lambda: [], status_code=200)
        response = client.get('/reservations/hotel/1',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 200

    @patch('requests.get')
    def test_get_reservations_service_unavailable(self, mock_get, client):
        mock_get.side_effect = requests.exceptions.RequestException('refused')
        response = client.get('/reservations',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 503


class TestProfileRoutes:
    """Endpoints de perfil via gateway"""

    @patch('requests.get')
    def test_get_profile(self, mock_get, client):
        mock_get.return_value = Mock(
            json=lambda: {'id': 1, 'nombre': 'Test', 'email': 'test@example.com'},
            status_code=200,
        )
        response = client.get('/auth/profile',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['nombre'] == 'Test'

    def test_get_profile_no_token(self, client):
        response = client.get('/auth/profile')
        assert response.status_code == 401

    @patch('requests.put')
    def test_update_profile(self, mock_put, client):
        mock_put.return_value = Mock(
            json=lambda: {'id': 1, 'nombre': 'Nuevo'},
            status_code=200,
        )
        response = client.put('/auth/profile',
            data=json.dumps({'nombre': 'Nuevo'}),
            content_type='application/json',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 200

    @patch('requests.get')
    def test_get_profile_service_unavailable(self, mock_get, client):
        mock_get.side_effect = requests.exceptions.RequestException('refused')
        response = client.get('/auth/profile',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 503

    @patch('requests.put')
    def test_update_profile_service_unavailable(self, mock_put, client):
        mock_put.side_effect = requests.exceptions.RequestException('refused')
        response = client.put('/auth/profile',
            data=json.dumps({'nombre': 'X'}),
            content_type='application/json',
            headers={'Authorization': f'Bearer {_valid_token()}'},
        )
        assert response.status_code == 503

