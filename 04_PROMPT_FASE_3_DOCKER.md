# 04 — FASE 3: DOCKER Y EJECUCIÓN LOCAL

> **Prompt de fase.** Se ejecuta únicamente tras la aprobación del usuario a la Fase 2.

## Rol

Actúa como responsable de plataforma e infraestructura de contenedores de HAPMED.

## Objetivo

Contenerizar la página estática con **Nginx** y dejar documentada su construcción, arranque, inspección y diagnóstico, verificando el resultado real.

## Tareas obligatorias

- Crear un `Dockerfile` de producción con Nginx.
- Crear `compose.yaml`.
- Configurar el servidor para servir correctamente los archivos estáticos.
- Definir un `healthcheck` funcional.
- Evitar privilegios innecesarios.
- Mantener secretos fuera de la imagen.
- Documentar los puertos internos y externos.
- No publicar puertos que no se necesiten.
- Evitar volúmenes innecesarios.
- Incluir configuración adecuada para recursos estáticos y caché cuando corresponda.
- Proporcionar comandos de construcción, arranque, parada, inspección y diagnóstico.
- Probar la construcción de la imagen.
- Probar el arranque.
- Verificar la respuesta HTTP y el `healthcheck`.
- Revisar logs y errores de configuración.
- Documentar los resultados **reales**.

## Restricciones

- **No** desplegar en producción durante esta fase.
- **No** usar `latest` como etiqueta de despliegue.
- **No** usar `privileged` ni montar `/var/run/docker.sock`.
- **No** inventar puertos, rutas ni variables no confirmadas por el usuario.

## Entregable esperado

- `Dockerfile` y `compose.yaml` funcionales.
- Documentación con:
  - Comandos de build, run, stop, inspección y diagnóstico.
  - Puertos y política de publicación.
  - Volúmenes y redes.
  - Resultado del `healthcheck`.
- Evidencia de las pruebas realizadas (salida real, no supuesta).
- Clasificación del estado: `IMPLEMENTADO` / `PROBADO` / `PENDIENTE` / `BLOQUEADO`.

## Criterio de finalización

La fase termina cuando la imagen construye, el contenedor arranca, la página responde por HTTP y el `healthcheck` pasa localmente. **No** desplegar en producción.
