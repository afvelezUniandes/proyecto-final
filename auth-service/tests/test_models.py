import pytest
from adapters.orm.models import Usuario, AdminHotel

class TestAuthModels:
    """Pruebas para los modelos de autenticación"""

    def test_usuario_model_creation(self):
        """Test de creación del modelo Usuario"""
        usuario = Usuario(
            nombre='Test User',
            email='test@example.com',
            password_hash='hashed_password',
            activo=True,
            rol='user'
        )
        assert usuario.nombre == 'Test User'
        assert usuario.email == 'test@example.com'
        assert usuario.activo is True
        assert usuario.rol == 'user'

    def test_admin_hotel_model_creation(self):
        """Test de creación del modelo AdminHotel"""
        admin = AdminHotel(
            nombre='Admin User',
            email='admin@hotel.com',
            password_hash='hashed_password',
            activo=True
        )
        assert admin.nombre == 'Admin User'
        assert admin.email == 'admin@hotel.com'
        assert admin.activo is True

    def test_usuario_table_name(self):
        """Test del nombre de la tabla Usuario"""
        assert Usuario.__tablename__ == 'usuarios'

    def test_admin_hotel_table_name(self):
        """Test del nombre de la tabla AdminHotel"""
        assert AdminHotel.__tablename__ == 'admin_hotel'
