# Client Gateway

## Descripción

API Gateway que actúa como punto de entrada único para todos los servicios de TravelHub. Maneja el enrutamiento de peticiones, autenticación y comunicación entre microservicios.

## Funcionalidades

### Enrutamiento de Servicios

El gateway redirige automáticamente las peticiones a los microservicios correspondientes:

#### Auth Service (Puerto 5001)

```
/api/users/*      → auth-service/users/*
/api/auth/*       → auth-service/auth/*
```

#### Catalog Service (Puerto 5002)

```
/api/hotels/*     → catalog-service/hotels/*
/api/rooms/*      → catalog-service/rooms/*
```

### Arquitectura de Proxy

- **Reenvío inteligente**: Preserva headers, query params y body
- **Método HTTP**: Mantiene GET, POST, PUT, DELETE
- **Streaming**: Transmite respuestas en tiempo real
- **Manejo de errores**: Captura timeouts y errores de conexión

### Health Check

- **GET /health**: Verifica estado del gateway
  - Retorna estado de todos los microservicios
  - Útil para load balancers y monitoring

## Ventajas del Gateway

✅ **Single Entry Point**: Un solo endpoint para el cliente  
✅ **Service Discovery**: Conoce la ubicación de todos los servicios  
✅ **Autenticación centralizada**: Puede validar tokens antes de proxy  
✅ **Rate Limiting**: Control de tráfico (futuro)  
✅ **Logging centralizado**: Todas las peticiones pasan por un punto  
✅ **CORS**: Manejo unificado de políticas de origen cruzado

## Tecnologías

- **Flask**: Framework web
- **Requests**: Cliente HTTP para comunicación con microservicios
- **CORS**: Manejo de peticiones cross-origin

## Arquitectura

```
Cliente
   ↓
Gateway (5000)
   ├→ Auth Service (5001)
   └→ Catalog Service (5002)
```

## Configuración

Variables de entorno requeridas:

```bash
AUTH_SERVICE_URL=http://auth-service:5001
CATALOG_SERVICE_URL=http://catalog-service:5002
PORT=5000
```

## Ejemplo de Uso

```bash
# En lugar de llamar directamente a cada servicio:
# http://auth-service:5001/users
# http://catalog-service:5002/hotels

# El cliente solo llama al gateway:
curl http://gateway:5000/api/users
curl http://gateway:5000/api/hotels
```

## Ejecución

```bash
# Desarrollo local
python app.py

# Con Docker
docker build -t client-gateway .
docker run -p 5000:5000 client-gateway
```

## Tests

```bash
pytest tests/ -v --cov=.
```

Cobertura actual: **95%+**

## Endpoints Disponibles

### Autenticación

- POST `/api/auth/login` - Iniciar sesión
- POST `/api/auth/verify` - Verificar token

### Usuarios

- GET `/api/users` - Listar usuarios
- POST `/api/users` - Crear usuario
- GET `/api/users/{id}` - Obtener usuario
- PUT `/api/users/{id}` - Actualizar usuario
- DELETE `/api/users/{id}` - Eliminar usuario

### Hoteles

- GET `/api/hotels` - Listar hoteles
- POST `/api/hotels` - Crear hotel
- GET `/api/hotels/{id}` - Obtener hotel
- PUT `/api/hotels/{id}` - Actualizar hotel
- DELETE `/api/hotels/{id}` - Eliminar hotel

### Habitaciones

- GET `/api/rooms` - Listar habitaciones
- POST `/api/rooms` - Crear habitación
- GET `/api/rooms/{id}` - Obtener habitación
- PUT `/api/rooms/{id}` - Actualizar habitación
- DELETE `/api/rooms/{id}` - Eliminar habitación
