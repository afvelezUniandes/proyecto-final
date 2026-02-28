# Guía Rápida de Entorno Virtual

## ¿Por qué usar un entorno virtual?

Un entorno virtual (venv) aísla las dependencias de Python de tu proyecto, evitando conflictos con otros proyectos y manteniendo tu instalación global de Python limpia.

## Crear el entorno virtual

Desde la raíz del proyecto:

```bash
# Crear el entorno virtual
python3 -m venv venv
```

Esto creará una carpeta `venv/` con Python y pip aislados.

## Activar el entorno virtual

### macOS / Linux

```bash
source venv/bin/activate
```

### Windows

```cmd
venv\Scripts\activate
```

Cuando esté activado, verás `(venv)` al inicio de tu prompt:

```
(venv) user@machine:~/proyecto-final$
```

## Desactivar el entorno virtual

```bash
deactivate
```

## Instalar dependencias en cada microservicio

Con el entorno virtual activado:

```bash
# Auth Service
cd auth-service
pip install -r requirements.txt
cd ..

# Catalog Service
cd catalog-service
pip install -r requirements.txt
cd ..

# Client Gateway
cd client-gateway
pip install -r requirements.txt
cd ..
```

## Verificar instalación

```bash
# Verificar que pip esté usando el venv
which pip  # macOS/Linux
where pip  # Windows

# Debería mostrar algo como:
# /path/to/proyecto-final/venv/bin/pip
```

## Workflow típico

```bash
# 1. Activar venv
source venv/bin/activate

# 2. Trabajar en tu proyecto
cd auth-service
python app.py

# 3. Cuando termines, desactivar
deactivate
```

## Troubleshooting

### "python3: command not found"

Intenta con `python` en lugar de `python3`:

```bash
python -m venv venv
```

### "Permission denied"

En macOS/Linux, asegúrate de tener permisos:

```bash
chmod +x venv/bin/activate
```

### Reinstalar dependencias

Si algo sale mal, elimina el venv y créalo de nuevo:

```bash
rm -rf venv
python3 -m venv venv
source venv/bin/activate
cd auth-service && pip install -r requirements.txt && cd ..
cd catalog-service && pip install -r requirements.txt && cd ..
cd client-gateway && pip install -r requirements.txt && cd ..
```

## Script de setup automático

Puedes usar este script para configurar todo automáticamente:

```bash
#!/bin/bash
# setup_venv.sh

echo "Creating virtual environment..."
python3 -m venv venv

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing auth-service dependencies..."
cd auth-service && pip install -r requirements.txt && cd ..

echo "Installing catalog-service dependencies..."
cd catalog-service && pip install -r requirements.txt && cd ..

echo "Installing client-gateway dependencies..."
cd client-gateway && pip install -r requirements.txt && cd ..

echo "✓ Setup complete!"
echo "To activate the virtual environment, run:"
echo "source venv/bin/activate"
```

Hazlo ejecutable y córrelo:

```bash
chmod +x setup_venv.sh
./setup_venv.sh
```

## Notas importantes

- El entorno virtual está excluido del control de versiones (`.gitignore`)
- Cada desarrollador debe crear su propio venv
- Siempre activa el venv antes de instalar paquetes o correr código
- En Docker no se necesita venv (el contenedor ya está aislado)
