#!/usr/bin/env bash
set -euo pipefail

# Despliegue de HAPMED Web en el servidor de produccion.
# Uso:  IMAGE_REF="ghcr.io/ORG/REPO:<sha>" bash deploy.sh
# Variables opcionales: COMPOSE_FILE, HAPMED_PORT, HEALTH_URL, STATE_FILE,
#                       HEALTH_RETRIES, HEALTH_DELAY.

IMAGE_REF="${IMAGE_REF:-}"
COMPOSE_FILE="${COMPOSE_FILE:-compose.prod.yaml}"
HAPMED_PORT="${HAPMED_PORT:-8080}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:${HAPMED_PORT}/healthz}"
STATE_FILE="${STATE_FILE:-.current_image}"
HEALTH_RETRIES="${HEALTH_RETRIES:-24}"
HEALTH_DELAY="${HEALTH_DELAY:-5}"

log() { printf '[deploy %s] %s\n' "$(date -u +%H:%M:%S)" "$*"; }
fail() { log "ERROR: $*"; exit 1; }

[ -n "$IMAGE_REF" ] || fail "Falta IMAGE_REF (referencia exacta de la imagen)."
case "$IMAGE_REF" in
  */*:*) : ;;
  *) fail "IMAGE_REF no tiene el formato repositorio:etiqueta -> '$IMAGE_REF'" ;;
esac
[ -f "$COMPOSE_FILE" ] || fail "No se encuentra el compose de produccion '$COMPOSE_FILE'."

export HAPMED_IMAGE="${IMAGE_REF%:*}"
export HAPMED_TAG="${IMAGE_REF##*:}"

log "Imagen nueva:  $IMAGE_REF"
log "Puerto host:   $HAPMED_PORT"
log "Health URL:    $HEALTH_URL"

REUSED=0
PREV="$(cat "$STATE_FILE" 2>/dev/null || true)"
if [ -n "$PREV" ] && [ "$PREV" = "$IMAGE_REF" ]; then REUSED=1; fi
log "Version anterior: ${PREV:-<ninguna>}"

wait_healthy() {
  local i cid status
  for i in $(seq 1 "$HEALTH_RETRIES"); do
    cid="$(docker compose -f "$COMPOSE_FILE" ps -q web || true)"
    status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$cid" 2>/dev/null || echo unknown)"
    if [ "$status" = "healthy" ]; then return 0; fi
    if [ "$status" = "unhealthy" ] || [ "$status" = "exited" ]; then log "estado=$status"; return 1; fi
    sleep "$HEALTH_DELAY"
  done
  return 1
}

http_ok() { curl -fsS --max-time 5 "$HEALTH_URL" >/dev/null 2>&1; }

log "Descargando la imagen..."
docker compose -f "$COMPOSE_FILE" pull web || fail "No se pudo descargar $IMAGE_REF."

log "Actualizando el contenedor..."
docker compose -f "$COMPOSE_FILE" up -d || fail "'docker compose up' fallo."

if wait_healthy && http_ok; then
  log "Healthcheck OK y respuesta HTTP OK."
  [ "$REUSED" -eq 1 ] || echo "$IMAGE_REF" > "$STATE_FILE"
  log "Despliegue correcto: $IMAGE_REF"
  docker compose -f "$COMPOSE_FILE" ps
  exit 0
fi

log "El despliegue de $IMAGE_REF no paso la verificacion."

if [ -n "$PREV" ] && [ "$PREV" != "$IMAGE_REF" ]; then
  log "Iniciando rollback a $PREV ..."
  export HAPMED_IMAGE="${PREV%:*}"
  export HAPMED_TAG="${PREV##*:}"
  if docker compose -f "$COMPOSE_FILE" pull web && docker compose -f "$COMPOSE_FILE" up -d; then
    if wait_healthy && http_ok; then
      log "Rollback aplicado y verificado: $PREV"
    else
      log "Rollback aplicado pero la version anterior tampoco paso la verificacion."
    fi
  else
    log "El rollback a $PREV fallo."
  fi
else
  log "No hay version anterior valida para revertir."
fi

fail "Despliegue fallido. Se conserva la imagen anterior (no se elimina nada)."
