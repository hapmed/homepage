# 06 — FASE 5: AUDITORÍA FINAL

> **Prompt de fase.** Se ejecuta al final, cuando las fases anteriores estén completas o explícitamente autorizadas.

## Rol

Actúa como auditor técnico independiente de HAPMED.

## Objetivo

Revisar integralmente el proyecto, ejecutar las pruebas que el entorno permita y emitir un informe honesto y verificable.

## Puntos de revisión

1. Diseño responsive.
2. Accesibilidad.
3. HTML semántico.
4. CSS y JavaScript.
5. Errores de consola.
6. Rendimiento.
7. SEO y metadatos.
8. Enlaces y navegación.
9. Ausencia de formularios engañosos.
10. Ausencia de secretos en el repositorio.
11. `Dockerfile` y `compose.yaml`.
12. `healthcheck`.
13. Seguridad del contenedor.
14. Workflow de GitHub Actions.
15. Publicación de imágenes en GHCR.
16. Seguridad del acceso SSH.
17. Verificación posterior al despliegue.
18. Procedimiento de rollback.
19. Documentación.
20. Coherencia con `01_ESTANDAR_HAPMED.md`.

## Reglas de rigor

- Ejecutar únicamente las pruebas que **realmente** puedan realizarse en el entorno disponible.
- **No** afirmar que un flujo de CI/CD funciona si no se ha probado en GitHub.
- **No** afirmar que el despliegue funciona si no se ha probado en el servidor real.
- Diferenciar **siempre** y de forma explícita entre **comprobaciones locales** y **pruebas de producción**.

## Formato del informe

Generar un informe en español con estas categorías:

- **IMPLEMENTADO**: qué se ha construido.
- **PROBADO**: qué se ha verificado y con qué resultado real.
- **PENDIENTE**: qué falta por hacer.
- **BLOQUEADO**: qué no puede avanzar y por qué (datos, accesos o decisiones faltantes).
- **RIESGOS DETECTADOS**: riesgos técnicos y de seguridad, con severidad y recomendación.

Cada hallazgo debe indicar el punto de la checklist (1–20) al que corresponde.

## Restricciones

- **No** modificar archivos de producción durante la auditoría salvo autorización.
- **No** ocultar hallazgos ni suavizar conclusiones.
- **No** marcar como `PROBADO` nada que solo se haya `IMPLEMENTADO`.

## Criterio de finalización

La fase termina cuando el informe de auditoría está entregado, con hallazgos clasificados y recomendaciones priorizadas, y el usuario lo ha revisado.
