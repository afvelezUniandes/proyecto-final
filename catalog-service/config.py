import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv('CATALOG_DATABASE_URL', 'postgresql://user:password@localhost:5432/travelhub')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
