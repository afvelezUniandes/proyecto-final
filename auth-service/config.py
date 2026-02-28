import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv('AUTH_DATABASE_URL', 'postgresql://user:password@localhost:5432/travelhub')
SECRET_KEY = os.getenv('JWT_SECRET', 'supersecretkey')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
