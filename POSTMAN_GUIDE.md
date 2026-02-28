# 🚀 Guía de Pruebas con Postman

## Paso 1: Iniciar el Proyecto con Docker

```bash
# Construir e iniciar todos los servicios
docker-compose up --build
```

Espera a que veas estos mensajes:

- `postgres_1 | database system is ready to accept connections`
- `auth-service_1 | ✓ Auth tables created/verified`
- `catalog-service_1 | ✓ Catalog schema and tables created/verified`
- `client-gateway_1 | Running on all addresses (0.0.0.0)`

**Nota**: Las tablas se crean automáticamente gracias a SQLAlchemy. No necesitas ejecutar scripts SQL manualmente.

## Paso 2: Cargar Datos de Prueba

En otra terminal:

```bash
# Cargar 100 hoteles y 1000 habitaciones
docker exec -i proyecto-final-postgres-1 psql -U travelhub_user -d travelhub < seed_catalog.sql
```

Si el nombre del contenedor es diferente, búscalo con:

```bash
docker ps | grep postgres
```

## Paso 3: Probar Endpoints con Postman

### 📌 Configuración Base

Todas las peticiones van a: `http://localhost:8000` (Client Gateway)

---

### 1️⃣ Registrar Usuario

**POST** `http://localhost:8000/auth/sign-up`

**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "mipassword123",
  "rol": "cliente"
}
```

**Respuesta esperada (201):**

```json
{
  "message": "Usuario registrado exitosamente",
  "user_id": 1
}
```

---

### 2️⃣ Iniciar Sesión

**POST** `http://localhost:8000/auth/sign-in`

**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "email": "juan@example.com",
  "password": "mipassword123"
}
```

**Respuesta esperada (200):**

```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDk..."
}
```

**⚠️ IMPORTANTE: Guarda el `token` para los siguientes pasos**

---

### 3️⃣ Listar Hoteles (Público)

**GET** `http://localhost:8000/catalog/hotels`

**Sin headers adicionales** (endpoint público)

**Query Parameters (opcionales):**

- `page=1` - Número de página
- `per_page=20` - Cantidad por página
- `nombre=hotel` - Buscar por nombre
- `ciudad=Bogotá` - Filtrar por ciudad
- `pais=Colombia` - Filtrar por país
- `estrellas=5` - Filtrar por estrellas (1-5)
- `activo=true` - Solo hoteles activos

**Ejemplos:**

- Página 2: `http://localhost:8000/catalog/hotels?page=2`
- Hoteles 5 estrellas en Bogotá: `http://localhost:8000/catalog/hotels?ciudad=Bogotá&estrellas=5`
- Buscar "Marriott": `http://localhost:8000/catalog/hotels?nombre=Marriott`

**Respuesta esperada (200):**

```json
{
  "hotels": [
    {
      "id": 1,
      "nombre": "Hotel Bogotá Plaza",
      "ciudad": "Bogotá",
      "pais": "Colombia",
      "estrellas": 5,
      "activo": true,
      "image_url": "https://picsum.photos/800/600?random=1"
    },
    ...
  ],
  "total": 100,
  "page": 1,
  "per_page": 20
}
```

---

### 4️⃣ Listar Habitaciones (Público)

**GET** `http://localhost:8000/catalog/rooms`

**Sin headers adicionales**

**Respuesta esperada (200):**

```json
{
  "habitaciones": [
    {
      "id": 1,
      "hotel_id": 1,
      "capacidad": 2,
      "tipo": "Suite",
      "precio_noche": "450000.00",
      "disponible": true
    },
    ...
  ]
}
```

---

### 5️⃣ Cerrar Sesión (Protegido)

**POST** `http://localhost:8000/auth/sign-out`

**Headers:**

```
Authorization: Bearer TU_TOKEN_AQUI
```

Reemplaza `TU_TOKEN_AQUI` con el token que obtuviste en el login (paso 2).

**Respuesta esperada (200):**

```json
{
  "message": "Sesión cerrada exitosamente"
}
```

**Si el token es inválido o falta (401):**

```json
{
  "error": "Token is missing"
}
```

---

## 🧪 Tests de Validación

### ❌ Intentar registrar email duplicado

**POST** `http://localhost:8000/auth/sign-up`

Con el mismo email anterior:

```json
{
  "nombre": "Otro Usuario",
  "email": "juan@example.com",
  "password": "otrapass"
}
```

**Respuesta esperada (400):**

```json
{
  "error": "Email already registered"
}
```

---

### ❌ Login con credenciales incorrectas

**POST** `http://localhost:8000/auth/sign-in`

```json
{
  "email": "juan@example.com",
  "password": "passwordIncorrecto"
}
```

**Respuesta esperada (401):**

```json
{
  "error": "Invalid credentials"
}
```

---

### ❌ Acceder a endpoint protegido sin token

**POST** `http://localhost:8000/auth/sign-out`

**Sin header Authorization**

**Respuesta esperada (401):**

```json
{
  "error": "Token is missing"
}
```

---

## 📊 Filtros Avanzados de Hoteles

### Hoteles de 5 estrellas en Medellín

```
GET http://localhost:8000/catalog/hotels?ciudad=Medellín&estrellas=5
```

### Hoteles con "Resort" en el nombre

```
GET http://localhost:8000/catalog/hotels?nombre=Resort
```

### Segunda página de hoteles activos

```
GET http://localhost:8000/catalog/hotels?activo=true&page=2&per_page=10
```

### Todos los hoteles en Cartagena

```
GET http://localhost:8000/catalog/hotels?ciudad=Cartagena
```

---

## 🔍 Verificar que Todo Funciona

**GET** `http://localhost:8000/`

**Respuesta esperada (200):**

```json
{
  "message": "Client Gateway - OK",
  "services": {
    "auth": "http://auth-service:5000",
    "catalog": "http://catalog-service:5001"
  }
}
```

---

## 🛑 Detener los Servicios

```bash
# Detener contenedores
docker-compose down

# Detener y eliminar volúmenes (borra la BD)
docker-compose down -v
```

---

## 💡 Tips para Postman

1. **Crea una colección** llamada "TravelHub API"
2. **Define una variable de entorno** `token` para guardar el JWT automáticamente:
   - En el test del request de sign-in agrega:
     ```javascript
     pm.environment.set("token", pm.response.json().token);
     ```
3. **Usa la variable** en endpoints protegidos:
   - Authorization: `Bearer {{token}}`

4. **Crea una variable** `base_url` con valor `http://localhost:8000` para reutilizarla

---

## 🚨 Troubleshooting

### Puerto 8000 ya en uso

```bash
# Matar proceso en el puerto
lsof -ti:8000 | xargs kill -9
```

### Contenedores no inician

```bash
# Ver logs
docker-compose logs -f

# Reconstruir desde cero
docker-compose down -v
docker-compose up --build
```

### No hay datos en la BD (hoteles vacíos)

```bash
# Asegúrate de ejecutar el seed
docker exec -i proyecto-final-postgres-1 psql -U travelhub_user -d travelhub < seed_catalog.sql
```

### Los servicios no se conectan entre sí

Verifica que todas las variables de entorno en `docker-compose.yml` usan los nombres de servicio correctos (`auth-service`, `catalog-service`, `postgres`) y no `localhost`.
