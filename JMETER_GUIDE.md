# Guía de Pruebas de Carga con JMeter

## Plan de Pruebas - TravelHub

Archivo: `jmeter-load-test.jmx`

### Configuración del Experimento

**Endpoint bajo prueba**: `GET http://proyecto-final-alb-274129795.us-east-1.elb.amazonaws.com/catalog/hotels`

**Niveles de carga** (secuenciales):

1. **Nivel 1**: 25 usuarios concurrentes × 5 minutos
2. **Nivel 2**: 50 usuarios concurrentes × 5 minutos
3. **Nivel 3**: 100 usuarios concurrentes × 5 minutos

**Total**: ~15 minutos de prueba

**Ramp-up**: 60 segundos por nivel (usuarios se agregan gradualmente)

---

## Instalación de JMeter

### macOS (Homebrew):

```bash
brew install jmeter
```

### Manual:

1. Descarga desde: https://jmeter.apache.org/download_jmeter.cgi
2. Extrae el archivo
3. Ejecuta: `bin/jmeter` (GUI) o `bin/jmeter.sh` (línea de comandos)

---

## Ejecución

### Opción 1: Interfaz Gráfica (GUI)

```bash
jmeter -t jmeter-load-test.jmx
```

1. Se abrirá JMeter con el plan de pruebas cargado
2. **Revisa la configuración**:
   - Variables → `BASE_URL` debe tener tu ALB DNS
   - Thread Groups → 3 niveles configurados
3. **Ejecuta**: Botón verde "Start" (▶️)
4. **Monitorea** en tiempo real:
   - Summary Report (tabla resumen)
   - Aggregate Report (estadísticas detalladas)
5. **Al terminar**: File → Save Test Plan

**⚠️ IMPORTANTE**: La GUI consume muchos recursos. Para pruebas reales, usa modo CLI.

### Opción 2: Línea de Comandos (CLI) - RECOMENDADO

```bash
jmeter -n -t jmeter-load-test.jmx -l results.jtl -e -o report/
```

Parámetros:

- `-n`: Modo no-GUI (mejor rendimiento)
- `-t`: Archivo del test plan
- `-l`: Archivo de resultados (CSV/JTL)
- `-e`: Generar reporte HTML al finalizar
- `-o`: Carpeta para el reporte HTML

**Durante la ejecución**:

- Verás logs en tiempo real de cada nivel
- La prueba toma ~15 minutos total

**Al finalizar**:

- Abre `report/index.html` en tu navegador
- Contiene gráficas de latencia, throughput, percentiles, etc.

---

## Métricas a Analizar

### 📊 En el Reporte HTML (`report/index.html`):

1. **Dashboard Summary**:
   - Total Samples (requests totales)
   - Error % (debe ser < 2%)
   - Throughput (req/s)

2. **Response Times Over Time**:
   - Gráfica de latencia por tiempo
   - Busca degradación en niveles 50 y 100 usuarios

3. **⭐ Response Time Percentiles** (MÁS IMPORTANTE):
   - **95th percentile (p95)** ← Este debe ser ≤ 900ms
   - 50th percentile (mediana)
   - 90th percentile
   - 99th percentile
   - Esta tabla te muestra exactamente si cumples el criterio

4. **Transactions Per Second**:
   - Throughput constante indica estabilidad

### 📈 En la GUI de JMeter:

Si abres el `.jmx` en JMeter GUI, verás 3 listeners:

1. **Summary Report**: Resumen general (no tiene percentiles)
2. **Aggregate Report**: Estadísticas agregadas (no tiene percentiles)
3. **Response Time Percentiles**: ⭐ AQUÍ ESTÁ EL P95
   - Gráfica que muestra percentiles en tiempo real
   - Al finalizar, click en la tabla para ver valores numéricos exactos

### En CloudWatch (mientras corre la prueba):

```
CloudWatch → Metrics → ECS → ClusterName, ServiceName
```

Métricas clave:

- **CPUUtilization**: Debe estar < 70% (criterio de aceptación)
- **MemoryUtilization**: Monitorear para ver si es suficiente

---

## 🎯 Cómo Interpretar el P95

**P95 (Percentil 95)** = El 95% de las solicitudes tuvieron un tiempo de respuesta igual o menor a este valor.

### Ejemplo:

Si el p95 = 850ms, significa:

- ✅ 95% de requests respondieron en ≤ 850ms
- ⚠️ 5% de requests tomaron > 850ms

### Tu Criterio de Aceptación:

**P95 ≤ 900ms con 100 usuarios concurrentes**

### Cómo validarlo:

1. **En el reporte HTML** (MÁS FÁCIL):
   - Ve a `report/index.html` → busca la tabla "Response Time Percentiles"
   - Busca la fila correspondiente al periodo de 100 usuarios
   - Mira la columna **95th pct**
   - Si dice ≤ 900 → ✅ Criterio cumplido

2. **En la GUI de JMeter**:
   - Click en "Response Time Percentiles" en el árbol lateral izquierdo
   - Busca la línea del p95 en la gráfica
   - Los valores exactos aparecen al pasar el mouse sobre los puntos

3. **Desde línea de comandos** (para cálculo manual):

```bash
# Calcular p95 desde results.jtl
awk -F',' 'NR>1 {print $2}' results.jtl | sort -n | awk '{all[NR]=$1} END{print "P95: " all[int(NR*0.95)] " ms"}'
```

---

## Interpretación de Resultados

### ✅ Hipótesis Aceptada si:

- ≥ 95% de solicitudes en ≤ 900ms con 100 concurrentes
- Error rate < 2%
- CPU promedio < 70% sin saturación sostenida

### ⚠️ Si falla por latencia alta pero error bajo:

- Revisar consultas SQL / índices RDS
- Verificar pool de conexiones
- Considerar aumentar CPU del task

### ❌ Si error rate crece y hay timeouts:

- Revisar timeouts en Flask/Gunicorn
- Verificar límites de conexión de RDS
- Revisar dimensionamiento ECS/RDS
- Considerar rate limiting

### 🔍 Si CloudWatch muestra RDS saturado:

- Optimizar consultas (query plan)
- Agregar índices a tablas
- Aumentar capacidad de RDS (último recurso)

---

## Exportar Datos para Análisis

### CSV con datos raw:

El archivo `results.jtl` contiene todos los datos:

```csv
timeStamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,URL,Latency,IdleTime,Connect
```

Puedes importarlo a Excel/Google Sheets para análisis adicional.

### Percentil 95 desde CLI:

```bash
# Calcular p95 de latencia desde results.jtl
awk -F',' 'NR>1 {print $2}' results.jtl | sort -n | awk '{all[NR]=$1} END{print all[int(NR*0.95)]}'
```

---

## Tips Adicionales

### Monitorear durante la prueba:

```bash
# En otra terminal, monitorear requests por segundo
watch -n 5 'curl -s http://proyecto-final-alb-274129795.us-east-1.elb.amazonaws.com/health'
```

### Verificar que el ALB está recibiendo tráfico:

```
AWS Console → EC2 → Load Balancers → proyecto-final-alb → Monitoring
```

Verás gráficas de:

- Request Count
- Target Response Time
- HTTP 2xx, 4xx, 5xx counts

### Si necesitas ajustar la duración:

Abre `jmeter-load-test.jmx` en JMeter GUI:

- Click en "Nivel 1 - 25 Usuarios"
- Cambiar "Duration (seconds)": 300 → tu valor deseado
- Repetir para Nivel 2 y 3
- Save

---

## Estructura del Plan de Pruebas

```
jmeter-load-test.jmx
├── Variables: BASE_URL
├── Nivel 1 - 25 Usuarios (5 min)
│   └── GET /catalog/hotels
│       └── Assert 200 OK
├── Nivel 2 - 50 Usuarios (5 min)
│   └── GET /catalog/hotels
│       └── Assert 200 OK
├── Nivel 3 - 100 Usuarios (5 min)
│   └── GET /catalog/hotels
│       └── Assert 200 OK
└── Listeners
    ├── Summary Report → jmeter-results.csv
    └── Aggregate Report (en pantalla)
```

---

## Troubleshooting

### "Connection refused" o timeout:

- Verifica que el ALB está activo
- Verifica que el servicio ECS está corriendo
- Prueba el endpoint manualmente: `curl http://...`

### JMeter se congela:

- Cierra la GUI y usa modo CLI
- Reduce las iteraciones para pruebas iniciales

### Resultados inconsistentes:

- Asegúrate de que no hay otras pruebas corriendo
- Espera 5 minutos entre ejecuciones para que ECS/RDS se estabilicen

---

¡Listo para ejecutar! 🚀
