# Guía de Pruebas Unitarias

## Requisitos Previos

Antes de ejecutar las pruebas, asegúrate de tener un entorno virtual activado:

```bash
# Crear el entorno virtual (solo la primera vez)
python3 -m venv venv

# Activar el entorno virtual
# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

## Ejecución de Pruebas

### Auth Service

```bash
cd auth-service
pip install -r requirements.txt
pytest
```

### Catalog Service

```bash
cd catalog-service
pip install -r requirements.txt
pytest
```

### Client Gateway

```bash
cd client-gateway
pip install -r requirements.txt
pytest
```

## Cobertura de Código

Todas las pruebas están configuradas para generar reportes de cobertura:

```bash
# Ejecutar pruebas con reporte de cobertura
pytest --cov=. --cov-report=html --cov-report=term-missing

# Ver reporte en el browser
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
start htmlcov/index.html  # Windows
```

## Requisitos de Cobertura

El proyecto requiere un mínimo de **70% de cobertura** de código. Las pruebas fallarán automáticamente si la cobertura es menor.

## Estructura de Pruebas

### Auth Service

- `test_auth.py`: Pruebas de endpoints de autenticación
  - Sign up (exitoso y con errores)
  - Sign in (exitoso y con credenciales inválidas)
  - Sign out
  - Health check
- `test_models.py`: Pruebas de modelos de datos
  - Creación de Usuario
  - Creación de AdminHotel
  - Validación de nombres de tablas

### Catalog Service

- `test_hotels.py`: Pruebas de endpoints de hoteles
  - GET /hotels (con y sin datos)
  - Filtros (ciudad, país, estrellas, activo, nombre)
  - Paginación
  - GET /rooms
  - Health check
- `test_models.py`: Pruebas de modelos de datos
  - Creación de Hotel
  - Creación de Habitacion
  - Validación de schemas y tablas

### Client Gateway

- `test_gateway.py`: Pruebas de enrutamiento y validación
  - Enrutamiento a auth-service
  - Enrutamiento a catalog-service
  - Validación de JWT (token válido, inválido, expirado)
  - Manejo de servicios no disponibles
  - Health check

## Ejecutar Pruebas en Docker

Para ejecutar las pruebas dentro del contenedor Docker:

```bash
# Auth Service
docker-compose run auth-service pytest

# Catalog Service
docker-compose run catalog-service pytest

# Client Gateway
docker-compose run client-gateway pytest
```

## Ejecutar Todas las Pruebas

Desde la raíz del proyecto:

```bash
cd auth-service && pytest && cd ..
cd catalog-service && pytest && cd ..
cd client-gateway && pytest && cd ..
```

O crear un script:

```bash
#!/bin/bash
# run_all_tests.sh

echo "Running Auth Service tests..."
cd auth-service && pytest
AUTH_RESULT=$?

echo "Running Catalog Service tests..."
cd ../catalog-service && pytest
CATALOG_RESULT=$?

echo "Running Client Gateway tests..."
cd ../client-gateway && pytest
GATEWAY_RESULT=$?

cd ..

if [ $AUTH_RESULT -ne 0 ] || [ $CATALOG_RESULT -ne 0 ] || [ $GATEWAY_RESULT -ne 0 ]; then
    echo "Some tests failed!"
    exit 1
else
    echo "All tests passed!"
    exit 0
fi
```

## Configuración

Cada servicio tiene su propio `pytest.ini` con configuración de:

- Directorios de pruebas
- Patrones de archivos y funciones
- Opciones de cobertura
- Líneas excluidas del reporte

## Mocking

Las pruebas usan mocking para:

- Evitar dependencias de base de datos reales
- Simular respuestas de servicios externos
- Validar comportamiento sin efectos secundarios

## Fixtures

Cada servicio tiene fixtures en `tests/conftest.py`:

- `app`: Aplicación Flask en modo testing
- `client`: Cliente de pruebas HTTP
- `test_db`: Base de datos en memoria (SQLite)

## Buenas Prácticas

1. **Nombrar pruebas descriptivamente**: `test_sign_up_success`, `test_filter_hotels_by_city`
2. **Usar mocks para dependencias externas**: Base de datos, APIs
3. **Probar casos exitosos y de error**: Happy path y edge cases
4. **Mantener pruebas independientes**: No depender del orden de ejecución
5. **Limpiar después de cada prueba**: Cerrar sesiones, resetear mocks

## Continuous Integration

Para integrar en CI/CD:

```yaml
# .github/workflows/tests.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: "3.10"
      - run: |
          cd auth-service && pip install -r requirements.txt && pytest
          cd ../catalog-service && pip install -r requirements.txt && pytest
          cd ../client-gateway && pip install -r requirements.txt && pytest
```

## Troubleshooting

### ImportError: No module named 'app'

- Asegúrate de estar en el directorio correcto del servicio
- Verifica que `sys.path` esté configurado en `conftest.py`

### Database errors en tests

- Las pruebas usan mocking, no deberían tocar la BD real
- Verifica que los mocks estén correctamente configurados

### Cobertura menor al 70%

- Agrega más pruebas para las funciones/líneas no cubiertas
- Revisa el reporte HTML: `htmlcov/index.html`
- Usa `--cov-report=term-missing` para ver líneas específicas
