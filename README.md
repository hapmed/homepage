# HAPMED Web

Sitio corporativo de HAPMED: página estática (HTML5 + CSS3 + JavaScript nativo) servida
con Nginx dentro de un contenedor Docker y orquestada con Docker Compose.

- Sin backend, sin base de datos, sin Node.js en la imagen final.
- La imagen final solo contiene Nginx y los archivos estáticos.

## Requisitos

- Docker Engine 24+ con Docker Compose v2 (comando `docker compose`).
- Acceso de lectura a la imagen base `nginxinc/nginx-unprivileged:1.31.6-alpine`.
- Para publicar la imagen: acceso a GHCR con un token con permiso `write:packages`.

## Estructura

```
Dockerfile            Imagen de producción (Nginx sin privilegios)
compose.yaml          Orquestación (build, puerto, healthcheck, seguridad)
docker/nginx.conf     Configuración del servidor (seguridad, caché, healthz, 404)
site/                 Contenido estático que se sirve
```

## Construcción

```bash
docker compose build
```

Construcción reproducible y sin credenciales dentro de la imagen. No se usa compilación
multietapa porque no aporta beneficio: el artefacto es contenido estático tal cual.

## Inicio y detención

```bash
docker compose up -d --build      # construir (si hace falta) y arrancar
docker compose ps                 # estado
docker compose stop               # detener
docker compose down               # detener y eliminar el contenedor
```

El sitio queda publicado en `127.0.0.1:8080` (solo local). En producción, el acceso público
se realiza a través de Cloudflare Tunnel, no exponiendo el puerto a Internet.

El puerto se puede cambiar con la variable de entorno `HAPMED_PORT`.

## Consulta de logs

```bash
docker compose logs -f
docker compose logs --tail=100
```

## Comprobación de salud

El contenedor define un `healthcheck` que consulta `GET /healthz`.

```bash
docker compose ps                     # columna STATUS debe indicar (healthy)
curl -fsS http://127.0.0.1:8080/healthz
docker inspect --format '{{.State.Health.Status}}' $(docker compose ps -q web)
```

## Actualización

Con una etiqueta nueva publicada en GHCR:

```bash
docker compose pull
docker compose up -d
```

## Identificación de versiones

La imagen se identifica por el **commit** que la generó, no por `latest`:

```
ghcr.io/<ORGANIZACION>/<REPOSITORIO>:<sha-del-commit>
```

La organización/registro se selecciona con las variables `HAPMED_IMAGE` (por defecto
`ghcr.io/hapmed/homepage`, a confirmar) y `HAPMED_TAG` (por defecto `dev` a nivel local).

```bash
docker image inspect ghcr.io/hapmed/homepage:<sha> --format '{{.Id}} {{json .RepoDigests}}'
```

## Recuperación de una versión anterior

Mantener siempre la versión anterior hasta comprobar que la nueva funciona:

```bash
HAPMED_TAG=<sha-anterior> docker compose pull
HAPMED_TAG=<sha-anterior> docker compose up -d
```

(Cuando exista el flujo de CI/CD de la Fase 4, el rollback se hará con el `<sha>` previo. No
se afirma que el rollback esté probado hasta verificarlo en el servidor.)

## Requisitos de producción

- `main` de Git y la imagen publicada en GHCR con etiqueta igual al commit.
- Contenedor sin privilegios, sin `privileged`, sin montar `/var/run/docker.sock`.
- Puerto publicado solo en `127.0.0.1`; la exposición pública la realiza Cloudflare Tunnel.
- Verificación de salud (`/healthz`) antes de dar por válido un despliegue.
- Secretos y credenciales fuera del repositorio y de la imagen.

## CI/CD (GitHub Actions)

Flujo: `git push origin main` → **validar → construir → publicar en GHCR → desplegar por SSH → verificar**.
Workflow: `.github/workflows/ci-cd.yml`.

Etapas:
1. **validate** — comprueba que existen los archivos necesarios, valida la estructura del sitio
   (`tools/validate-site.js`) y el HTML (`html-validate`).
2. **build** — construye la imagen con Buildx y la publica en GHCR **solo** en `push` (en PR no publica).
3. **deploy** — solo en `push` a `main`: copia `deploy/deploy.sh` y `deploy/compose.prod.yaml` al
   servidor y ejecuta el despliegue por SSH, con healthcheck y rollback.

Etiquetas de imagen: **el propio commit** (`type=sha,format=long`) más `main`. Nunca se depende de `latest`.

### Secretos necesarios en GitHub

Configurar en **Settings → Secrets and variables → Actions** (se recomienda en el entorno `production`):

| Secreto | Contenido | Obligatorio |
| --- | --- | --- |
| `SSH_HOST` | Host o IP del servidor | Sí |
| `SSH_USER` | Usuario de despliegue (no root) | Sí |
| `SSH_KEY` | Clave privada SSH de despliegue (ed25519) | Sí |
| `SSH_KNOWN_HOSTS` | Línea(s) de `known_hosts` del servidor | Sí |
| `SSH_PORT` | Puerto SSH (por defecto `22`) | No |
| `DEPLOY_PATH` | Directorio de producción en el servidor | Sí |

`GITHUB_TOKEN` lo usa el propio workflow para publicar en GHCR (`packages: write`); no hay que crearlo.

El job de despliegue está condicionado a la variable de repositorio **`ENABLE_DEPLOY`** (Settings →
Secrets and variables → Actions → Variables). Mientras no exista o no valga `true`, el workflow valida y
publica en GHCR pero **no despliega** (así no falla por secretos ausentes). Para activar el despliegue:
crear la variable `ENABLE_DEPLOY=true` y añadir los secretos SSH.

### Configuración de GHCR

- La imagen se publica como `ghcr.io/<org>/<repo>:<sha>`.
- Para que el **servidor** pueda descargar la imagen, se hace un `docker login ghcr.io` **una vez**
  con un token de solo lectura de paquetes (`read:packages`). No se pasa ningún token por la línea de
  comandos del workflow.
- Si el paquete es privado, mantener el login persistente en el servidor.

### Requisitos del servidor

- Docker Engine + Docker Compose v2 (`docker compose`).
- Usuario de despliegue **con permisos limitados** (no root). Grupo `docker` o Docker rootless.
- Directorio de producción **independiente** del de desarrollo (por convención `AGENTS.md`: `/opt/apps/<proyecto>`).
- `docker login ghcr.io` realizado una vez (ver arriba).
- Clave pública de despliegue en `~/.ssh/authorized_keys` del usuario de despliegue.

### Acceso SSH

1. Generar una clave dedicada de despliegue: `ssh-keygen -t ed25519 -f hapmed_deploy`.
2. Añadir `hapmed_deploy.pub` a `authorized_keys` del usuario de despliegue.
3. Guardar la privada como secreto `SSH_KEY`.
4. Guardar la huella del servidor: `ssh-keyscan -p <puerto> <host> >> known_hosts` y su contenido en
   `SSH_KNOWN_HOSTS` (nunca usar `StrictHostKeyChecking=no`).

### Directorio de producción

Ejemplo (valor del secreto `DEPLOY_PATH`):

```
/opt/apps/hapmed-web/
├── compose.prod.yaml     # copiado por el workflow
├── deploy.sh             # copiado por el workflow
├── .env                  # opcional: HAPMED_PORT=8080 (no lo sobrescribe el workflow)
└── .current_image        # estado interno: última imagen desplegada (para rollback)
```

La configuración específica del servidor se pone en `.env` o se exporta al invocar `deploy.sh`; así
`docker compose pull && up -d` no sobrescribe nada.

### Ejecución del workflow

- Automática al hacer `push` a `main` (o al abrir/actualizar un PR, que solo valida y construye sin desplegar).
- Manual desde **Actions → CI/CD → Run workflow** (`workflow_dispatch`).
- `concurrency` evita despliegues simultáneos de la aplicación.

### Diagnóstico de errores

| Síntoma | Causa probable | Acción |
| --- | --- | --- |
| `validate` falla | Falta un archivo o HTML inválido | Revisar el log del step; ejecutar `node tools/validate-site.js site` en local |
| `Permission denied` en SSH | Clave/host mal configurados | Verificar `SSH_KEY`, `SSH_USER`, `SSH_KNOWN_HOSTS`, `SSH_PORT` |
| `denied` al hacer push a GHCR | Permisos insuficientes | El job necesita `packages: write` (ya definido) |
| `pull access denied` en el servidor | El servidor no ha hecho `docker login ghcr.io` | Hacer login una vez (ver GHCR) |
| Healthcheck no `healthy` | Imagen rota o puerto ocupado | Revisar `docker compose logs`; el script intenta rollback |

### Verificación del despliegue

```bash
# en el servidor
cd /opt/apps/hapmed-web
docker compose -f compose.prod.yaml ps
docker inspect --format '{{.State.Health.Status}}' "$(docker compose -f compose.prod.yaml ps -q web)"
curl -fsS http://127.0.0.1:8080/healthz
cat .current_image
```

### Recuperación de una versión anterior (rollback)

- **Automática (en `deploy.sh`)**: si tras `up -d` el healthcheck/HTTP falla y existe una versión
  anterior registrada en `.current_image`, el script vuelve a desplegarla y **no elimina** ninguna imagen.
  *No se afirma que esté probada contra el servidor real hasta verificarlo.*
- **Manual**: volver a ejecutar el despliegue con el `<sha>` anterior:

  ```bash
  cd /opt/apps/hapmed-web
  IMAGE_REF=ghcr.io/hapmed/homepage:<sha-anterior> bash deploy.sh
  ```

### Endurecimiento recomendado

- Fijar las acciones por **SHA** completo en lugar de por etiqueta mayor.
- Usar **Docker rootless** en el servidor para limitar el alcance del usuario de despliegue.
- Proteger el entorno `production` con aprobación manual en GitHub.

## Notas

- Config específica de producción: se administra con variables de entorno
  (`HAPMED_IMAGE`, `HAPMED_TAG`, `HAPMED_PORT`) o un archivo `compose.override.yaml`
  local, de modo que `docker compose pull && up -d` no sobrescriba la configuración.
- El hash CSP del bloque JSON-LD de `site/index.html` está `hardcodeado` en
  `docker/nginx.conf`. Si se modifica ese bloque, hay que recalcular el hash y actualizarlo:

  ```bash
  node -e "const fs=require('fs'),c=require('crypto');const m=fs.readFileSync('site/index.html','utf8').match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);console.log('sha256-'+c.createHash('sha256').update(m[1]).digest('base64'))"
  ```
