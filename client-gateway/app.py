import os
from flask import Flask
from flask_cors import CORS
from swagger_config import init_swagger
from routes import general, auth, catalog, reservations

app = Flask(__name__)
CORS(app)

app.register_blueprint(general.bp)
app.register_blueprint(auth.bp)
app.register_blueprint(catalog.bp)
app.register_blueprint(reservations.bp)

init_swagger(app)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
