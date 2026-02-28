# TravelHub - Plataforma de Reservas de Hoteles

Sistema de microservicios para gestión de hoteles y reservas, desarrollado con Flask, PostgreSQL y Docker.

## 🏗️ Arquitectura

Este proyecto utiliza **arquitectura hexagonal** (ports and adapters) con 3 microservicios:

- **auth-service** (Puerto 5000): Autenticación y autorización con JWT
  - Sign up / Sign in / Sign out
  - Gestión de usuarios y administradores de hoteles
- **catalog-service** (Puerto 5001): Catálogo de hoteles y habitaciones
  - CRUD de hoteles
  - Consulta de habitaciones
  - Filtros avanzados y paginación
- **client-gateway** (Puerto 8000): API Gateway
  - Proxy para todos los servicios
  - Validación de JWT
  - Punto de entrada único para clientes

## 🚀 Quick Start

### Opción 1: Usando Docker (Recomendado)

```bash
# 1. Levantar todos los servicios (las tablas se crean automáticamente)
docker-compose up --build

# 2. En otra terminal, cargar datos de prueba (100 hoteles + 1000 habitaciones)
docker exec -i proyecto-final-postgres-1 psql -U travelhub_user -d travelhub < seed_catalog.sql

# 3. Probar el API
curl http://localhost:8000/
```

**Nota**: SQLAlchemy crea las tablas automáticamente al iniciar cada servicio. No necesitas ejecutar scripts SQL manualmente excepto el seed.

### Opción 2: Desarrollo Local (sin Docker)

```bash
# 1. Crear y activar entorno virtual
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# o
venv\Scripts\activate  # Windows

# 2. Usar script de setup automático (recomendado)
chmod +x setup_venv.sh
./setup_venv.sh

# 3. O instalar manualmente las dependencias
cd auth-service && pip install -r requirements.txt && cd ..
cd catalog-service && pip install -r requirements.txt && cd ..
cd client-gateway && pip install -r requirements.txt && cd ..
```

Para instrucciones detalladas, ver:

- [SETUP.md](SETUP.md) - Guía de instalación completa
- [VENV_GUIDE.md](VENV_GUIDE.md) - Guía de entorno virtual
- [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) - Pruebas con Postman + Docker
- [TESTING.md](TESTING.md) - Ejecución de tests unitarios

## 📋 Funcionalidades Principales

### Autenticación

- ✅ Registro de usuarios
- ✅ Login con JWT (2 horas de expiración)
- ✅ Logout
- ✅ Hash de contraseñas con Werkzeug

### Catálogo de Hoteles

- ✅ Listado de hoteles con paginación (20 por defecto)
- ✅ Filtros por: nombre, ciudad, país, estrellas, estado activo
- ✅ Listado de habitaciones
- ✅ 100 hoteles y 1000 habitaciones de prueba (seed)

### API Gateway

- ✅ Enrutamiento a microservicios
- ✅ Validación de JWT en endpoints protegidos
- ✅ Manejo de errores y timeouts

## 🛠️ Stack Tecnológico

- **Backend**: Python 3.10 + Flask
- **ORM**: SQLAlchemy
- **Base de datos**: PostgreSQL 15
- **Autenticación**: JWT (PyJWT)
- **Contenedores**: Docker + Docker Compose
- **Arquitectura**: Hexagonal (Ports & Adapters)

## 📁 Estructura del Proyecto

```
proyecto-final/
├── auth-service/              # Microservicio de autenticación
│   ├── adapters/
│   │   ├── http/             # Controladores Flask (endpoints)
│   │   │   └── auth.py
│   │   └── orm/              # Modelos SQLAlchemy
│   │       └── models.py     # Usuario, AdminHotel
│   ├── domain/               # Lógica de negocio
│   ├── ports/                # Interfaces
│   ├── app.py               # Punto de entrada
│   ├── config.py            # Configuración DB y JWT
│   └── requirements.txt
│
├── catalog-service/           # Microservicio de catálogo
│   ├── adapters/
│   │   ├── http/             # Controladores Flask
│   │   │   └── hotels.py     # Endpoints de hoteles
│   │   └── orm/              # Modelos SQLAlchemy
│   │       └── models.py     # Hotel, Habitacion
│   ├── domain/
│   ├── ports/
│   ├── app.py
│   ├── config.py
│   └── requirements.txt
│
├── client-gateway/            # API Gateway
│   ├── app.py                # Proxy y validación JWT
│   └── requirements.txt
│
├── docker-compose.yml         # Orquestación de servicios

├── seed_catalog.sql           # 100 hoteles + 1000 habitaciones
├── SETUP.md                   # Guía de instalación detallada
└── README.md                  # Este archivo
```

## 🔌 Endpoints Disponibles

### Auth (vía Gateway)

```
POST /auth/sign-up       - Registro de usuario
POST /auth/sign-in       - Iniciar sesión (retorna JWT)
POST /auth/sign-out      - Cerrar sesión (requiere JWT)
```

### Catalog (vía Gateway)

```
GET /catalog/hotels      - Listar hoteles
  Query params:
    - nombre: filtro por nombre (case-insensitive)
    - ciudad: filtro por ciudad
    - pais: filtro por país
    - estrellas: filtro por estrellas (1-5)
    - activo: filtro por estado (true/false)
    - page: número de página (default: 1)
    - per_page: elementos por página (default: 20)

GET /catalog/rooms       - Listar habitaciones
```

## 📊 Datos de Prueba

El proyecto incluye un seed de datos de prueba:

- **100 hoteles** en 20 ciudades de Colombia
- **1000 habitaciones** (10 por hotel)
- Variedad de tipos: Suite, Standard, Deluxe, Familiar, Economy
- Precios realistas en COP
- Imágenes de ejemplo (picsum.photos)

## 🔐 Seguridad

- Contraseñas hasheadas con Werkzeug (pbkdf2:sha256)
- JWT con expiración de 2 horas
- Validación de tokens en el Gateway
- Variables de entorno para secretos

## 🧪 Testing

Para pruebas con **Postman**, ver [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) - Guía completa con ejemplos.

### Ejemplos de uso con curl:

```bash
# 1. Registrar usuario
curl -X POST http://localhost:8000/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test User","email":"test@example.com","password":"test123"}'

# 2. Login
curl -X POST http://localhost:8000/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# 3. Obtener hoteles en Bogotá
curl "http://localhost:8000/catalog/hotels?ciudad=Bogotá&estrellas=5"

# 4. Paginación
curl "http://localhost:8000/catalog/hotels?page=2&per_page=10"
```

## 🚢 Despliegue a AWS ECS (Futuro)

Este proyecto está preparado para desplegarse en AWS ECS. Los Dockerfiles están optimizados y el docker-compose puede adaptarse a task definitions de ECS.

## 📝 Notas de Desarrollo

- **Arquitectura hexagonal**: Separación clara entre dominio, adaptadores y puertos
- **SQLAlchemy**: ORM con schemas de PostgreSQL (`catalog` para hoteles)
- **Flask**: Framework ligero y modular con Blueprints
- **Docker Compose**: Orchestración local con healthchecks

## 🤝 Contribución

Este es un proyecto académico para la Universidad de los Andes.

## 📄 Licencia

Proyecto educativo - Universidad de los Andes 2026
