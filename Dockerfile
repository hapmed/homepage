FROM nginxinc/nginx-unprivileged:1.31.6-alpine

LABEL org.opencontainers.image.title="HAPMED Web" \
      org.opencontainers.image.description="Sitio corporativo estatico de HAPMED servido con Nginx" \
      org.opencontainers.image.source="https://github.com/hapmed/homepage"

ARG ASSET_VERSION=dev

USER root
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY site/ /usr/share/nginx/html/
RUN sed -i "s|assets/css/styles.css|assets/css/styles.css?v=${ASSET_VERSION}|g; s|assets/js/main.js|assets/js/main.js?v=${ASSET_VERSION}|g" \
      /usr/share/nginx/html/index.html /usr/share/nginx/html/404.html \
    && chmod -R a+rX /usr/share/nginx/html \
    && chmod a+r /etc/nginx/conf.d/default.conf
USER 101

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz > /dev/null || exit 1
