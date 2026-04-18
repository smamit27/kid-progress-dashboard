# 🏗️ Docker Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        YOUR COMPUTER                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    DOCKER ENVIRONMENT                        │
│  (All services run in isolated containers)                   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           FRONTEND CONTAINER (Nginx)                 │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  React App (dist/)                              │  │   │
│  │  │  • Home/Overview                                │  │   │
│  │  │  • Holidays Tab                                 │  │   │
│  │  │  • Class & Subjects                             │  │   │
│  │  │  • Timetable + Export                           │  │   │
│  │  │  • Food Plan + Export                           │  │   │
│  │  │  • Theme System (Light/Dark/HC)                 │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │              Nginx Web Server                        │   │
│  │              ├─ Gzip Compression                    │   │
│  │              ├─ Static Caching (1 year)              │   │
│  │              └─ React Router SPA Support             │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │ Port 80                                    │
│                 │                                            │
│  ┌──────────────┴───────────────────────────────────────┐   │
│  │           BACKEND CONTAINER (Python)                │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Python HTTP Server                             │  │   │
│  │  │  ├─ GET /api/health                             │  │   │
│  │  │  ├─ GET /api/dashboard                          │  │   │
│  │  │  └─ POST /api/notes                             │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  │         SQLite Database (progress.db)                │   │
│  │         └─ Persisted in Docker Volume               │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │ Port 8000                                  │
│                 │                                            │
└─────────────────┼────────────────────────────────────────────┘

        ┌─────────────┴──────────────┐
        │                            │
   ┌────▼─────┐              ┌──────▼────┐
   │ Browser  │◄─────────────►│ API Call  │
   │:80       │              │:8000      │
   └──────────┘              └───────────┘

```

## Data Flow

```
USER BROWSER
    │
    ├─► HTTP://LOCALHOST (Port 80)
    │   └─► Nginx → React App (Frontend)
    │       └─► Loads index.html
    │           └─► Loads JS/CSS/Images
    │               └─► Static assets cached
    │
    └─► AJAX Request → HTTP://LOCALHOST:8000 (Port 8000)
        └─► Backend API
            └─► SQLite Database
                └─► Response back to Frontend
                    └─► React renders data

```

## Container Communication

```
┌─────────────────┐
│  DOCKER BRIDGE  │  (dashboard-network)
│      NETWORK    │
└────────┬────────┘
         │
    ┌────┴──────────────────┐
    │                       │
┌───▼──────┐         ┌─────▼────┐
│FRONTEND  │  ◄────► │ BACKEND  │
│Container │ Service │Container │
│hostname  │ DNS     │hostname  │
│          │         │          │
└──────────┘         └──────────┘

Frontend → Backend calls via:
http://backend:8000/api/...

```

## File Layout

```
vite-react-playwright/
│
├── 📄 Dockerfile              ← Frontend build config
├── 📄 nginx.conf              ← Nginx config
├── 📄 docker-compose.yml      ← Services definition
├── 📄 .dockerignore           ← Build optimization
│
├── 📁 backend/
│   ├── 📄 Dockerfile          ← Backend build config
│   ├── 📄 server.py           ← Python HTTP server
│   └── 📄 progress.db         ← SQLite database
│
├── 📁 src/
│   ├── 📄 App.jsx            ← React main
│   └── 📄 App.css            ← Theme system
│
├── 📁 public/
│   └── 📁 images/
│       └── 📄 amishi.jpg
│
└── 📁 dist/                   ← Built frontend (created by npm run build)
```

## Docker Build Process

### Frontend Build
```
1. Start with node:18-alpine base image
   ↓
2. Copy package.json & package-lock.json
   ↓
3. Run npm ci (clean install)
   ↓
4. Copy source code
   ↓
5. Run npm run build (Vite bundler)
   ↓
6. Copy dist/ to nginx image
   ↓
7. Start nginx server
```

### Backend Build
```
1. Start with python:3.11-slim base image
   ↓
2. Copy server.py & progress.db
   ↓
3. (No external dependencies needed — uses stdlib)
   ↓
4. Run python3 server.py
```

## Environment Variables

### Frontend
- None required (connects to backend via docker hostname)

### Backend
```
HOST=0.0.0.0      # Listen on all interfaces (inside container)
PORT=8000         # Default HTTP server port
```

## Port Mapping

```
Docker Host (Your Computer)  →  Container
─────────────────────────────────────────
localhost:80            →  nginx:80 (frontend)
localhost:8000          →  backend:8000 (API)
```

## Volume Mounts

```
Host Path                                Container Path
─────────────────────────────────────────────────────
./backend/progress.db  ◄─► /app/progress.db (backend)

(Database persists between container restarts)
```

## Health Checks

```
Frontend
├─ HTTP GET /health
├─ Every 30 seconds
└─ Container auto-restarts if unhealthy

Backend
├─ Python urllib request to http://localhost:8000
├─ Every 30 seconds
└─ Container auto-restarts if unhealthy
```

## Networking

```
Docker Compose creates a bridge network:

docker-compose.yml
  └─ networks:
      └─ dashboard-network (bridge driver)

frontend service ─┐
                  ├─ Connected to dashboard-network
backend service ──┤
                  └─ Can communicate via DNS hostnames

Access:
• frontend → backend via: http://backend:8000
• browser → frontend via: http://localhost
* browser → backend via: http://localhost:8000
```

## Security Model

```
┌─────────────────────────────────┐
│    Docker Sandbox Isolation     │
│                                 │
│  Container 1 (Frontend)         │
│  ├─ Isolated filesystem         │
│  └─ Port 80 (exposed)           │
│                                 │
│  Container 2 (Backend)          │
│  ├─ Isolated filesystem         │
│  ├─ Database (persistent vol)   │
│  └─ Port 8000 (exposed)         │
│                                 │
│  Only internal network exposed: │
│  └─ frontend ◄─► backend        │
└─────────────────────────────────┘

External Access:
localhost:80 ──► frontend container
localhost:8000 ─► backend container

Host machine cannot directly access:
✗ Container filesystems
✗ Internal container network (unless exposed)
✓ Only exposed ports
```

## Scaling Example (Future)

```
If you add more services:

docker-compose.yml
├── frontend (Nginx)
├── backend (Python)
├── cache (Redis) — NEW
├── database (PostgreSQL) — NEW
└── worker (Celery) — NEW

All connected to dashboard-network
All accessible via docker hostnames
```

---

## Quick Reference

| Component | Image | Port | Status Check |
|-----------|-------|------|--------------|
| Frontend | node:18-alpine (build) → nginx:alpine (runtime) | 80 | GET http://localhost/ |
| Backend | python:3.11-slim | 8000 | GET http://localhost:8000/ |
| Network | bridge (dashboard-network) | — | docker network ls |
| Storage | Docker volume | — | docker volume ls |

---

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed commands and troubleshooting.
