# 🐳 Docker Setup Guide

This guide explains how to use Docker to build and share your Kid Progress Dashboard app across different computers.

## Prerequisites

Install [Docker Desktop](https://www.docker.com/products/docker-desktop) on your machine:
- **macOS**: Download from [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
- **Windows**: Download from [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
- **Linux**: Use your package manager (e.g., `sudo apt install docker.io` on Ubuntu)

After installation, verify Docker is running:
```bash
docker --version
docker compose --version
```

## Quick Start

Once Docker is installed, run the entire app (frontend + backend) with one command:

```bash
cd "/Users/sweta/Documents/New project/vite-react-playwright"
docker compose up -d
```

Then open in your browser:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000

## What Gets Built

### 1. Frontend Container
- **Image**: Multi-stage Node.js build → Nginx serve
- **Build**: `npm run build` inside container
- **Serve**: Nginx on port 80
- **Optimized**: 
  - Static assets cached for 1 year
  - Gzip compression enabled
  - React Router fallback to index.html

### 2. Backend Container
- **Image**: Python 3.11 slim
- **Server**: Python HTTP server on port 8000
- **Data**: SQLite database persisted in volume
- **Healthcheck**: Automatic container restart on failure

## Common Commands

### Start the app
```bash
docker compose up -d
```

### View logs
```bash
# All services
docker compose logs -f

# Just frontend
docker compose logs -f frontend

# Just backend
docker compose logs -f backend
```

### Stop everything
```bash
docker compose down
```

### Rebuild after code changes
```bash
docker compose up -d --build
```

### Remove old images
```bash
docker compose down -v
docker system prune -a
```

### Check container status
```bash
docker compose ps
```

## Sharing the App

### Option A: Push to Docker Hub (Recommended for sharing)

1. Create a Docker Hub account at [hub.docker.com](https://hub.docker.com)

2. Login locally:
   ```bash
   docker login
   ```

3. Tag your images:
   ```bash
   docker tag dashboard-frontend <your-dockerhub-username>/dashboard-frontend:latest
   docker tag dashboard-backend <your-dockerhub-username>/dashboard-backend:latest
   ```

4. Push to Docker Hub:
   ```bash
   docker push <your-dockerhub-username>/dashboard-frontend:latest
   docker push <your-dockerhub-username>/dashboard-backend:latest
   ```

5. Share with others — they can run:
   ```bash
   docker run -p 80:80 <your-dockerhub-username>/dashboard-frontend:latest
   docker run -p 8000:8000 <your-dockerhub-username>/dashboard-backend:latest
   ```

### Option B: Share docker-compose.yml + repo

1. Push your repo to GitHub/GitLab
2. Share the link
3. Others clone and run:
   ```bash
   git clone <your-repo-url>
   cd vite-react-playwright
   docker compose up -d
   ```

### Option C: Export images as tar (offline sharing)

1. Export both images:
   ```bash
   docker save dashboard-frontend > frontend.tar
   docker save dashboard-backend > backend.tar
   ```

2. Share the `.tar` files with others

3. They import and run:
   ```bash
   docker load < frontend.tar
   docker load < backend.tar
   docker compose up -d
   ```

## File Structure

```
vite-react-playwright/
├── Dockerfile              # Multi-stage frontend build
├── nginx.conf             # Nginx server config
├── docker-compose.yml     # Services definition
├── .dockerignore           # Ignore large files in build
├── backend/
│   └── Dockerfile         # Python backend build
└── ...
```

## Troubleshooting

### Port already in use
If port 80 or 8000 is already in use:

Edit `docker-compose.yml`:
```yaml
ports:
  - "3000:80"      # Change 80 to 3000
```

Then access at `http://localhost:3000`

### Database not persisting
The SQLite database is stored in a Docker volume. To check:
```bash
docker volume ls
docker volume inspect vite-react-playwright_backend-db
```

### Container keeps restarting
Check the logs:
```bash
docker compose logs backend
```

Common issues:
- Port conflict
- Python syntax error in `server.py`
- Missing dependencies (add to `requirements.txt` in backend)

### Clean rebuild
```bash
docker compose down -v
docker system prune -a
docker compose up -d --build
```

## Performance Tips

### Development Mode
For faster iteration during development, run frontend locally:
```bash
npm run dev
```

Only use Docker for the backend:
```bash
docker run -p 8000:8000 -v $(pwd)/backend:/app dashboard-backend
```

### Production Optimization
The current setup is already optimized:
- ✅ Multi-stage builds (smaller image sizes)
- ✅ Alpine base images
- ✅ Gzip compression
- ✅ Static asset caching
- ✅ Health checks

## Next Steps

1. Install Docker Desktop
2. Run `docker compose up -d`
3. Open http://localhost in your browser
4. Share with others using one of the methods above

## Support

For Docker issues:
- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)

For app-specific issues:
- Check logs: `docker compose logs -f`
- Check backend: `curl http://localhost:8000/api/health`
- Check frontend: Open `http://localhost` in browser
