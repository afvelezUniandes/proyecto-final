from flask import Flask, jsonify
from sqlalchemy import text
from adapters.http.notifications import bp as notifications_bp
from adapters.orm.models import Base
from config import engine

app = Flask(__name__)
app.register_blueprint(notifications_bp)


@app.route('/')
def hello():
    return {'message': 'Notification Service - OK'}


@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'notification-service'}), 200


if __name__ == '__main__':
    with app.app_context():
        with engine.connect() as conn:
            conn.execute(text('CREATE SCHEMA IF NOT EXISTS notifications'))
            conn.commit()
        Base.metadata.create_all(engine)
    app.run(host='0.0.0.0', port=5003, debug=False)
