# BestLive — Live radio web panel + Icecast (for Render & GitHub)

Este repositorio contiene una aplicación mínima **BestLive** para administrar emisoras y generar las credenciales necesarias para enlazar fuentes (BUTT / Winamp / Mixxx) a Icecast.

**Contenido**
- `web/` — aplicación Node.js + Express (usa SQLite para almacenar usuarios y emisoras).
- `icecast/` — Dockerfile + plantilla `icecast.xml` para desplegar Icecast como servicio Docker (para Render).
- `deploy/` — scripts de ayuda.
- `README.md` — este archivo.

**Diseño y decisión técnica (resumen)**
- La app web y el servidor Icecast **deben desplegarse como dos servicios distintos en Render**:
  - Un web service (Node.js) para la UI/API (se expone en `$PORT` proporcionado por Render).
  - Un web service (Docker) para Icecast que expondrá el puerto 8000 (el puerto objetivo para fuentes y listeners).
- Razón: Render expone sólo el puerto que vincula al servicio web. Para tener Icecast accesible en su propio puerto (para que BUTT/Winamp se conecten directamente), necesitamos desplegar Icecast en su propio servicio Docker en Render y exponer el puerto 8000.
- Alternativa: desplegar Icecast en otro VPS/servicio con puerto público (pero aquí usamos Render Docker).

**Pasos rápidos para desplegar**
1. Subir este repositorio a GitHub (`git init` / `git add` / `git commit` / `git push`).
2. Crear **dos** servicios en Render:
   - **Service A (web)**: connect to GitHub repo, root dir `web/`, type `Web Service`, runtime `Node`, build command `npm install && npm run build`, start command `npm start`. Render will assign `$PORT`.
   - **Service B (icecast)**: select `Docker` and choose root dir `icecast/` (contiene Dockerfile). Expose port `8000`.
3. Configurar variables de entorno en Render Web service:
   - `ICECAST_PUBLIC_URL` — URL pública del servicio Icecast (ej. `https://your-icecast-service.onrender.com` o `http://render-ip:8000`).
   - Opcional: `NODE_ENV=production`, `ADMIN_SECRET=...`
4. Visitar la URL del servicio Web (render) y registrarse. Crear una emisora; la web devolverá: `server URL`, `mountpoint`, `source password` para usar en BUTT / Winamp.

**Limitaciones y seguridad**
- Esta distribución es un **starter kit**. No usar en producción sin revisar seguridad (HTTPS, validación, rate-limits, cambiar contraseñas, asegurar SQLite, firewalls).
- Butt/Winamp requerirán: Host (la URL o IP del servicio Icecast), Port (8000), Mountpoint (ej. `/mymount`), Source password.
- Icecast por defecto necesita configurar users en `icecast.xml`. El Dockerfile genera un icecast.xml usando variables de entorno.

**Archivos incluidos**
- `/web` — aplicación web (Express + SQLite).
- `/icecast` — Dockerfile para image de Icecast + plantillas.

Lee los archivos `web/README_DEPLOY.md` y los scripts en `deploy/` para instrucciones más detalladas.
