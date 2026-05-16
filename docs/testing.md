# Testing

TravelHub cuenta con una suite de pruebas automatizadas en todos los microservicios backend, utilizando **pytest** como framework principal.

---

## Resumen de la Suite

| Servicio            | Tests   | Estado         |
| ------------------- | ------- | -------------- |
| auth-service        | 21      | ✅ Todos pasan |
| catalog-service     | 45      | ✅ Todos pasan |
| reservation-service | 30      | ✅ Todos pasan |
| client-gateway      | 40      | ✅ Todos pasan |
| **Total**           | **136** | **✅ 136/136** |

---

## Tipos de Pruebas

### Pruebas Unitarias — Modelos de Dominio

Verifican que los modelos del dominio se construyan y comporten correctamente de forma aislada, sin dependencia de base de datos ni HTTP.

```python
# Ejemplo: test_models.py en auth-service
def test_usuario_creation():
    usuario = Usuario(nombre="Juan", email="juan@test.com", rol="cliente")
    assert usuario.nombre == "Juan"
    assert usuario.rol == "cliente"
```

### Pruebas de Integración — Endpoints HTTP

Verifican el comportamiento de cada endpoint usando una base de datos SQLite en memoria (sin necesidad de PostgreSQL).

```python
# Ejemplo: test_hotels.py en catalog-service
def test_get_hotels(client):
    response = client.get('/hotels')
    assert response.status_code == 200
    data = response.get_json()
    assert 'hotels' in data
    assert 'total' in data
```

### Pruebas del Gateway

El gateway usa `requests-mock` para interceptar las llamadas HTTP a los microservicios internos, permitiendo pruebas aisladas del comportamiento del proxy y la validación JWT.

```python
# Ejemplo: test_gateway.py en client-gateway
def test_sign_in(client, requests_mock):
    requests_mock.post(
        'http://fake-auth/sign-in',
        json={'token': 'fake-jwt-token'},
        status_code=200
    )
    response = client.post('/auth/sign-in',
        json={'email': 'test@test.com', 'password': 'pass'})
    assert response.status_code == 200
    assert 'token' in response.get_json()
```

---

## Ejecutar las Pruebas

### Todos los servicios

```bash
# Desde la raíz del proyecto con venv activado
source venv/bin/activate

cd auth-service        && python -m pytest tests/ -v && cd ..
cd catalog-service     && python -m pytest tests/ -v && cd ..
cd reservation-service && python -m pytest tests/ -v && cd ..
cd client-gateway      && python -m pytest tests/ -v && cd ..
```

### Con reporte de cobertura

```bash
# Ejemplo para catalog-service
cd catalog-service
python -m pytest tests/ --cov=. --cov-report=html --cov-report=term-missing
# Reporte HTML en: htmlcov/index.html
```

### Con script automatizado

```bash
bash run_tests.sh
```

---

## Configuración de Pytest

Cada servicio tiene su `pytest.ini` con la configuración del entorno de prueba:

```ini
# pytest.ini (ejemplo de catalog-service)
[pytest]
testpaths = tests
```

El archivo `tests/conftest.py` de cada servicio configura las variables de entorno y la base de datos en memoria **antes** de importar la aplicación Flask:

```python
# conftest.py
import os
os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
os.environ['JWT_SECRET'] = 'test-secret'

import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client
```

!!! warning "Orden de importación"
Las variables de entorno deben configurarse **antes** de importar `app`. De lo contrario, `config.py` leerá valores vacíos en lugar de los de prueba.

---

## Pruebas E2E (Playwright)

Los frontends Angular incluyen pruebas end-to-end con **Playwright**:

```bash
# travelhub-web
cd travelhub-web
npx playwright test

# travelhub-hotel
cd travelhub-hotel
npx playwright test
```

Configuración en `playwright.config.ts` de cada proyecto.

---

## Pruebas de Carga (JMeter)

El archivo `jmeter-load-test.jmx` contiene el plan de prueba de carga para el gateway. Resultados almacenados en `jmeter-results.csv` y `results.jtl`.

```bash
# Ejecutar con Apache JMeter instalado
jmeter -n -t jmeter-load-test.jmx -l jmeter-results.csv

# Ver reporte HTML
jmeter -g jmeter-results.csv -o report/
```

Ver el archivo `JMETER_GUIDE.md` en la raíz del repositorio para instrucciones detalladas.

---

## CI — Pruebas Automáticas

Las pruebas se ejecutan automáticamente en el pipeline de GitHub Actions antes del build Docker. Si alguna prueba falla, la imagen no se construye ni se publica a ECR.

```yaml
# Fragmento del workflow (conceptual)
- name: Run tests
  run: |
    pip install -r requirements.txt
    python -m pytest tests/ -v
```
