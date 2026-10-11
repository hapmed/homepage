# 01 — ESTÁNDAR DE DESARROLLO HAPMED

> Estándar reutilizable para los proyectos web de HAPMED. Todos los agentes deben respetarlo de forma permanente.
>
> Toda excepción a este estándar requiere **justificación técnica y autorización explícita del usuario**.

---

## A. TECNOLOGÍA

Tecnologías permitidas y esperadas:

- HTML5 semántico.
- CSS3 nativo.
- JavaScript moderno (ES6 o posterior).
- SVG cuando sea apropiado.
- Nginx para servir contenido estático en producción.
- Docker y Docker Compose.
- Git y GitHub.
- GitHub Actions para automatización.
- GitHub Container Registry (GHCR) para almacenar imágenes.
- Linux como entorno de producción.
- Cloudflare Tunnel para publicar servicios cuando corresponda.

**Restricción expresa:** no introduzcas React, Vue, Svelte, Angular, Astro, Tailwind, Bootstrap, jQuery, bases de datos ni backend en este proyecto sin justificar su necesidad y obtener autorización del usuario.

---

## B. CALIDAD

- Código organizado y legible.
- Nombres coherentes.
- Separación de estructura, estilos y comportamiento.
- Diseño responsive.
- Accesibilidad.
- SEO básico.
- Buen rendimiento.
- Dependencias mínimas.
- No duplicar código innecesariamente.
- Documentar decisiones importantes.

---

## C. GIT

- Usar una rama principal llamada `main`, salvo que el repositorio existente requiera otra estrategia.
- Crear commits pequeños y descriptivos.
- No incluir contraseñas, tokens, claves privadas, certificados privados ni archivos `.env` con secretos.
- Mantener un `.gitignore` apropiado.
- Nunca hacer push sin autorización del usuario, salvo que posteriormente se autorice expresamente un procedimiento automatizado concreto.
- No modificar el historial de Git destructivamente.

---

## D. DOCKER

- Utilizar una imagen de Nginx apropiada y una versión explícita.
- Crear una imagen de producción pequeña.
- Ejecutar el contenedor sin privilegios innecesarios.
- No utilizar `privileged`.
- No montar `/var/run/docker.sock`.
- No exponer el daemon de Docker.
- Evitar puertos publicados innecesariamente.
- Definir `healthcheck`.
- Documentar puertos, volúmenes, redes y variables.
- No almacenar secretos dentro de la imagen.
- No utilizar `latest` como etiqueta de despliegue.
- Usar imágenes identificables por versión o digest cuando sea viable.
- Probar el contenedor localmente antes de desplegar.

---

## E. AUTOMATIZACIÓN

El objetivo final es que un cambio aprobado, enviado a GitHub mediante `git push origin main`, pueda activar un flujo que:

1. Valide el proyecto.
2. Construya la imagen Docker.
3. Ejecute las comprobaciones disponibles.
4. Publique la imagen en GHCR con una etiqueta identificable.
5. Acceda al servidor Linux mediante SSH.
6. Actualice el servicio utilizando Docker Compose.
7. Compruebe la salud de la aplicación.
8. Registre el resultado.
9. Permita recuperar una versión anterior si el despliegue falla.

**No** implementes este procedimiento suponiendo que la infraestructura ya está configurada. Identifica los datos y accesos pendientes.

---

## F. SEGURIDAD DE CI/CD

- Usar GitHub Actions con permisos mínimos.
- Guardar secretos en GitHub Actions Secrets o en el mecanismo seguro apropiado.
- No imprimir secretos en logs.
- No copiar claves privadas al repositorio.
- Utilizar un usuario de despliegue con permisos mínimos.
- No conceder acceso ilimitado a Docker sin evaluar el riesgo.
- No aceptar automáticamente claves de host SSH desconocidas.
- Verificar la identidad del servidor SSH.
- Evitar ejecuciones simultáneas de despliegues sobre el mismo servicio.
- No desplegar una imagen que no haya superado las comprobaciones necesarias.
- No afirmar que existe rollback funcional sin comprobarlo.

---

## G. CLOUDFLARE

- Mantener Cloudflare Tunnel separado del contenedor de la web cuando la arquitectura lo permita.
- No introducir tokens de Cloudflare en el código ni en la imagen.
- No modificar túneles, DNS ni reglas existentes sin autorización.
- Documentar qué configuración debe realizarse fuera del repositorio.

---

## H. DOCUMENTACIÓN

Mantener documentación actualizada sobre:

- Arquitectura.
- Desarrollo local.
- Construcción y ejecución Docker.
- Variables y secretos necesarios, sin revelar sus valores.
- Configuración de GitHub.
- Despliegue.
- Healthcheck.
- Recuperación de versiones.
- Problemas conocidos.
- Pruebas ejecutadas y pendientes.

---

## I. CHECKLIST RÁPIDO DE CUMPLIMIENTO

- [ ] Solo tecnologías permitidas (sin frameworks no autorizados).
- [ ] Estructura, estilos y comportamiento separados.
- [ ] Responsive, accesible y con SEO básico.
- [ ] Sin secretos en el repositorio ni en la imagen.
- [ ] Imagen Nginx con versión explícita y sin `latest` en despliegue.
- [ ] Contenedor sin `privileged` ni `docker.sock`.
- [ ] `healthcheck` definido y probado.
- [ ] Workflows con permisos mínimos y concurrencia controlada.
- [ ] Documentación actualizada.
