# 02 — FASE 1: INSPECCIÓN Y ARQUITECTURA

> **Prompt de fase.** Esta fase es **solo de análisis**. No se escribe código de aplicación ni se despliega nada.

## Rol

Actúa como arquitecto de software de HAPMED.

## Objetivo

Inspeccionar completamente el repositorio **antes** de programar y producir una propuesta de arquitectura y un plan de trabajo, que el usuario deberá aprobar para poder iniciar la Fase 2.

## Tareas obligatorias

1. Examinar archivos, estructura y configuración existente.
2. Identificar si el repositorio está vacío o contiene un proyecto.
3. Revisar Git **sin modificar el historial** (estado, ramas, remotos, último commit).
4. Identificar la documentación que ya exista.
5. Confirmar el stack: **HTML5, CSS3 y JavaScript nativo**.
6. Proponer la estructura de carpetas.
7. Definir la arquitectura Docker y el flujo de CI/CD.
8. Identificar los datos de infraestructura que todavía falten.
9. Detectar riesgos técnicos y de seguridad.
10. Presentar un plan de trabajo ordenado.
11. Esperar la aprobación del usuario antes de iniciar la Fase 2.

## Restricciones de la fase

- **No** modificar archivos de aplicación.
- **No** realizar despliegues.
- **No** crear Dockerfile, workflows, HTML, CSS ni JavaScript todavía.
- **No** inventar datos de infraestructura (IPs, dominios, usuarios SSH, secretos).

## Entregable esperado

Un informe en español que contenga, como mínimo:

### 1. Estado del repositorio
- Contenido actual y propósito de cada archivo relevante.
- Estado de Git (rama, remoto, último commit) sin modificarlo.

### 2. Stack confirmado
- Confirmación de HTML5 + CSS3 + JavaScript nativo.
- Lista de tecnologías permitidas aplicables a este proyecto.

### 3. Estructura de carpetas propuesta
- Árbol de directorios y propósito de cada carpeta.
- Ubicación de HTML, CSS, JavaScript, SVG, imágenes y configuración Nginx.

### 4. Arquitectura Docker propuesta
- Imagen base y versión objetivo.
- Puertos internos y política de publicación.
- Healthcheck previsto.
- Redes y volúmenes previstos (evitar los innecesarios).

### 5. Flujo de CI/CD propuesto
- Disparador, validaciones, construcción, publicación en GHCR, despliegue y verificación.
- Concurrencia y estrategia de rollback (a nivel de diseño).

### 6. Datos pendientes que faltan
- Lista explícita de lo que se necesita y **no** debe inventarse:
  - Destino de despliegue y método de publicación (a confirmar con el usuario).
  - Usuario y mecanismo de acceso para despliegue (a confirmar).
  - Cuentas de imagen/registro y rutas (a confirmar).
  - Dominio y publicación mediante Cloudflare Tunnel (a confirmar).

### 7. Riesgos técnicos y de seguridad
- Riesgos identificados y mitigaciones propuestas.

### 8. Plan de trabajo ordenado
- Pasos concretos para Fase 2 y posteriores.

### 9. Estado
- Clasificación de cada punto como `IMPLEMENTADO`, `PROBADO`, `PENDIENTE` o `BLOQUEADO`.

## Criterio de finalización

La fase termina cuando el informe está entregado y el usuario aprueba la arquitectura. **No** iniciar la Fase 2 automáticamente.
