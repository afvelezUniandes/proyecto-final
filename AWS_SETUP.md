# 🔐 Configuración AWS para GitHub Actions

Esta guía te ayudará a configurar AWS IAM y GitHub Actions para automatizar el deploy a ECR.

## Paso 1: Crear Usuario IAM

### 1.1 Acceder a IAM Console

1. Inicia sesión en AWS Console
2. Ve a **IAM** → **Users** → **Create user**

### 1.2 Configurar Usuario

**Nombre del usuario**: `github-actions-travelhub`

**Tipo de acceso**:

- ❌ AWS Management Console access (no necesario)
- ✅ Programmatic access (para API/CLI)

### 1.3 Permisos Necesarios

Crea una política personalizada con estos permisos mínimos:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAuth",
      "Effect": "Allow",
      "Action": ["ecr:GetAuthorizationToken"],
      "Resource": "*"
    },
    {
      "Sid": "ECRPushPull",
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": [
        "arn:aws:ecr:us-east-1:108633434648:repository/proyecto-final"
      ]
    },
    {
      "Sid": "ECSTaskExecution",
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeTaskDefinition",
        "ecs:RegisterTaskDefinition"
      ],
      "Resource": "*"
    }
  ]
}
```

**Nombre de la política**: `GitHubActionsECRPolicy`

### 1.4 Guardar Credenciales

Después de crear el usuario, **GUARDA INMEDIATAMENTE**:

- ✅ Access Key ID
- ✅ Secret Access Key

⚠️ **No podrás ver el Secret Access Key de nuevo**

---

## Paso 2: Crear Repositorios ECR

### 2.1 Desde AWS Console

1. Ve a **ECR** → **Repositories** → **Create repository**
2. Nombre del repositorio: `proyecto-final`

**Configuración recomendada**:

- Visibility: Private
- Tag immutability: Disabled (para desarrollo)
- Scan on push: Enabled
- Encryption: AES-256

**Nota**: Usaremos un solo repositorio con diferentes tags para cada servicio:

- `auth-latest` para auth-service
- `catalog-latest` para catalog-service
- `gateway-latest` para client-gateway

### 2.2 Desde AWS CLI

```bash
# Instalar AWS CLI si no lo tienes
# brew install awscli  # macOS
# O descarga desde: https://aws.amazon.com/cli/

# Configurar credenciales
aws configure

# Crear repositorio único
aws ecr create-repository \
  --repository-name proyecto-final \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true

# Verificar que se creó correctamente
aws ecr describe-repositories \
  --repository-names proyecto-final \
  --region us-east-1
```

---

## Paso 3: Configurar Secrets en GitHub

### 3.1 Acceder a GitHub Repository Settings

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click en **New repository secret**

### 3.2 Agregar Secrets

Crea estos 2 secrets:

| Secret Name             | Value                | Ejemplo                                    |
| ----------------------- | -------------------- | ------------------------------------------ |
| `AWS_ACCESS_KEY_ID`     | Tu Access Key ID     | `AKIAIOSFODNN7EXAMPLE`                     |
| `AWS_SECRET_ACCESS_KEY` | Tu Secret Access Key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |

**Nota**: El Account ID ya está configurado directamente en el workflow (108633434648), no necesitas agregarlo como secret.

---

## Paso 4: Probar el Workflow

### 4.1 Hacer Push al Repositorio

```bash
# Agregar el workflow al repositorio
git add .github/workflows/deploy-ecr.yml
git commit -m "Add GitHub Actions workflow for ECR deployment"
git push origin main
```

### 4.2 Verificar Ejecución

1. Ve a tu repositorio en GitHub
2. **Actions** tab
3. Deberías ver el workflow "Build and Push to ECR" ejecutándose

### 4.3 Ejecutar Manualmente (opcional)

1. En **Actions** → **Build and Push to ECR**
2. Click en "Run workflow"
3. Select branch → **Run workflow**

---

## Paso 5: Verificar Imágenes en ECR

### Desde AWS Console

1. Ve a **ECR** → **Repositories**
2. Click en el repositorio `proyecto-final`
3. Deberías ver las imágenes con estos tags:
   - `auth-latest`
   - `catalog-latest`
   - `gateway-latest`

### Desde AWS CLI

```bash
# Listar todas las imágenes del repositorio
aws ecr list-images \
  --repository-name proyecto-final \
  --region us-east-1

# Ver detalles de una imagen específica
aws ecr describe-images \
  --repository-name proyecto-final \
  --image-ids imageTag=auth-latest \
  --region us-east-1
```

---

## 🔍 Troubleshooting

### Error: "no basic auth credentials"

**Causa**: Credenciales de AWS inválidas o expiradas

**Solución**:

1. Verifica que los secrets en GitHub sean correctos
2. Verifica que el usuario IAM tenga `ecr:GetAuthorizationToken`

### Error: "repository does not exist"

**Causa**: Los repositorios ECR no fueron creados

**Solución**:

```bash
aws ecr create-repository --repository-name proyecto-final --region us-east-1
```

### Error: "Access Denied"

**Causa**: Permisos IAM insuficientes

**Solución**:

1. Verifica la política IAM del usuario
2. Asegúrate de que incluye `ecr:PutImage`, `ecr:InitiateLayerUpload`, etc.

### Workflow falla en "Build and push"

**Solución**:

1. Verifica los logs en GitHub Actions
2. Asegúrate de que los Dockerfiles son correctos
3. Verifica que las rutas en el workflow sean correctas

---

## 📊 Costos Estimados

**ECR Storage**:

- Primeros 500 MB/mes: GRATIS
- Después: $0.10 por GB/mes
- **Estimado para este proyecto**: <$1/mes

**ECR Data Transfer**:

- De ECR a ECS (mismo region): GRATIS
- De ECR a Internet: $0.09 per GB

---

## 🎯 Próximos Pasos

Después de configurar ECR y GitHub Actions:

1. ✅ Las imágenes se suben automáticamente con cada push
2. ⬜ Configurar ECS Cluster y Task Definitions
3. ⬜ Crear ECS Services
4. ⬜ Configurar Application Load Balancer
5. ⬜ Montar RDS PostgreSQL
6. ⬜ Automatizar deploy a ECS (opcional)

---

## 🔒 Mejores Prácticas de Seguridad

### 1. Rotar Credenciales Regularmente

```bash
# Crear nuevas credenciales cada 90 días
aws iam create-access-key --user-name github-actions-travelhub
```

### 2. Usar Política de Menor Privilegio

Solo otorga los permisos mínimos necesarios (la política arriba ya sigue este principio)

### 3. Habilitar MFA Delete en ECR

```bash
aws ecr put-lifecycle-policy \
  --repository-name proyecto-final \
  --lifecycle-policy-text file://ecr-lifecycle-policy.json
```

### 4. Monitorear Accesos

Configura CloudWatch Alarms para detectar uso inusual de las credenciales

### 5. No Compartir Credenciales

Nunca subas las credenciales al repositorio o las compartas por Slack/Email

---

## 📝 Comandos Útiles

### Ver logs del workflow localmente

```bash
# Instalar GitHub CLI
brew install gh

# Ver logs
gh run list
gh run view <run-id> --log
```

### Limpiar imágenes antiguas en ECR

```bash
# Listar todas las imágenes
aws ecr list-images --repository-name proyecto-final

# Eliminar imagen específica (por tag)
aws ecr batch-delete-image \
  --repository-name proyecto-final \
  --image-ids imageTag=auth-old-version

# Eliminar múltiples imágenes
aws ecr batch-delete-image \
  --repository-name proyecto-final \
  --image-ids imageTag=auth-latest imageTag=catalog-latest
```

### Obtener URI completo de la imagen

```bash
aws ecr describe-repositories \
  --repository-names proyecto-final \
  --query 'repositories[0].repositoryUri' \
  --output text

# Output: 108633434648.dkr.ecr.us-east-1.amazonaws.com/proyecto-final
```

---

## ✅ Checklist de Verificación

- [ ] Usuario IAM creado con política correcta
- [ ] Access Key y Secret guardados de forma segura
- [ ] Repositorio ECR `proyecto-final` creado
- [ ] 2 secrets configurados en GitHub (AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY)
- [ ] Workflow file agregado al repositorio
- [ ] Push realizado y workflow ejecutado exitosamente
- [ ] Imágenes visibles en ECR con tags: auth-latest, catalog-latest, gateway-latest
- [ ] URI correcto: 108633434648.dkr.ecr.us-east-1.amazonaws.com/proyecto-final

---

## 🎓 Recursos Adicionales

- [AWS ECR Documentation](https://docs.aws.amazon.com/ecr/)
- [GitHub Actions with AWS](https://github.com/aws-actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
