# Deploy web service (BestLive) to Render

1. Push `web/` folder to GitHub as a repository root or subfolder.
2. In Render, create a new **Web Service**:
   - Connect GitHub, choose the repo and the `web/` directory (if using monorepo).
   - Build command: `npm install`
   - Start command: `npm start`
   - Leave the port to default (Render provides `$PORT`).
3. Set environment variable `ICECAST_PUBLIC_URL` to the public URL of your Icecast Render service (e.g. `http://your-icecast-service.onrender.com`).
4. Deploy.
