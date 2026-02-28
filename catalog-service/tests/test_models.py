import pytest
from decimal import Decimal
from adapters.orm.models import Hotel, Habitacion

class TestCatalogModels:
    """Pruebas para los modelos de catálogo"""

    def test_hotel_model_creation(self):
        """Test de creación del modelo Hotel"""
        hotel = Hotel(
            nombre='Hotel Test',
            ciudad='Bogotá',
            pais='Colombia',
            estrellas=5,
            activo=True,
            admin_id=1,
            descripcion='Hotel de prueba'
        )
        assert hotel.nombre == 'Hotel Test'
        assert hotel.ciudad == 'Bogotá'
        assert hotel.pais == 'Colombia'
        assert hotel.estrellas == 5
        assert hotel.activo is True

    def test_habitacion_model_creation(self):
        """Test de creación del modelo Habitacion"""
        habitacion = Habitacion(
            hotel_id=1,
            nombre='Suite 101',
            tipo='Suite',
            capacidad=2,
            precio_noche=Decimal('350.00'),
            moneda='COP',
            disponible=True
        )
        assert habitacion.nombre == 'Suite 101'
        assert habitacion.tipo == 'Suite'
        assert habitacion.capacidad == 2
        assert habitacion.precio_noche == Decimal('350.00')
        assert habitacion.disponible is True

    def test_hotel_table_name(self):
        """Test del nombre de la tabla Hotel"""
        assert Hotel.__tablename__ == 'hoteles'

    def test_habitacion_table_name(self):
        """Test del nombre de la tabla Habitacion"""
        assert Habitacion.__tablename__ == 'habitaciones'

    def test_hotel_table_schema(self):
        """Test del schema de la tabla Hotel"""
        assert Hotel.__table_args__['schema'] == 'catalog'

    def test_habitacion_table_schema(self):
        """Test del schema de la tabla Habitacion"""
        assert Habitacion.__table_args__['schema'] == 'catalog'
