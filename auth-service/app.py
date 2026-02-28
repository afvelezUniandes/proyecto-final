from flask import Flask
from adapters.http.auth import bp as auth_bp
from adapters.orm.models import Base
from config import engine
import os

app = Flask(__name__)
app.register_blueprint(auth_bp)

@app.route('/')
def hello():
    return {'message': 'Auth Service - OK'}

if __name__ == '__main__':
    # Crear las tablas solo al ejecutar directamente, no en tests
    with app.app_context():
        Base.metadata.create_all(engine)
        print("✓ Auth tables created/verified")
    
    app.run(host='0.0.0.0', port=5000)