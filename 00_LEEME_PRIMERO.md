# 00 — LEE ESTO PRIMERO

> Documento de entrada obligatorio para cualquier persona o agente de programación que trabaje en el repositorio de HAPMED.

## 1. Objetivo del proyecto

Este repositorio contiene la **página web corporativa de HAPMED**, una marca de desarrollo de software orientada a:

- Automatización industrial.
- Integración de sistemas (PLC, HMI, SCADA y protocolos industriales).
- Aplicaciones y software empresarial.
- La familia de aplicaciones **EVA**.

El objetivo de esta fase es **documentar** la arquitectura, los estándares, las instrucciones de desarrollo por fases y el proceso de despliegue, **antes** de escribir una sola línea de código de la web.

El resultado final esperado es una página estática de presentación comercial, de calidad premium, servida con Nginx dentro de un contenedor Docker, con un flujo de integración y despliegue continuo sobre GitHub, y publicada cuando corresponda mediante Cloudflare Tunnel.

## 2. Orden obligatorio de lectura

Todo agente debe leer los documentos en este orden exacto:

1. `00_LEEME_PRIMERO.md` (este documento).
2. `01_ESTANDAR_HAPMED.md`.
3. `02_PROMPT_FASE_1_ARQUITECTURA.md`.
4. `03_PROMPT_FASE_2_DISENO_WEB.md`.
5. `04_PROMPT_FASE_3_DOCKER.md`.
6. `05_PROMPT_FASE_4_CICD.md`.
7. `06_PROMPT_FASE_5_AUDITORIA.md`.

No se debe comenzar a programar hasta haber leído el plan completo.

## 3. Instrucciones permanentes para agentes

> Antes de hacer cualquier cambio, lee completamente `00_LEEME_PRIMERO.md` y `01_ESTANDAR_HAPMED.md`. Después, lee todos los documentos de las fases para comprender el plan completo.
>
> No empieces a programar hasta que el usuario autorice la fase correspondiente.
>
> Respeta permanentemente el estándar de `01_ESTANDAR_HAPMED.md`.
>
> No sobrescribas archivos existentes, no ejecutes operaciones destructivas, no hagas commit ni push y no despliegues sin la autorización correspondiente.
>
> No inventes datos de infraestructura. Si necesitas información que todavía no está disponible, identifica qué falta y pregunta al usuario.
>
> No declares una tarea terminada si no has realizado las comprobaciones necesarias.
>
> Distingue claramente entre `IMPLEMENTADO`, `PROBADO`, `PENDIENTE` y `BLOQUEADO`.

## 4. Fases del proyecto y orden de ejecución

| Fase | Documento | Contenido |
| --- | --- | --- |
| Fase 1 | `02_PROMPT_FASE_1_ARQUITECTURA.md` | Inspección y arquitectura. |
| Fase 2 | `03_PROMPT_FASE_2_DISENO_WEB.md` | Diseño y desarrollo de la web. |
| Fase 3 | `04_PROMPT_FASE_3_DOCKER.md` | Docker y ejecución local. |
| Fase 4 | `05_PROMPT_FASE_4_CICD.md` | Integración continua y despliegue automatizado. |
| Fase 5 | `06_PROMPT_FASE_5_AUDITORIA.md` | Auditoría final. |

Las fases se ejecutan **en este orden**. Ninguna fase se inicia sin la autorización explícita del usuario.

## 5. Estados de avance

Para evitar ambigüedades, todo informe de progreso debe clasificar cada tarea en una de estas categorías:

- **IMPLEMENTADO**: la tarea se ha escrito o configurado.
- **PROBADO**: la tarea se ha verificado con una comprobación real y conocemos su resultado.
- **PENDIENTE**: la tarea está planificada pero no iniciada.
- **BLOQUEADO**: la tarea no puede avanzar por falta de información, accesos o decisiones del usuario.

## 6. Reglas de seguridad no negociables

- No inventar direcciones IP, dominios, usuarios SSH, nombres de secretos ni configuraciones de infraestructura.
- No incluir contraseñas, tokens, claves privadas ni archivos `.env` con secretos en el repositorio.
- No ejecutar operaciones destructivas ni modificar el historial de Git.
- No hacer commit, push ni despliegue sin autorización explícita.

## 7. Estado actual de esta fase

- Fase actual: **creación de la documentación base (estos siete documentos)**.
- No se ha desarrollado la página web.
- No se han creado archivos HTML, CSS, JavaScript, Dockerfile ni workflows.
- No se ha hecho commit, push ni despliegue.

## 8. Siguiente paso

Esperar la **aprobación explícita del usuario** para iniciar la Fase 1 (inspección y arquitectura). No comenzar automáticamente.
