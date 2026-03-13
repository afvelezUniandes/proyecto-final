from flask import Flask, jsonify
from sqlalchemy import text
from adapters.http.reservations import bp as reservations_bp
from adapters.orm.models import Base
from config import engine
import os

app = Flask(__name__)
app.register_blueprint(reservations_bp)

# Crear schema y tablas al arrancar
with app.app_context():
    try:
        with engine.connect() as conn:
            conn.execute(text("CREATE SCHEMA IF NOT EXISTS reservation"))
            conn.commit()
    except Exception:
        pass  # SQLite en tests no soporta schemas
    Base.metadata.create_all(engine)
    print("✓ Reservation tables created/verified")


@app.route('/')
def hello():
    return {'message': 'Reservation Service - OK'}


@app.route('/health')
def health():
    health_data = {'status': 'healthy', 'service': 'reservation-service'}
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        health_data['database'] = 'connected'
    except Exception:
        health_data['database'] = 'not checked'
    return jsonify(health_data), 200


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=False)
