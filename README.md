# TravelHub - Plataforma de Reservas de Hoteles

Sistema de microservicios para gestión de hoteles y reservas, desarrollado con Flask, PostgreSQL y Docker. Desplegado en AWS ECS con balanceador de carga (ALB) y base de datos RDS PostgreSQL.

🌐 **Endpoint en Producción**: http://proyecto-final-alb-274129795.us-east-1.elb.amazonaws.com

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

### ☁️ Producción (AWS ECS)

El sistema está desplegado y accesible públicamente:

```bash
# Endpoint de producción
BASE_URL="http://proyecto-final-alb-274129795.us-east-1.elb.amazonaws.com"

# Health check
curl "$BASE_URL/health"

# Listar hoteles
curl "$BASE_URL/catalog/hotels?page=1&per_page=5"
```

**Ver**: [JMETER_GUIDE.md](JMETER_GUIDE.md) para pruebas de carga

### 🐳 Opción 1: Usando Docker (Desarrollo Local)

```bash
# 1. Levantar todos los servicios (las tablas se crean automáticamente)
docker-compose up --build

# 2. En otra terminal, cargar datos de prueba (100 hoteles + 1000 habitaciones)
docker exec -i proyecto-final-postgres-1 psql -U travelhub_user -d travelhub < seed_catalog.sql

# 3. Probar el API
curl http://localhost:8000/
```

**Nota**: SQLAlchemy crea las tablas automáticamente al iniciar cada servicio. No necesitas ejecutar scripts SQL manualmente excepto el seed.

### 💻 Opción 2: Desarrollo Local (sin Docker)

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
- [JMETER_GUIDE.md](JMETER_GUIDE.md) - Pruebas de carga con JMeter

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

### Backend & Infraestructura

- **Backend**: Python 3.10 + Flask
- **ORM**: SQLAlchemy
- **Base de datos**: PostgreSQL 15
- **Autenticación**: JWT (PyJWT)
- **Contenedores**: Docker + Docker Compose
- **Arquitectura**: Hexagonal (Ports & Adapters)

### Despliegue en AWS

- **Compute**: ECS Fargate (256 CPU / 512 MB memoria)
- **Base de datos**: RDS PostgreSQL (db.t3.micro)
- **Balanceador**: Application Load Balancer (ALB)
- **Networking**: VPC, Security Groups, Target Groups
- **Monitoreo**: CloudWatch Logs + Metrics
- **Registry**: ECR (Elastic Container Registry)
- **CI/CD**: GitHub Actions (build y push automático a ECR)
- **Costo estimado**: ~$52-57/mes

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

**Cargar seed localmente**:

```bash
docker exec -i proyecto-final-postgres-1 psql -U travelhub_user -d travelhub < seed_catalog.sql
```

**Cargar seed en RDS**:

```bash
python load_seed.py  # Requiere acceso temporal al RDS
```

## 📈 Archivos de Resultados

- `report/` - Reporte HTML de JMeter con gráficas y percentiles
- `results.jtl` - Datos raw de la prueba de carga (30,329 requests)
- `jmeter-load-test.jmx` - Plan de pruebas JMeter (25→50→100 usuarios)
- `postman-collection.json` - Colección Postman con tests automatizados

## 🔐 Seguridad

- Contraseñas hasheadas con Werkzeug (pbkdf2:sha256)
- JWT con expiración de 2 horas
- Validación de tokens en el Gateway
- Variables de entorno para secretos

## 🧪 Testing

### Pruebas de Carga (JMeter)

El proyecto incluye un plan de pruebas de carga con **3 niveles incrementales**:

- **Nivel 1**: 25 usuarios concurrentes × 5 minutos
- **Nivel 2**: 50 usuarios concurrentes × 5 minutos
- **Nivel 3**: 100 usuarios concurrentes × 5 minutos

**Endpoint probado**: `GET /catalog/hotels` (100 hoteles en base de datos)

#### Ver Resultados

Para ver los resultados de las pruebas ejecutadas:

```bash
# Abrir reporte HTML con gráficas y métricas detalladas
open report/index.html
```

El reporte incluye:

- ✅ Dashboard con resumen ejecutivo
- 📊 Response Time Percentiles (P50, P90, P95, P99)
- 📈 Gráficas de latencia y throughput over time
- 🎯 Error rate y distribución de códigos HTTP
- 📉 Estadísticas por Thread Group (25, 50, 100 usuarios)

**Documentación completa**: [JMETER_GUIDE.md](JMETER_GUIDE.md)

### Pruebas Funcionales (Postman)

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

## ☁️ Despliegue en AWS ECS

### Infraestructura Actual

**Estado**: ✅ Desplegado y operacional

- **Cluster ECS**: `proyecto-final-cluster`
- **Service**: `travelhub-service` (1 tarea corriendo)
- **Task Definition**: `travelhub-microservices:2`
  - 3 contenedores: auth-service, catalog-service, client-gateway
  - Recursos: 256 CPU (0.25 vCPU) / 512 MB memoria total
  - Health checks: `/health` cada 30s
  - Logs: CloudWatch `/ecs/travelhub-microservices`
- **ALB**: `proyecto-final-alb`
  - DNS: http://proyecto-final-alb-274129795.us-east-1.elb.amazonaws.com
  - Target Group: `proyecto-final-tg` (IP targets, puerto 5002)
  - Health check: `GET /health` cada 30s
  - Estado: ✅ Healthy
- **RDS PostgreSQL**: `travelhub-db.cipyouuaqkqn.us-east-1.rds.amazonaws.com`
  - Instancia: db.t3.micro
  - Base de datos: 100 hoteles, 1000 habitaciones
  - Backups: 7 días
- **Security Groups**:
  - `travelhub-alb-sg`: Permite HTTP (80) desde Internet
  - `travelhub-ecs-sg`: Permite tráfico desde ALB al puerto 5002
  - `travelhub-rds-sg`: Permite PostgreSQL (5432) desde ECS

### Monitoreo

**CloudWatch Metrics**:

- CPU Utilization (ECS)
- Memory Utilization (ECS)
- Target Response Time (ALB)
- Request Count (ALB)
- HTTP 2xx/4xx/5xx counts

**Logs**: CloudWatch Logs `/ecs/travelhub-microservices` (retención: 1 día)

### Costos Mensuales Estimados

| Servicio        | Configuración                | Costo/mes   |
| --------------- | ---------------------------- | ----------- |
| **ECS Fargate** | 256 CPU, 512 MB, 730h        | $16.37      |
| **ALB**         | 730h + 0.1GB procesados      | $21-26      |
| **RDS**         | db.t3.micro, 20GB, 7d backup | $14.71      |
| **ECR**         | <500MB imágenes              | $0.05       |
| **CloudWatch**  | Logs básicos                 | <$1         |
| **Total**       |                              | **~$52-57** |

### CI/CD

GitHub Actions configurado para:

1. Build de imágenes Docker al hacer push
2. Push automático a ECR
3. Tags: `latest` + SHA del commit

## 📝 Notas de Desarrollo

- **Arquitectura hexagonal**: Separación clara entre dominio, adaptadores y puertos
- **SQLAlchemy**: ORM con schemas de PostgreSQL (`catalog` para hoteles)
- **Flask**: Framework ligero y modular con Blueprints
- **Docker Compose**: Orchestración local con healthchecks

## 🤝 Contribución

Este es un proyecto académico para la Universidad de los Andes.

## 📄 Licencia

Proyecto educativo - Universidad de los Andes 2026
