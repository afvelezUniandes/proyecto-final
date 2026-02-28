# TravelHub - Guía de Setup

## Requisitos previos

- Docker y Docker Compose instalados
- PostgreSQL (opcional, si quieres correr sin Docker)
- Python 3.10+ (opcional, si quieres correr sin Docker)

## Setup con Docker (Recomendado)

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd proyecto-final
```

### 2. Levantar los servicios

```bash
docker-compose up --build
```

Esto levantará:

- PostgreSQL en el puerto 5432
- Auth Service en el puerto 5000
- Catalog Service en el puerto 5001
- Client Gateway en el puerto 8000

### 3. Crear las tablas en la base de datos

Conectarse a PostgreSQL:

**Nota importante**: Las tablas de la base de datos se crean **automáticamente** cuando inicias cada servicio gracias a SQLAlchemy. Solo necesitas cargar los datos de prueba.

```bash
# Cargar datos de prueba (100 hoteles y 1000 habitaciones)
docker exec -i proyecto-final-postgres-1 psql -U travelhub_user -d travelhub < seed_catalog.sql
```

### 4. Probar los endpoints

#### Health check

```bash
curl http://localhost:8000/
```

#### Crear un usuario

```bash
curl -X POST http://localhost:8000/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "telefono": "+57123456789",
    "pais": "Colombia"
  }'
```

#### Iniciar sesión

```bash
curl -X POST http://localhost:8000/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

Esto devolverá un token JWT que puedes usar para endpoints protegidos.

#### Obtener hoteles

```bash
# Todos los hoteles (con paginación)
curl http://localhost:8000/catalog/hotels

# Filtrar por ciudad
curl "http://localhost:8000/catalog/hotels?ciudad=Bogotá"

# Filtrar por estrellas
curl "http://localhost:8000/catalog/hotels?estrellas=5"

# Paginación personalizada
curl "http://localhost:8000/catalog/hotels?page=2&per_page=10"
```

#### Obtener habitaciones

```bash
curl http://localhost:8000/catalog/rooms
```

## Setup sin Docker (Desarrollo local)

### 1. Crear entorno virtual

```bash
# Desde la raíz del proyecto
python3 -m venv venv

# Activar el entorno virtual
# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 2. Instalar PostgreSQL localmente

```bash
# macOS
brew install postgresql
brew services start postgresql

# Crear base de datos
createdb travelhub
```

### 3. Crear las tablas

**Nota**: Las tablas se crean automáticamente al iniciar los servicios. Solo carga el seed:

```bash
psql -U <tu_usuario> -d travelhub -f seed_catalog.sql
```

### 4. Configurar variables de entorno

Copia los archivos .env.example a .env en cada servicio y ajusta las URLs:

```bash
cp auth-service/.env.example auth-service/.env
cp catalog-service/.env.example catalog-service/.env
cp client-gateway/.env.example client-gateway/.env
```

Edita los .env para usar localhost en lugar de los nombres de servicios de Docker.

### 5. Instalar dependencias y correr cada servicio

**IMPORTANTE**: Asegúrate de tener el entorno virtual activado antes de instalar dependencias.

#### Auth Service

```bash
cd auth-service
pip install -r requirements.txt
python app.py
```

#### Catalog Service

```bash
cd catalog-service
pip install -r requirements.txt
python app.py
```

#### Client Gateway

```bash
cd client-gateway
pip install -r requirements.txt
python app.py
```

## Arquitectura

```
proyecto-final/
├── auth-service/          # Microservicio de autenticación
│   ├── adapters/
│   │   ├── http/         # Controladores Flask
│   │   └── orm/          # Modelos SQLAlchemy
│   ├── domain/           # Lógica de negocio
│   ├── ports/            # Interfaces
│   ├── app.py
│   ├── config.py
│   └── requirements.txt
├── catalog-service/       # Microservicio de catálogo
│   ├── adapters/
│   │   ├── http/         # Controladores Flask
│   │   └── orm/          # Modelos SQLAlchemy
│   ├── domain/           # Lógica de negocio
│   ├── ports/            # Interfaces
│   ├── app.py
│   ├── config.py
│   └── requirements.txt
├── client-gateway/        # API Gateway
│   ├── app.py
│   └── requirements.txt
├── docker-compose.yml

└── seed_catalog.sql
```

## Endpoints Disponibles

### Auth Service (vía Gateway: /auth/...)

- `POST /auth/sign-up` - Registrar usuario
- `POST /auth/sign-in` - Iniciar sesión (retorna JWT)
- `POST /auth/sign-out` - Cerrar sesión (requiere JWT)

### Catalog Service (vía Gateway: /catalog/...)

- `GET /catalog/hotels` - Listar hoteles (soporta filtros y paginación)
  - Query params: `nombre`, `ciudad`, `pais`, `estrellas`, `activo`, `page`, `per_page`
- `GET /catalog/rooms` - Listar habitaciones

## Notas importantes

1. El JWT secret debe ser el mismo en auth-service y client-gateway
2. La paginación por defecto es de 20 elementos por página
3. El seed genera 100 hoteles y 1000 habitaciones
4. Los filtros de hoteles son case-insensitive (usan ILIKE en PostgreSQL)

## Troubleshooting

### Error: No module named 'adapters'

Asegúrate de que todos los directorios tengan un archivo `__init__.py`

### Error: Connection refused

Verifica que PostgreSQL esté corriendo y que las URLs en docker-compose.yml sean correctas

### Error al crear tablas en el schema catalog

Las tablas se crean automáticamente al iniciar los servicios. Solo ejecuta el `seed_catalog.sql` para cargar datos de prueba.
