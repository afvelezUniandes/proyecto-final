from flask import Flask, jsonify
from adapters.http.auth import bp as auth_bp
from adapters.orm.models import Base
from config import engine
import os

app = Flask(__name__)
app.register_blueprint(auth_bp)

@app.route('/')
def hello():
    return {'message': 'Auth Service - OK'}

@app.route('/health')
def health():
    """Health check endpoint para ALB"""
    health_data = {
        'status': 'healthy',
        'service': 'auth-service'
    }
    
    try:
        # Intentar verificar conexión a la base de datos
        with engine.connect() as conn:
            from sqlalchemy import text
            conn.execute(text("SELECT 1"))
        health_data['database'] = 'connected'
    except Exception as e:
        # En ambiente de test o si la BD no está disponible
        health_data['database'] = 'not checked'
    
    return jsonify(health_data), 200

if __name__ == '__main__':
    # Crear las tablas solo al ejecutar directamente, no en tests
    with app.app_context():
        Base.metadata.create_all(engine)
        print("✓ Auth tables created/verified")
    
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)