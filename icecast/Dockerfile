# Imagen base estable y ligera
FROM alpine:3.20

# Instalar Icecast directamente
RUN apk add --no-cache icecast

# Copiar tu configuración personalizada
COPY icecast.xml /etc/icecast.xml

# Exponer el puerto Icecast
EXPOSE 8000

# Ejecutar Icecast directamente como root (Render no necesita usuario dedicado)
CMD ["icecast", "-c", "/etc/icecast.xml"]
