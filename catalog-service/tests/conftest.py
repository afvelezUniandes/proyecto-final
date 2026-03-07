import pytest
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Agregar el directorio padre al path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app as flask_app
from adapters.orm.models import Base

@pytest.fixture
def app():
    """Fixture de aplicación Flask"""
    flask_app.config['TESTING'] = True
    # Configurar cache simple para tests (no requiere Redis)
    flask_app.config['CACHE_TYPE'] = 'SimpleCache'
    flask_app.config['CACHE_DEFAULT_TIMEOUT'] = 300
    
    # Reinicializar el cache con la nueva configuración
    from flask_caching import Cache
    flask_app.cache = Cache(flask_app)
    
    yield flask_app

@pytest.fixture
def client(app):
    """Fixture de cliente de pruebas"""
    return app.test_client()

@pytest.fixture
def test_db():
    """Fixture de base de datos en memoria"""
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()
