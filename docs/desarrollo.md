# Desarrollo Local

## Prerrequisitos

| Herramienta             | Versión mínima | Uso                    |
| ----------------------- | -------------- | ---------------------- |
| Python                  | 3.11           | Backend microservicios |
| Node.js                 | 18.x           | Frontends Angular      |
| Docker + Docker Compose | 24.x           | Entorno completo local |
| Git                     | 2.x            | Control de versiones   |

---

## Opción 1: Docker Compose (Recomendada)

La forma más rápida de levantar el entorno completo sin configurar bases de datos manualmente.

```bash
# Clonar el repositorio
git clone <URL_REPO>
cd proyecto-final

# Construir y levantar todos los servicios
docker-compose up --build

# En otra terminal: cargar datos de prueba
docker exec -i proyecto-final-postgres-1 \
  psql -U travelhub_user -d travelhub < seed_catalog.sql
```

Servicios disponibles tras el `docker-compose up`:

| Servicio                 | URL local                      |
| ------------------------ | ------------------------------ |
| API Gateway (Swagger UI) | http://localhost:8000/apidocs/ |
| auth-service             | http://localhost:5000          |
| catalog-service          | http://localhost:5001          |
| reservation-service      | http://localhost:5002          |
| notification-service     | http://localhost:5004          |
| PostgreSQL               | localhost:5432                 |

---

## Opción 2: Entorno Virtual Python (sin Docker)

Útil cuando se quiere desarrollar un servicio específico con hot-reload.

### Setup inicial

```bash
# Crear entorno virtual compartido
python3 -m venv venv
source venv/bin/activate    # macOS/Linux
# venv\Scripts\activate     # Windows

# Instalar dependencias de todos los servicios
pip install -r auth-service/requirements.txt
pip install -r catalog-service/requirements.txt
pip install -r reservation-service/requirements.txt
pip install -r notification-service/requirements.txt
pip install -r client-gateway/requirements.txt
```

O usar el script automático:

```bash
bash setup_venv.sh
```

### Variables de entorno

Crea un archivo `.env` en la raíz (no incluido en el repositorio por seguridad):

```bash
# Base de datos (requiere PostgreSQL local o RDS)
DATABASE_URL=postgresql://travelhub_user:travelhub_pass@localhost:5432/travelhub

# JWT
JWT_SECRET=supersecretkey_cambiar_en_produccion

# URLs de servicios internos (desarrollo local)
AUTH_SERVICE_URL=http://localhost:5000
CATALOG_SERVICE_URL=http://localhost:5001
RESERVATION_SERVICE_URL=http://localhost:5002

# Caché
CACHE_TTL=300
```

### Arrancar servicios individualmente

```bash
# Activar venv
source venv/bin/activate

# En terminales separadas:
cd auth-service && python app.py          # Puerto 5000
cd catalog-service && python app.py       # Puerto 5001
cd reservation-service && python app.py   # Puerto 5002
cd notification-service && python app.py  # Puerto 5004
cd client-gateway && python app.py        # Puerto 8000
```

---

## Frontends Angular

### travelhub-web (viajeros)

```bash
cd travelhub-web
npm install
npm start
# Disponible en http://localhost:4200
```

### travelhub-hotel (administradores de hoteles)

```bash
cd travelhub-hotel
npm install
npm start
# Disponible en http://localhost:4201
```

!!! tip "Proxy al gateway"
Los proyectos Angular tienen configurado un proxy hacia `http://localhost:8000` para desarrollo local. No es necesario configurar CORS manualmente.

---

## Estructura del Repositorio

```
proyecto-final/
├── auth-service/          # Microservicio de autenticación
├── catalog-service/       # Microservicio de catálogo
├── reservation-service/   # Microservicio de reservas
├── notification-service/  # Microservicio de notificaciones
├── client-gateway/        # API Gateway Flask + Swagger
│   ├── app.py             # Punto de entrada (19 líneas)
│   ├── config.py          # Variables de entorno
│   ├── middleware.py       # Decorador verify_token
│   ├── swagger_config.py  # Template Swagger + definiciones
│   └── routes/            # Blueprints por dominio
│       ├── general.py     # GET / y GET /health
│       ├── auth.py        # /auth/*
│       ├── catalog.py     # /catalog/*
│       └── reservations.py # /reservations/*
├── travelhub-web/         # Frontend Angular (viajeros)
├── travelhub-hotel/       # Frontend Angular (hoteles)
├── Travelhub-android/     # App móvil Android (Kotlin)
├── docs/                  # Esta documentación (MkDocs)
├── docker-compose.yml     # Entorno de desarrollo
├── docker-compose.ci.yml  # Entorno para CI
├── seed_catalog.sql       # Datos de prueba
└── .github/workflows/     # CI/CD GitHub Actions
```

---

## Convenciones de Código

### Backend (Python/Flask)

- **Arquitectura hexagonal** en todos los servicios: `adapters/`, `domain/`, `ports/`
- Variables de entorno centralizadas en `config.py` de cada servicio
- Tests en `tests/` con pytest; configuración en `pytest.ini`
- Un Blueprint por dominio en el gateway

### Frontend (Angular)

- Internacionalización con `@ngx-translate`: archivos en `public/assets/i18n/{es,en}.json`
- Rutas protegidas con guards de Angular
- Comunicación con la API vía servicios inyectables

---

## Documentación Técnica Local

```bash
# Instalar dependencias de MkDocs
pip install -r docs-requirements.txt

# Previsualizar en tiempo real
mkdocs serve
# Disponible en http://127.0.0.1:8001

# Generar sitio estático
mkdocs build
# Output en ./site/
```
