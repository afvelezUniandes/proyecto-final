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
    "definitions": {
        "Error": {
            "type": "object",
            "properties": {
                "error": {"type": "string", "example": "Service unavailable"},
            },
        },
        "MessageResponse": {
            "type": "object",
            "properties": {
                "message": {"type": "string", "example": "Operation completed successfully"},
            },
        },
        "Usuario": {
            "type": "object",
            "properties": {
                "id": {"type": "integer", "example": 1},
                "nombre": {"type": "string", "example": "Juan Pérez"},
                "email": {"type": "string", "example": "juan@correo.com"},
                "rol": {"type": "string", "enum": ["cliente", "hotel"], "example": "cliente"},
                "telefono": {"type": "string", "example": "+573001234567"},
                "pais": {"type": "string", "example": "Colombia"},
                "idioma_preferido": {"type": "string", "example": "es"},
                "activo": {"type": "boolean", "example": True},
                "fecha_registro": {"type": "string", "format": "date-time"},
            },
        },
        "TokenResponse": {
            "type": "object",
            "properties": {
                "token": {"type": "string", "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."},
            },
        },
        "Hotel": {
            "type": "object",
            "properties": {
                "id": {"type": "integer", "example": 1},
                "admin_id": {"type": "integer", "example": 5},
                "nombre": {"type": "string", "example": "Hotel Santamaría"},
                "descripcion": {"type": "string"},
                "estrellas": {"type": "integer", "example": 4},
                "activo": {"type": "boolean", "example": True},
                "fecha_creacion": {"type": "string", "format": "date-time"},
                "direccion": {"type": "string", "example": "Calle 123 #45-67"},
                "ciudad": {"type": "string", "example": "Bogotá"},
                "pais": {"type": "string", "example": "Colombia"},
                "image_url": {"type": "string", "example": "https://bucket.s3.amazonaws.com/hotel.jpg"},
                "precio_noche": {"type": "number", "example": 150000},
                "precio_noche_max": {"type": "number", "example": 300000},
            },
        },
        "HotelesResponse": {
            "type": "object",
            "properties": {
                "total": {"type": "integer", "example": 50},
                "page": {"type": "integer", "example": 1},
                "per_page": {"type": "integer", "example": 20},
                "hotels": {"type": "array", "items": {"$ref": "#/definitions/Hotel"}},
            },
        },
        "Habitacion": {
            "type": "object",
            "properties": {
                "id": {"type": "integer", "example": 1},
                "hotel_id": {"type": "integer", "example": 1},
                "nombre": {"type": "string", "example": "Suite 101"},
                "tipo": {"type": "string", "example": "Doble"},
                "capacidad": {"type": "integer", "example": 2},
                "disponible": {"type": "boolean", "example": True},
                "precio_noche": {"type": "number", "example": 150000},
                "moneda": {"type": "string", "example": "COP"},
                "descripcion": {"type": "string"},
                "eliminada": {"type": "boolean", "example": False},
            },
        },
        "Reserva": {
            "type": "object",
            "properties": {
                "id": {"type": "integer", "example": 1},
                "codigo": {"type": "string", "example": "TH-2025-0001"},
                "usuario_id": {"type": "integer", "example": 3},
                "habitacion_id": {"type": "integer", "example": 2},
                "hotel_id": {"type": "integer", "example": 1},
                "nombre_hotel": {"type": "string", "example": "Hotel Santamaría"},
                "tipo_habitacion": {"type": "string", "example": "Doble"},
                "fecha_checkin": {"type": "string", "format": "date", "example": "2025-06-01"},
                "fecha_checkout": {"type": "string", "format": "date", "example": "2025-06-05"},
                "num_huespedes": {"type": "integer", "example": 2},
                "monto_total": {"type": "number", "example": 600000},
                "moneda": {"type": "string", "example": "COP"},
                "estado": {"type": "string", "enum": ["confirmada", "cancelada", "completada"], "example": "confirmada"},
                "fecha_creacion": {"type": "string", "format": "date-time"},
                "fecha_cancelacion": {"type": "string", "format": "date-time", "x-nullable": True},
            },
        },
        "ReservaEnriquecida": {
            "allOf": [
                {"$ref": "#/definitions/Reserva"},
                {
                    "type": "object",
                    "properties": {
                        "habitacion_nombre": {"type": "string", "example": "Suite 101"},
                        "precio_noche": {"type": "number", "example": 150000},
                        "noches": {"type": "integer", "example": 4},
                        "huesped_nombre": {"type": "string", "example": "Juan Pérez"},
                        "huesped_email": {"type": "string", "example": "juan@correo.com"},
                        "huesped_telefono": {"type": "string", "example": "+573001234567"},
                        "huesped_pais": {"type": "string", "example": "Colombia"},
                        "huesped_idioma": {"type": "string", "example": "es"},
                    },
                },
            ],
        },
        "HotelStats": {
            "type": "object",
            "properties": {
                "reservas_activas": {"type": "integer", "example": 12},
                "reservas_activas_delta": {"type": "integer", "example": 0},
                "tasa_ocupacion": {"type": "integer", "example": 75},
                "tasa_ocupacion_delta": {"type": "integer", "example": 0},
                "ingresos_mes": {"type": "number", "example": 4500000},
                "ingresos_mes_delta": {"type": "integer", "example": 0},
                "calificacion_promedio": {"type": "number", "example": 0},
                "total_resenas": {"type": "integer", "example": 0},
                "weekly_occupancy": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "dia": {"type": "string", "example": "Lun"},
                            "dia_num": {"type": "integer", "example": 2},
                            "mes_num": {"type": "integer", "example": 6},
                            "porcentaje": {"type": "integer", "example": 80},
                            "es_hoy": {"type": "boolean", "example": False},
                        },
                    },
                },
            },
        },
    },
}


def init_swagger(app):
    Swagger(app, template=swagger_template)
