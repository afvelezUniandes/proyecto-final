from flasgger import Swagger

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "TravelHub API",
        "description": "API Gateway centralizado de la plataforma TravelHub. Todos los endpoints de autenticación, catálogo y reservas pasan por este gateway.",
        "version": "1.0.0",
    },
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "JWT en formato: Bearer &lt;token&gt;",
        }
    },
    "consumes": ["application/json"],
    "produces": ["application/json"],
    "tags": [
        {"name": "General", "description": "Estado del servicio"},
        {"name": "Autenticación", "description": "Registro, login y perfil de usuario"},
        {"name": "Catálogo", "description": "Hoteles, habitaciones y ciudades"},
        {"name": "Reservas", "description": "Gestión de reservas de habitaciones"},
    ],
}


def init_swagger(app):
    Swagger(app, template=swagger_template)
