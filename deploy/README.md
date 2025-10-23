# Deploy notes

- Push repo to GitHub.
- Create two services in Render:
  - BestLive Web (web/): Node web service. Set ICECAST_PUBLIC_URL env var to Icecast service URL.
  - Icecast (icecast/): Docker service exposing port 8000.
- After both services are up, register user on BestLive web and create station. Use the connection details to configure BUTT / Winamp.

