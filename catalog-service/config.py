import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv('CATALOG_DATABASE_URL', 'postgresql://user:password@localhost:5432/travelhub')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

# Cache Configuration (SimpleCache - in-memory)
CACHE_TTL = int(os.getenv('CACHE_TTL', 300))  # 5 minutos por defecto
CACHE_CONFIG = {
    'CACHE_TYPE': 'SimpleCache',
    'CACHE_DEFAULT_TIMEOUT': CACHE_TTL,
    'CACHE_KEY_PREFIX': 'catalog:'
}
