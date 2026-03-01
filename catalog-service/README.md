# Catalog Service

## Descripción

Microservicio de catálogo de hoteles y habitaciones para la plataforma TravelHub.

## Funcionalidades

### Gestión de Hoteles

- **POST /hotels**: Crear nuevo hotel
- **GET /hotels**: Listar todos los hoteles
  - Filtros: por ciudad
- **GET /hotels/{id}**: Obtener hotel por ID
- **PUT /hotels/{id}**: Actualizar información del hotel
- **DELETE /hotels/{id}**: Eliminar hotel

### Gestión de Habitaciones

- **POST /rooms**: Crear nueva habitación
- **GET /rooms**: Listar todas las habitaciones
  - Filtros: por hotel_id
- **GET /rooms/{id}**: Obtener habitación por ID
- **PUT /rooms/{id}**: Actualizar información de la habitación
- **DELETE /rooms/{id}**: Eliminar habitación

### Información del Hotel

Cada hotel contiene:

- Nombre
- Ciudad
- Dirección
- Calificación (rating)
- Descripción

### Información de Habitación

Cada habitación contiene:

- Número de habitación
- Tipo (Single, Double, Suite, Deluxe)
- Precio por noche
- Capacidad (personas)
- Estado de disponibilidad
- Relación con hotel

## Tecnologías

- **Flask**: Framework web
- **SQLAlchemy**: ORM para base de datos
- **PostgreSQL**: Base de datos
- **Marshmallow**: Serialización y validación

## Base de Datos

### Esquema: `catalog`

### Tabla: `hoteles`

- `id`: UUID (Primary Key)
- `nombre`: String(100)
- `ciudad`: String(100)
- `direccion`: String(200)
- `rating`: Float
- `descripcion`: Text
- `created_at`: DateTime

### Tabla: `habitaciones`

- `id`: UUID (Primary Key)
- `hotel_id`: UUID (Foreign Key → hoteles)
- `numero_habitacion`: String(10)
- `tipo`: String(50)
- `precio_noche`: Float
- `capacidad`: Integer
- `disponible`: Boolean
- `created_at`: DateTime

## Configuración

Variables de entorno requeridas:

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=5002
```

## Datos Iniciales

El servicio incluye un seed script que carga:

- 3 hoteles de ejemplo en diferentes ciudades
- 9 habitaciones distribuidas entre los hoteles

## Ejecución

```bash
# Desarrollo local
python app.py

# Con Docker
docker build -t catalog-service .
docker run -p 5002:5002 catalog-service
```

## Tests

```bash
pytest tests/ -v --cov=.
```

Cobertura actual: **95%+**
