# Full-Stack Deployment on Render (With Database & Backend)

## Issue Fixed

Previous deployment only showed static frontend. Now it runs:
- ✅ React frontend (Vite build)
- ✅ Nginx reverse proxy
- ✅ Python backend (API server)
- ✅ SQLite database (persistent)

## What Changed

### 1. Dockerfile (Multi-Stage Build)
- **Stage 1:** Builds React app with Node.js
- **Stage 2:** Ubuntu base with Nginx + Python
- **Result:** Single container runs both frontend + backend

### 2. Nginx Configuration
- Frontend static files served on port 80
- API requests proxied to Python backend on port 8000
- CORS headers configured
- Gzip compression enabled

### 3. Docker Compose
- Single `app` service (not separate frontend/backend)
- Both ports exposed: 80 (frontend) and 8000 (backend)
- Database volume for persistence

## Deployment Steps on Render

### Step 1: Update your Render service

Go to: https://dashboard.render.com

1. **Select your Kid Progress Dashboard service**
2. **Go to Settings**
3. **Delete the current deployment** (optional, can redeploy instead)
4. **Rebuild & Redeploy:**
   - Click "Manual Deploy" or "Redeploy latest commit"
   - It will pull the updated Dockerfile
   - Build will take 5-10 minutes

### Step 2: Monitor the Build

Build Logs:
1. Click "Logs" tab
2. Watch the build process:
   - Stage 1: Building React app (2-3 min)
   - Stage 2: Installing system packages (1-2 min)
   - Final: Starting Nginx + Python (30 sec)
3. When you see "listening on port 80", deployment complete ✅

### Step 3: Test the Deployment

Once live, test:

```bash
# Frontend loading (should return HTML)
curl https://YOUR-APP.onrender.com/

# Backend API (should return JSON)
curl https://YOUR-APP.onrender.com/api/get_progress

# Database operations
# Open the dashboard and create a new child
# Refresh - data should persist ✅
```

## Testing Checklist

After deployment, verify:

- [ ] Frontend loads at `https://YOUR-APP.onrender.com`
- [ ] Dashboard displays (no blank page)
- [ ] Theme switching works (Light/Dark/High-Contrast)
- [ ] Add new child - no errors in console
- [ ] Refresh page - child still exists (database working)
- [ ] Create routine - saves successfully
- [ ] Export to Excel - file downloads
- [ ] Export to PDF - file downloads
- [ ] API responding: Check Network tab in DevTools
- [ ] Check Render Logs - no errors

## Database Persistence

### How It Works

```yaml
volumes:
  - ./backend/progress.db:/app/backend/progress.db
```

The `progress.db` file is:
- Stored in the container at `/app/backend/progress.db`
- Mounted from the local filesystem
- Persists between container restarts
- Backed up in your GitHub repo

### Backup Strategy

The database is included in your GitHub repo at:
```
backend/progress.db
```

It's tracked in Git, so:
- ✅ Commits include database state
- ✅ Database survives container restarts
- ✅ Can roll back to previous database state via Git

## Troubleshooting

### Issue: "Still seeing blank page"

**Solution:**
1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Check Network tab in DevTools for API errors
3. Check Render Logs for Python backend errors
4. Rebuild: Render Dashboard → Manual Deploy

### Issue: "API calls returning 404"

**Solution:**
1. Verify nginx.conf has `/api/` proxy rule
2. Confirm Python backend is running
3. Check Render Logs for Python errors
4. Rebuild deployment

### Issue: "Data not persisting after restart"

**Solution:**
1. Verify volume mount in docker-compose.yml
2. Check database file exists: `ls -la backend/progress.db`
3. Ensure database is committed to GitHub
4. Redeploy

### Issue: "Build failing with error"

**Solution:**
1. Check Render Logs for full error message
2. Common causes:
   - Missing backend/server.py
   - Missing nginx.conf
   - Package.json or package-lock.json corrupted
3. Solution: Push corrected files to GitHub and redeploy

## Docker Architecture

```
┌─────────────────────────────────────────┐
│         Render Container                │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   Nginx (Port 80)                │  │
│  │   - Serves static frontend       │  │
│  │   - Proxies /api/ to backend     │  │
│  └──────────────────────────────────┘  │
│                  ↓                      │
│  ┌──────────────────────────────────┐  │
│  │   Python Backend (Port 8000)     │  │
│  │   - HTTP server                  │  │
│  │   - Handles API requests         │  │
│  │   - Manages database             │  │
│  └──────────────────────────────────┘  │
│                  ↓                      │
│  ┌──────────────────────────────────┐  │
│  │   SQLite Database                │  │
│  │   - progress.db                  │  │
│  │   - Persisted in volume          │  │
│  │   - Survives restarts            │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## Port Configuration

- **Port 80:** Nginx (public, HTTP traffic)
- **Port 8000:** Python backend (internal, proxied by Nginx)

On Render:
- External: `https://YOUR-APP.onrender.com` → Port 80 (Nginx)
- Internal: Backend on Port 8000 (via Nginx proxy)

## Performance Tips

1. **First Load:** Initial build takes 5-10 minutes
2. **Subsequent Deploys:** Faster (Docker layer caching)
3. **Database:** SQLite suitable for small/medium apps
4. **Static Files:** Cached for 1 year (nginx.conf)
5. **Compression:** Gzip enabled for text files

## Next Steps

1. **Monitor Deployment:** Watch Render dashboard
2. **Test Functionality:** Verify all features work
3. **Check Logs:** Monitor for any errors
4. **Invite Users:** Share the live URL
5. **Keep Deployed:** Render keeps free tier apps awake if used regularly

## Environment Variables (Optional)

To add environment variables in Render:

1. Go to Service Settings
2. Click "Environment"
3. Add variables (e.g., `DATABASE_URL`, `DEBUG_MODE`)
4. Redeploy

Current defaults work without extra variables.

## Getting Help

If deployment fails:

1. **Check Render Logs:** Most errors shown there
2. **Verify GitHub Files:** All files at root level?
3. **Test Locally:** `docker-compose up` locally first
4. **Check Dockerfile:** Valid syntax?
5. **Contact Support:** Render has excellent support

## Success Indicators

✅ Deployment successful when:
- Frontend loads without errors
- Theme switching works
- API calls respond (check Network tab)
- Database operations persist
- Export features work
- No red errors in browser console
- Render logs show no errors

---

**Status:** Ready for full-stack deployment ✅
**Last Updated:** April 2026
**Architecture:** React + Nginx + Python + SQLite
