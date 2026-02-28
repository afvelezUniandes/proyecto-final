import pytest
import sys
import os

# Configurar variables de entorno para tests ANTES de importar app
os.environ['JWT_SECRET'] = 'test_secret'
os.environ['AUTH_SERVICE_URL'] = 'http://localhost:5000'
os.environ['CATALOG_SERVICE_URL'] = 'http://localhost:5001'

# Agregar el directorio padre al path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app as flask_app

@pytest.fixture
def app():
    """Fixture de aplicación Flask"""
    flask_app.config['TESTING'] = True
    yield flask_app

@pytest.fixture
def client(app):
    """Fixture de cliente de pruebas"""
    return app.test_client()
