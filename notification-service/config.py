import os
from sqlalchemy import create_engine

NOTIFICATION_DATABASE_URL = os.getenv(
    'NOTIFICATION_DATABASE_URL',
    'postgresql://travelhub_user:travelhub_pass@localhost:5432/travelhub'
)
JWT_SECRET = os.getenv('JWT_SECRET', 'mi_secreto_super_seguro_jwt_2024')

engine = create_engine(NOTIFICATION_DATABASE_URL, echo=False)
