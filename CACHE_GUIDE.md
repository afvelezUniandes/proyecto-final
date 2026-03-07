# 🚀 Guía de Caché con Flask-Caching

## 📋 Descripción

Se ha implementado **Flask-Caching (SimpleCache)** como sistema de caché in-memory para optimizar las consultas GET frecuentes en el `catalog-service`, reduciendo significativamente la latencia y la carga en la base de datos PostgreSQL.

## 🎯 Beneficios

### Mejoras de Rendimiento Esperadas

| Métrica        | Sin Caché     | Con Caché | Mejora      |
| -------------- | ------------- | --------- | ----------- |
| **Latencia**   | 50-200ms      | 2-10ms    | **~90-95%** |
| **Throughput** | Limited by DB | High      | **5-10x**   |
| **Carga DB**   | 100%          | ~10%      | **-90%**    |

### Endpoints Cacheados

1. **GET /catalog/hotels** - Caché por combinación de filtros (ciudad, país, estrellas, paginación, etc.)
2. **GET /catalog/rooms** - Caché global de todas las habitaciones

## 🔧 Configuración

### Variables de Entorno

```bash
# En docker-compose.yml, ECS task definition o .env
CACHE_TTL=300  # Tiempo de vida del cache en segundos (5 minutos por defecto)
```

### TTL (Time To Live) Recomendados

- **Catálogos estáticos**: 600-3600 segundos (10-60 minutos)
- **Datos semi-estáticos**: 300-600 segundos (5-10 minutos)
- **Datos dinámicos**: 60-300 segundos (1-5 minutos)

## 💡 Sobre SimpleCache

**Características:**

- ✅ Sin dependencias externas (no requiere Redis, Memcached, etc.)
- ✅ Configuración cero - funciona out-of-the-box
- ✅ Perfecto para desarrollo, testing y deployments single-instance
- ✅ Compatible con ECS Fargate sin servicios adicionales
- ⚠️ Caché local (cada instancia tiene su propio caché en memoria)
- ⚠️ Se pierde al reiniciar el contenedor/servicio

**Ideal para:**

- Proyectos académicos y demos
- Pruebas de concepto
- Aplicaciones con una sola instancia
- Cuando no quieres gestionar servicios adicionales

## 🏃 Uso

### 1. Iniciar los servicios

```bash
# Local con Docker
docker-compose up -d

# Ver logs del catalog-service
docker-compose logs -f catalog-service
```

### 2. Verificar que el caché funciona

```bash
# Primera llamada - X-Cache: MISS (consulta DB)
curl -i http://localhost:8000/catalog/hotels

# Segunda llamada inmediata - X-Cache: HIT (desde cache, súper rápido!)
curl -i http://localhost:8000/catalog/hotels
```

**Busca el header `X-Cache` en la respuesta:**

- `X-Cache: MISS` = Consultó la base de datos
- `X-Cache: HIT` = Respuesta desde caché (2-10ms)

### 3. Gestión del Caché

#### Limpiar todo el caché manualmente

```bash
curl -X POST http://localhost:5001/cache/clear
```

#### Ver estadísticas del caché

```bash
curl http://localhost:5001/cache/stats
```

Respuesta esperada:

```json
{
  "cache_type": "SimpleCache",
  "default_ttl": 300,
  "info": "In-memory cache (per instance)"
}
```

## 🧪 Probar el Rendimiento

### Con JMeter

```bash
# Ejecutar tus pruebas de carga existentes
jmeter -n -t jmeter-load-test.jmx -l results-with-cache.jtl

# Verás mejoras significativas en:
# - Average Response Time (-90%)
# - 90th/95th/99th Percentile (-85-95%)
# - Throughput (+5-10x requests/second)
```

### Benchmark Manual con Apache Bench

```bash
# 1000 requests, 50 concurrentes
ab -n 1000 -c 50 http://localhost:8000/catalog/hotels

# Ejecutar dos veces:
# 1ra vez: cache frío (latencias altas)
# 2da vez: cache caliente (latencias bajas)
```

### Comparación Simple

```bash
# Medir latencia sin caché (reinicia el servicio primero)
docker-compose restart catalog-service
time curl http://localhost:8000/catalog/hotels

# Medir latencia con caché (segunda llamada)
time curl http://localhost:8000/catalog/hotels

# Diferencia esperada: 10-50x más rápido
```

## 📐 Arquitectura del Caché

### Cache Keys Generadas

#### Para /hotels (con filtros)

```
catalog:hotels:nombre:Madrid:ciudad::pais:España:estrellas:5:activo:true:page:1:per_page:20
```

#### Para /rooms

```
catalog:rooms:all
```

### Flujo de una Request

```
1. Cliente → Gateway → Catalog Service
2. Check SimpleCache (memoria)
   ├─ HIT → Return cached data (2-10ms) ✅
   └─ MISS → Query PostgreSQL (50-200ms)
              → Store in cache
              → Return data
3. Siguientes requests → Cache HIT (súper rápido!)
```

## 🔄 Invalidación de Caché

### Automática (TTL)

El caché se auto-limpia después del tiempo configurado en `CACHE_TTL` (300 segundos por defecto).

### Manual

```bash
# Limpiar todo el caché
curl -X POST http://localhost:5001/cache/clear
```

### Por Evento (para implementar en el futuro)

Si implementas endpoints POST/PUT/DELETE para modificar datos:

```python
@bp.route('/hotels', methods=['POST'])
def create_hotel():
    # ... crear hotel ...

    # Invalidar caché relacionado
    current_app.cache.clear()

    return jsonify(new_hotel), 201
```

## 🧪 Testing

Los tests unitarios usan `SimpleCache` automáticamente:

```bash
cd catalog-service
pytest -v
```

## 📊 Resultados Esperados en Producción (ECS)

### Antes del Caché

```
Average Response Time: 156ms
95th Percentile: 245ms
Throughput: 160 req/sec
Error Rate: 0%
```

### Después del Caché (Esperado)

```
Average Response Time: 12ms (-92%) 🚀
95th Percentile: 25ms (-90%) 🚀
Throughput: 1000+ req/sec (+500%) 🚀
Error Rate: 0%
```

## ⚙️ Configuración Avanzada

### Ajustar TTL por Endpoint

Edita `catalog-service/adapters/http/hotels.py`:

```python
# TTL específico para hotels (10 minutos)
cache.set(cache_key, response_data, timeout=600)

# TTL específico para rooms (30 minutos)
cache.set(cache_key, result, timeout=1800)
```

### Ajustar TTL globalmente

En tu task definition de ECS o docker-compose:

```yaml
environment:
  - CACHE_TTL: 600 # 10 minutos
```

## 🐛 Troubleshooting

### El caché no funciona

```bash
# 1. Verificar que flask-caching está instalado
docker-compose exec catalog-service pip list | grep -i caching

# 2. Ver logs
docker-compose logs catalog-service

# 3. Verificar headers X-Cache
curl -i http://localhost:8000/catalog/hotels | grep X-Cache
```

### Datos desactualizados en caché

```bash
# Limpiar el caché manualmente
curl -X POST http://localhost:5001/cache/clear

# O reducir el TTL (en docker-compose.yml)
environment:
  - CACHE_TTL: 60  # 1 minuto
```

### En ECS: Diferentes instancias devuelven datos distintos

Esto es normal con SimpleCache - cada instancia tiene su propio caché. Opciones:

1. Reducir TTL para que se sincronicen más rápido
2. Implementar un endpoint para invalidar caché y llamarlo después de cambios
3. En el futuro, migrar a ElastiCache Redis (caché compartido)

## 📈 Métricas para Medir

Al ejecutar tus pruebas de carga con JMeter, compara:

1. **Latencia promedio** (debe bajar ~90%)
2. **Percentil 95/99** (debe mejorar significativamente)
3. **Throughput** (req/sec debe aumentar ~5-10x)
4. **Errores** (debe mantenerse en 0%)
5. **Uso de CPU del catalog-service** (debe bajar)
6. **Conexiones activas a PostgreSQL** (debe reducirse dramáticamente)

## 🎓 Próximos Pasos

1. ✅ **Ejecutar pruebas de carga** con JMeter y comparar resultados
2. ✅ **Monitorear headers X-Cache** para ver hit rate
3. ⚡ **Ajustar TTL** según tus necesidades
4. 📊 **Documentar mejoras** en tu informe con gráficas
5. 🚀 **Considerar ElastiCache Redis** si escalar a múltiples instancias

## 🔮 Upgrade Path: SimpleCache → Redis

Si en el futuro necesitas caché compartido:

1. Agregar ElastiCache Redis en AWS
2. Actualizar `config.py`: cambiar `CACHE_TYPE` a `'RedisCache'`
3. Agregar variable `REDIS_URL` al task definition
4. Instalar dependencia `redis` en requirements.txt

Todo el código de endpoints ya está preparado para soportar ambos tipos de caché.

## 📚 Referencias

- [Flask-Caching Documentation](https://flask-caching.readthedocs.io/)
- [Caching Best Practices](https://aws.amazon.com/caching/best-practices/)

---

**El caché está completamente implementado y listo para usar! 🎉**
