# 05 — FASE 4: CI/CD CON GITHUB ACTIONS

> **Prompt de fase.** Se ejecuta únicamente tras la aprobación del usuario a la Fase 3.

## Rol

Actúa como responsable de integración y despliegue continuo de HAPMED.

## Objetivo

Diseñar e implementar, **una vez autorizada la fase**, un flujo de CI/CD mediante **GitHub Actions** que construya, publique y desplace la web.

## FLUJO OBJETIVO

1. Detectar cambios en `main`.
2. Validar el proyecto.
3. Construir la imagen Docker.
4. Ejecutar las comprobaciones pertinentes.
5. Publicar la imagen en **GHCR** con una etiqueta basada en el commit.
6. Conectarse al servidor Linux mediante SSH.
7. Actualizar el servicio con Docker Compose.
8. Comprobar el `healthcheck` y la respuesta HTTP.
9. Registrar el resultado.
10. Permitir recuperar la última versión funcional.

## REQUISITOS

- Crear el workflow dentro de `.github/workflows/`.
- Usar permisos mínimos.
- Configurar concurrencia para evitar despliegues simultáneos del mismo servicio.
- Utilizar **GitHub Secrets** para credenciales.
- **No** introducir secretos en el repositorio.
- Verificar la clave de host SSH (evitar `StrictHostKeyChecking=no` ciego).
- Usar un usuario de despliegue con privilegios limitados.
- **No** inventar direcciones, rutas ni usuarios del servidor.
- **No** exponer el daemon Docker.
- **No** usar etiquetas ambiguas como `latest` para identificar la versión desplegada.
- Utilizar una etiqueta inmutable o un digest para identificar la imagen desplegada.
- Definir claramente qué sucede si falla la actualización.
- Evitar eliminar la versión anterior antes de comprobar que la nueva funciona.
- Documentar los pasos manuales que todavía sean necesarios.

## ANTES DE ACTIVAR EL DESPLIEGUE AUTOMÁTICO

Presentar para su revisión:

- La lista de **secretos requeridos** (solo nombres y propósito, nunca valores).
- Las **configuraciones externas** necesarias (registro, servidor, túnel, DNS).
- Los **riesgos** detectados.
- Los **datos de infraestructura pendientes** que el usuario debe aportar.

## Restricciones

- **No** realizar un despliegue real sin autorización expresa.
- **No** ejecutar `git push` sin autorización expresa.
- **No** afirmar que el rollback funciona sin haberlo probado.
- **No** afirmar que el flujo funciona si no se ha probado en GitHub.

## Entregable esperado

- Uno o más workflows en `.github/workflows/`.
- Documentación de:
  - Disparadores y etapas.
  - Secretos requeridos (solo nombres).
  - Configuración externa necesaria.
  - Estrategia de rollback y su estado de prueba.
  - Pasos manuales restantes.
- Clasificación del estado: `IMPLEMENTADO` / `PROBADO` / `PENDIENTE` / `BLOQUEADO`.

## Criterio de finalización

La fase termina cuando el diseño está aprobado y, si se autoriza, implementado y probado. Diferenciar siempre entre pruebas locales y pruebas reales en GitHub/servidor.
