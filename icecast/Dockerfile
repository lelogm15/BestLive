FROM alpine:3.20

# Instalar Icecast
RUN apk add --no-cache icecast

# Crear archivo mime.types vacío para evitar warning
RUN touch /etc/mime.types

# Copiar configuración personalizada
COPY icecast.xml /etc/icecast.xml

# Exponer puerto
EXPOSE 8000

# Ejecutar Icecast (Render corre como root, pero el cambio real lo hace el XML)
CMD ["icecast", "-c", "/etc/icecast.xml"]
