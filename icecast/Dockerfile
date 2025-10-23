FROM alpine:3.20

# Instalar Icecast
RUN apk add --no-cache icecast bash

# Crear directorios necesarios
RUN mkdir -p /icecast/log /icecast/web /icecast/admin

# Copiar configuración personalizada
COPY icecast.xml /etc/icecast.xml

# Exponer puerto
EXPOSE 8000

# Ejecutar Icecast
CMD ["icecast", "-c", "/etc/icecast.xml"]
git add .
git commit -m "Fix Icecast config for Render root issue"
git push origin main
