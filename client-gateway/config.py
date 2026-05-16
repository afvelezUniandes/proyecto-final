import os

AUTH_SERVICE_URL = os.getenv('AUTH_SERVICE_URL', 'http://localhost:5000')
CATALOG_SERVICE_URL = os.getenv('CATALOG_SERVICE_URL', 'http://localhost:5001')
RESERVATION_SERVICE_URL = os.getenv('RESERVATION_SERVICE_URL', 'http://localhost:5002')
JWT_SECRET = os.getenv('JWT_SECRET', 'supersecretkey')
