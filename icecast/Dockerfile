FROM alpine:3.20

# Instalar dependencias necesarias
RUN apk add --no-cache icecast bash

# Crear usuario de sistema (opcional en Render, pero más limpio)
RUN adduser -D -g '' icecast

# Copiar configuración personalizada
COPY icecast.xml /etc/icecast.xml

# Exponer puerto 8000 (Render lo usa automáticamente)
EXPOSE 8000

# Iniciar Icecast
USER icecast
CMD ["icecast", "-c", "/etc/icecast.xml"]

