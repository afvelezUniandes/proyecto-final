import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Apuntar a SQLite en memoria antes de importar la app
os.environ['NOTIFICATION_DATABASE_URL'] = 'sqlite:///:memory:'
os.environ['JWT_SECRET'] = 'test_secret'
os.environ['SENDGRID_API_KEY'] = ''
os.environ['SENDGRID_FROM_EMAIL'] = 'test@test.com'

from app import app as flask_app
from adapters.orm.models import Base
from config import engine

# Crear tablas para tests
Base.metadata.create_all(engine)


@pytest.fixture
def app():
    flask_app.config['TESTING'] = True
    yield flask_app


@pytest.fixture
def client(app):
    return app.test_client()
