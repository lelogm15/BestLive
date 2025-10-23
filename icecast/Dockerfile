FROM alpine:3.18
RUN apk add --no-cache icecast ffmpeg tzdata
RUN addgroup -S icecast && adduser -S -G icecast icecast
WORKDIR /app
COPY icecast.xml /etc/icecast2/icecast.xml
EXPOSE 8000
CMD ["icecast", "-c", "/etc/icecast2/icecast.xml"]
