# Icecast Docker for BestLive

This folder contains a minimal Dockerfile that installs Icecast and runs it.
Deploy this directory as a **Docker** service on Render and expose port `8000`.

Before deploying, edit `icecast.xml` to set secure passwords:
- `<source-password>` will be the global source password (you can still create per-mount passwords).
- `<admin-password>` sets the admin console password.

Render steps:
1. Create new service -> Docker -> connect to repo -> set root directory to `icecast/`.
2. Expose port `8000`.
3. Set build and deploy.

After deploy you'll have a public URL for Icecast like `https://your-icecast.onrender.com` — use it in the web app `ICECAST_PUBLIC_URL`.
