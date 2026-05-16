# APIs

Toda la comunicación pasa por el **client-gateway** en el puerto `8000`. Los microservicios internos no son accesibles directamente desde los clientes.

## Documentación Interactiva

La documentación interactiva (Swagger UI) está disponible en:

- **Local**: [http://localhost:8000/apidocs/](http://localhost:8000/apidocs/)
- **Producción**: [http://proyecto-final-alb-1238672503.us-east-1.elb.amazonaws.com/apidocs/](http://proyecto-final-alb-1238672503.us-east-1.elb.amazonaws.com/apidocs/)

Desde Swagger UI puedes explorar todos los endpoints, ver los esquemas de request/response y ejecutar llamadas en vivo usando el botón **"Try it out"**.

---

## Autenticación

Los endpoints protegidos requieren un **JWT Bearer token** en el header `Authorization`:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Para obtener el token:

1. Registrarse: `POST /auth/sign-up`
2. Iniciar sesión: `POST /auth/sign-in` → devuelve `{ "token": "..." }`
3. Incluir el token en todas las peticiones protegidas

---

## Resumen de Endpoints

### General

| Método | Ruta      | Auth | Descripción                                 |
| ------ | --------- | ---- | ------------------------------------------- |
| `GET`  | `/`       | No   | Estado del gateway y URLs de servicios      |
| `GET`  | `/health` | No   | Health check de todos los servicios backend |

### Autenticación (`/auth`)

| Método | Ruta             | Auth | Descripción                            |
| ------ | ---------------- | ---- | -------------------------------------- |
| `POST` | `/auth/sign-up`  | No   | Registrar nuevo usuario                |
| `POST` | `/auth/sign-in`  | No   | Iniciar sesión, obtener JWT            |
| `POST` | `/auth/sign-out` | ✅   | Cerrar sesión                          |
| `GET`  | `/auth/profile`  | ✅   | Obtener perfil del usuario autenticado |
| `PUT`  | `/auth/profile`  | ✅   | Actualizar perfil                      |

### Catálogo (`/catalog`)

| Método   | Ruta                          | Auth | Descripción                             |
| -------- | ----------------------------- | ---- | --------------------------------------- |
| `GET`    | `/catalog/cities`             | No   | Listar ciudades disponibles             |
| `GET`    | `/catalog/hotels`             | No   | Listar hoteles con filtros y paginación |
| `GET`    | `/catalog/hotels/mine`        | ✅   | Hotel del administrador autenticado     |
| `GET`    | `/catalog/hotels/{id}`        | No   | Detalle de un hotel                     |
| `POST`   | `/catalog/hotels`             | ✅   | Crear hotel (rol: hotel)                |
| `PUT`    | `/catalog/hotels/{id}`        | ✅   | Actualizar hotel                        |
| `POST`   | `/catalog/hotels/{id}/image`  | ✅   | Subir imagen del hotel                  |
| `GET`    | `/catalog/rooms`              | No   | Listar habitaciones (filtro por hotel)  |
| `POST`   | `/catalog/rooms`              | ✅   | Crear habitación                        |
| `PUT`    | `/catalog/rooms/{id}`         | ✅   | Actualizar habitación                   |
| `DELETE` | `/catalog/rooms/{id}`         | ✅   | Eliminar habitación (soft delete)       |
| `PATCH`  | `/catalog/rooms/{id}/restore` | ✅   | Restaurar habitación eliminada          |

### Reservas (`/reservations`)

| Método  | Ruta                                                 | Auth | Descripción                                        |
| ------- | ---------------------------------------------------- | ---- | -------------------------------------------------- |
| `GET`   | `/reservations/occupied-rooms`                       | No   | IDs de habitaciones ocupadas en un rango de fechas |
| `GET`   | `/reservations`                                      | ✅   | Reservas del usuario autenticado                   |
| `GET`   | `/reservations/{id}`                                 | ✅   | Detalle de una reserva                             |
| `POST`  | `/reservations`                                      | ✅   | Crear reserva                                      |
| `PATCH` | `/reservations/{id}/cancel`                          | ✅   | Cancelar reserva (cliente)                         |
| `GET`   | `/reservations/hotel/{id}`                           | ✅   | Reservas de un hotel (con datos de huésped)        |
| `GET`   | `/reservations/hotel/{id}/stats`                     | ✅   | KPIs del hotel                                     |
| `GET`   | `/reservations/hotel/{id}/reservations/{rid}`        | ✅   | Detalle de reserva (vista hotel)                   |
| `PATCH` | `/reservations/hotel/{id}/reservations/{rid}/cancel` | ✅   | Cancelar reserva (hotel)                           |

---

## Ejemplos de Uso

### Registro e inicio de sesión

=== "Registro"

    ```bash
    curl -X POST http://localhost:8000/auth/sign-up \
      -H "Content-Type: application/json" \
      -d '{
        "nombre": "Juan Pérez",
        "email": "juan@correo.com",
        "password": "mi_password_seguro",
        "rol": "cliente",
        "telefono": "+573001234567",
        "pais": "Colombia",
        "idioma_preferido": "es"
      }'
    ```

=== "Login"

    ```bash
    curl -X POST http://localhost:8000/auth/sign-in \
      -H "Content-Type: application/json" \
      -d '{"email": "juan@correo.com", "password": "mi_password_seguro"}'

    # Respuesta:
    # { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
    ```

### Consultar hoteles disponibles

```bash
# Hoteles en Bogotá, máx. 3 estrellas, página 1
curl "http://localhost:8000/catalog/hotels?ciudad=Bogotá&estrellas=3&page=1&per_page=10"
```

Respuesta:

```json
{
  "total": 25,
  "page": 1,
  "per_page": 10,
  "hotels": [
    {
      "id": 1,
      "nombre": "Hotel Santamaría",
      "ciudad": "Bogotá",
      "pais": "Colombia",
      "estrellas": 3,
      "precio_noche": 120000,
      "precio_noche_max": 250000,
      "image_url": "https://...",
      "activo": true
    }
  ]
}
```

### Verificar disponibilidad y reservar

=== "1. Verificar disponibilidad"

    ```bash
    curl "http://localhost:8000/reservations/occupied-rooms\
    ?fecha_checkin=2026-06-01&fecha_checkout=2026-06-05"

    # Respuesta: [3, 7, 12]  ← IDs de habitaciones ocupadas
    ```

=== "2. Crear reserva"

    ```bash
    TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

    curl -X POST http://localhost:8000/reservations \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "habitacion_id": 5,
        "fecha_checkin": "2026-06-01",
        "fecha_checkout": "2026-06-05",
        "num_huespedes": 2
      }'
    ```

---

## Modelos de Respuesta

Los modelos están definidos en la documentación Swagger (`/apidocs/` → sección **Models**). Los principales son:

| Modelo               | Descripción                                                 |
| -------------------- | ----------------------------------------------------------- |
| `Usuario`            | Perfil de usuario con id, nombre, email, rol, país, idioma  |
| `TokenResponse`      | `{ "token": "JWT..." }`                                     |
| `Hotel`              | Datos completos del hotel incluyendo precio mínimo/máximo   |
| `HotelesResponse`    | Paginación: `{ total, page, per_page, hotels: [Hotel] }`    |
| `Habitacion`         | Habitación con tipo, capacidad, precio, disponibilidad      |
| `Reserva`            | Reserva con fechas, estado, código, monto total             |
| `ReservaEnriquecida` | Reserva + datos del huésped y habitación                    |
| `HotelStats`         | KPIs: reservas activas, tasa de ocupación, ingresos del mes |
| `Error`              | `{ "error": "mensaje de error" }`                           |

---

## Códigos de Estado HTTP

| Código                    | Significado en TravelHub           |
| ------------------------- | ---------------------------------- |
| `200 OK`                  | Petición exitosa                   |
| `201 Created`             | Recurso creado (registro, reserva) |
| `400 Bad Request`         | Datos inválidos o faltantes        |
| `401 Unauthorized`        | Token ausente, inválido o expirado |
| `404 Not Found`           | Recurso no encontrado              |
| `409 Conflict`            | Email ya registrado                |
| `503 Service Unavailable` | Microservicio interno no responde  |
