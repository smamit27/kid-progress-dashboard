# 🚀 Quick Docker Commands

## Start
```bash
docker compose up -d
```
→ Opens at `http://localhost` (frontend) and `http://localhost:8000` (backend API)

## Stop
```bash
docker compose down
```

## View Logs
```bash
docker compose logs -f
```

## Rebuild After Code Changes
```bash
docker compose up -d --build
```

## Share via Docker Hub
```bash
# 1. Create account at hub.docker.com and login
docker login

# 2. Tag images
docker tag dashboard-frontend <username>/dashboard-frontend:latest
docker tag dashboard-backend <username>/dashboard-backend:latest

# 3. Push
docker push <username>/dashboard-frontend:latest
docker push <username>/dashboard-backend:latest

# 4. Others run:
docker run -p 80:80 <username>/dashboard-frontend:latest
docker run -p 8000:8000 <username>/dashboard-backend:latest
```

## Share via Files (No Docker Hub)
```bash
# Export
docker save dashboard-frontend > frontend.tar
docker save dashboard-backend > backend.tar

# Share frontend.tar and backend.tar via email/cloud

# Others import and run:
docker load < frontend.tar
docker load < backend.tar
docker compose up -d
```

## Share via Git Repo
```bash
git push origin main
# Others:
git clone <repo-url>
cd vite-react-playwright
docker compose up -d
```

## Check Status
```bash
docker compose ps
```

## Clean Everything
```bash
docker compose down -v
docker system prune -a
```

---

**Need Docker?** Install [Docker Desktop](https://www.docker.com/products/docker-desktop)

For full guide, see [DOCKER_SETUP.md](./DOCKER_SETUP.md)
