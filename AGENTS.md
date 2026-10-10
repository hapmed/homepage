# AGENTS.md — Guía de operación del VPS (Oracle Cloud)

Guía para que **cualquier agente** (opencode u otro) pueda conectarse a este VPS y desplegar/administrar contenedores Docker y servicios expuestos por Cloudflare Tunnel.

---

## 1. Conexión SSH

```powershell
ssh -i C:\Users\hecto\.ssh\oci_vps_key ubuntu@40.233.9.240
```

- **Host:** `40.233.9.240` (IP pública reservada — no cambia)
- **Usuario:** `ubuntu` (tiene **sudo sin password**)
- **Llave privada:** `C:\Users\hecto\.ssh\oci_vps_key` (NTFS, ACL restringida)
- Copia segura adicional: `C:\Users\hecto\.ssh\oci-vps\oci_vps_key`
- Original (exFAT, **no usar para ssh**, no soporta permisos): `D:\Antigravity\HAPMED\VPSOracle\ssh-key-2026-10-10.key`

### Ejecutar comandos sin shell interactiva (recomendado para agentes)

```powershell
ssh -i C:\Users\hecto\.ssh\oci_vps_key -o BatchMode=yes -o ConnectTimeout=20 ubuntu@40.233.9.240 "<comando>"
```

> En Windows, `ssh` escribe warnings a stderr y PowerShell los muestra como errores rojos; **no son fallos**. Revisa el código de salida real.

Si el agente corre en **otra máquina**, necesita una copia de la llave privada ahí (con permisos `600`/ACL estricta) o su propia llave pública añadida a `~/.ssh/authorized_keys` del usuario `ubuntu` en el VPS.

---

## 2. Entorno del VPS

| Dato | Valor |
| --- | --- |
| OS | Ubuntu 22.04 (kernel `6.8.0-1060-oracle`) |
| Arquitectura | `x86_64` |
| CPU/RAM | 15 GiB RAM (ver `nproc`) |
| Hostname | `vnic0` |
| Docker Engine | `29.9.0` (servicio `docker`, activo) |
| Docker Compose | `v5.6.0` (`docker compose`) |
| cloudflared | `2026.10.0` (servicio `cloudflared`, activo) |
| Puertos abiertos a Internet | **solo 22** (SSH). Todo lo demás va por el túnel. |
| Compartimentos OCI | tenancy `ocid1.tenancy.oc1..aaaaaaaaho5ebf5ekctrutfujorr7irjxc3ck5greceqxkyejpxmxknjp4da` |

El usuario `ubuntu` ya está en el grupo `docker`. En sesiones SSH nuevas `docker` funciona sin `sudo`; si no, usa `sudo docker` o `sg docker -c '<cmd>'`.

---

## 3. Reglas para agentes

1. **No expongas puertos en OCI**: no toques la Security List; el tráfico público entra por el túnel de Cloudflare.
2. **Usa `sudo docker`** (o `sg docker -c`) para evitar problemas de grupo en sesiones no interactivas.
3. **Trabaja en `/opt/apps/<proyecto>`** o `/srv/<proyecto>`; no en el home del usuario.
4. **No imprimas secretos** (tokens, `.env`) en logs ni en la conversación.
5. **Verifica antes de reiniciar** servicios (`systemctl status`, `docker ps`).
6. Idempotencia: revisa si un contenedor/servicio ya existe antes de crearlo.
7. Nunca ejecutes `docker system prune -a` ni borres volúmenes sin confirmación explícita.

---

## 4. Workflow Docker

### 4.1 Comprobar estado

```bash
sudo docker ps -a
sudo docker version
sudo docker compose version
sudo systemctl is-active docker
```

### 4.2 Crear un proyecto (ejemplo)

```bash
sudo mkdir -p /opt/apps/miapp && cd /opt/apps/miapp
sudo tee docker-compose.yml >/dev/null <<'YAML'
services:
  web:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "127.0.0.1:8080:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro
YAML
sudo docker compose up -d
sudo docker compose ps
```

> **Importante:** publica los puertos en `127.0.0.1` (no `0.0.0.0`) para que solo el túnel los alcance, salvo que quieras exponerlos en la red local del VCN.

### 4.3 Operaciones habituales

```bash
sudo docker compose -f /opt/apps/miapp/docker-compose.yml logs -f
sudo docker compose -f /opt/apps/miapp/docker-compose.yml pull
sudo docker compose -f /opt/apps/miapp/docker-compose.yml up -d --build
sudo docker compose -f /opt/apps/miapp/docker-compose.yml restart
sudo docker compose -f /opt/apps/miapp/docker-compose.yml down
sudo docker exec -it <container> sh
```

### 4.4 Red compartida entre apps (opcional)

```bash
sudo docker network create apps-net
```

Añade `networks: [apps-net]` (con `external: true`) a cada compose para que los contenedores se resuelvan por nombre.

---

## 5. Cloudflare Tunnel

El túnel ya está instalado y corriendo como servicio systemd:

```bash
sudo systemctl status cloudflared --no-pager
sudo systemctl restart cloudflared
sudo journalctl -u cloudflared -n 50 --no-pager
```

- Token almacenado en `/etc/cloudflared/token`
- Métricas locales en `http://127.0.0.1:20241/metrics`
- Conexión saliente (QUIC) a la red de Cloudflare; **no requiere puertos entrantes**

### Añadir rutas (hostname → servicio local)

Esto se hace en el **panel de Cloudflare**, no en el VPS:

1. Zero Trust → **Networks → Tunnels** → tu túnel.
2. **Public Hostnames → Add a public hostname**.
3. Ejemplo: `app.tudominio.com` → Service `HTTP` → URL `localhost:8080`.
4. Guarda; el túnel aplica la ruta automáticamente.

### Reinstalar / rotar token

```bash
sudo cloudflared service uninstall
sudo cloudflared service install <NUEVO_TOKEN>
```

---

## 6. Verificación rápida (health check)

```bash
echo "== sistema ==" && uptime && free -h | head -2
echo "== disco ==" && df -h / | tail -1
echo "== docker ==" && sudo systemctl is-active docker && sudo docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
echo "== tunel ==" && sudo systemctl is-active cloudflared
```

---

## 7. Acceso a OCI (opcional, desde opencode)

El MCP `oracle-oci` está configurado en `C:\Users\hecto\.config\opencode\opencode.json` y autentica con `C:\Users\hecto\.oci\config`. Permite operar la API de OCI (listar instancias, IPs, subredes, etc.) sin Cloud Shell. Requiere reiniciar opencode tras cambios de config.

---

## 8. Seguridad

- La llave SSH privada y `~/.oci/oci_api_key.pem` = **control total**. No versionar ni compartir.
- **Rota el token del túnel** si se filtró (panel Cloudflare → Tunnel → *Refresh token*).
- Considera `sudo ufw` limitando SSH al salto habitual (opcional; OCI ya filtra por Security List).
- Actualiza el sistema periódicamente: `sudo apt-get update && sudo apt-get upgrade -y`.

---

## 9. Referencias internas

- Documentación del setup completo: `README.md` (mismo directorio).
- OCIDs y credenciales OCI: ver `README.md` §1 y §3.
