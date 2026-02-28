from flask import Flask
from sqlalchemy import text
from adapters.http.hotels import bp as hotels_bp
from adapters.orm.models import Base
from config import engine
import os

app = Flask(__name__)
app.register_blueprint(hotels_bp)

@app.route('/')
def hello():
    return {'message': 'Catalog Service - OK'}

if __name__ == '__main__':
    # Crear el schema y las tablas solo al ejecutar directamente, no en tests
    with app.app_context():
        # Crear el schema 'catalog' si no existe
        with engine.connect() as conn:
            conn.execute(text("CREATE SCHEMA IF NOT EXISTS catalog"))
            conn.commit()
        
        # Crear las tablas
        Base.metadata.create_all(engine)
        print("✓ Catalog schema and tables created/verified")
    
    app.run(host='0.0.0.0', port=5001)