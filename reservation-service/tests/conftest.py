import pytest
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Patch DB antes de importar app para evitar conexión real
os.environ['RESERVATION_DATABASE_URL'] = 'sqlite:///:memory:'
os.environ['JWT_SECRET'] = 'test_secret'

from app import app as flask_app
from adapters.orm.models import Base

@pytest.fixture
def app():
    flask_app.config['TESTING'] = True
    flask_app.config['JWT_SECRET'] = 'test_secret'
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def test_db():
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()
