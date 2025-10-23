FROM alpine:3.20

# Instalar Icecast
RUN apk add --no-cache icecast

# Copiar configuración personalizada
COPY icecast.xml /etc/icecast.xml

# Crear archivo mime.types vacío para evitar el warning
RUN touch /etc/mime.types

# Exponer puerto
EXPOSE 8000

# Ejecutar Icecast como usuario 'nobody' (que ya existe en Alpine)
USER nobody

# Iniciar Icecast
CMD ["icecast", "-c", "/etc/icecast.xml"]
