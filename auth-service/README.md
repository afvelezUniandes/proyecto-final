# Auth Service

## Descripción

Microservicio de autenticación y gestión de usuarios para la plataforma TravelHub.

## Funcionalidades

### Gestión de Usuarios

- **POST /users**: Crear nuevo usuario
- **GET /users**: Listar todos los usuarios
- **GET /users/{id}**: Obtener usuario por ID
- **PUT /users/{id}**: Actualizar información del usuario
- **DELETE /users/{id}**: Eliminar usuario

### Autenticación

- **POST /auth/login**: Iniciar sesión
  - Valida credenciales (email y contraseña)
  - Genera token JWT con expiración de 1 hora
  - Incluye información del usuario en el payload

- **POST /auth/verify**: Verificar token JWT
  - Valida tokens existentes
  - Retorna información del usuario decodificada

### Tecnologías

- **Flask**: Framework web
- **SQLAlchemy**: ORM para base de datos
- **PostgreSQL**: Base de datos
- **PyJWT**: Generación y validación de tokens
- **Werkzeug**: Hash de contraseñas con bcrypt

## Base de Datos

### Esquema: `auth`

### Tabla: `usuarios`

- `id`: UUID (Primary Key)
- `nombre`: String(100)
- `email`: String(100) - Único
- `password`: String(200) - Hasheado
- `created_at`: DateTime

## Configuración

Variables de entorno requeridas:

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-secret-key
PORT=5001
```

## Ejecución

```bash
# Desarrollo local
python app.py

# Con Docker
docker build -t auth-service .
docker run -p 5001:5001 auth-service
```

## Tests

```bash
pytest tests/ -v --cov=.
```

Cobertura actual: **95%+**
