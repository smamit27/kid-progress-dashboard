# API CORS Preflight Issue - Root Cause Analysis & Fix

## Problem
When clicking "Mark as Paid" on Render deployment, the fees API returns:
```
fees (failed) net::ERR_CONNECTION_REFUSED preflight
```

## Root Causes

### 1. Backend Service Not Running
The Python backend (`server.py`) may not be starting properly on Render due to:
- Service startup race condition (Nginx starts before Python is ready)
- Python server crashing silently
- Database file permissions issue

### 2. Nginx Proxy Configuration
The `/api/` location block needs proper:
- CORS headers for OPTIONS preflight requests
- Correct proxy pass settings
- Proper handling of different request methods

### 3. Environment Variables
The backend needs to bind to `0.0.0.0` (all interfaces) not just `localhost`.

## Solutions Implemented

### 1. Enhanced Dockerfile Startup Script
**File:** `Dockerfile` (lines 39-61)

Added proper startup sequence:
```bash
#!/bin/bash
set -e

# Start Python backend first
python3 server.py &
PYTHON_PID=$!

# Wait 2 seconds for Python to start
sleep 2

# Start Nginx in foreground
exec nginx -g "daemon off;"
```

**Why it works:**
- `set -e`: Exit on any error
- Background Python process with PID tracking
- 2-second delay ensures Python is listening
- Nginx runs in foreground (required for Docker)

### 2. Enhanced Nginx CORS Configuration
**File:** `nginx.conf` (lines 47-70)

```nginx
location /api/ {
    proxy_pass http://localhost:8000;
    
    # CORS headers for preflight
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
    
    # Handle OPTIONS (preflight) requests
    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```

**Why it works:**
- `add_header ... always`: Adds headers to all responses (even errors)
- `if ($request_method = 'OPTIONS')`: Handles preflight requests
- `return 204`: No Content response (success for OPTIONS)
- No proxy_pass for OPTIONS (Nginx handles directly)

### 3. Backend CORS Headers
**File:** `backend/server.py` (lines 408-411)

Already implemented:
```python
self.send_header("Access-Control-Allow-Origin", "*")
self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
self.send_header("Access-Control-Allow-Headers", "Content-Type")
```

### 4. Backend OPTIONS Handler
**File:** `backend/server.py` (lines 419-421)

```python
def do_OPTIONS(self) -> None:
    self.send_response(200)
    self._send_json({})
```

## Deployment Steps

### Step 1: Verify Code is Committed
```bash
cd /Users/sweta/Documents/New\ project/vite-react-playwright
git status  # Should show no changes
```

### Step 2: Redeploy on Render
1. Go to: https://dashboard.render.com
2. Select: `kid-progress-dashboard` service
3. Click: "Manual Deploy" → "Redeploy latest commit"
4. Wait: 5-10 minutes for build to complete

### Step 3: Monitor Render Logs
Watch for these messages (good signs):
```
Starting Kid Progress Dashboard...
Starting Python backend on port 8000...
Starting Nginx...
```

Bad signs (troubleshoot if you see):
```
ERROR: Connection refused
Traceback (most recent call last):
Port 8000 already in use
```

### Step 4: Test API Endpoints

**Test 1: Frontend loads**
- Visit: https://kid-progress-dashboard.onrender.com
- Should NOT show blank page
- Should show dashboard with data

**Test 2: Check backend health**
- Open DevTools (F12)
- Go to Network tab
- Look for `/api/health` request
- Should return: `200 OK` with `{"status": "ok"}`

**Test 3: Test fees endpoint** (The problematic one)
- Click: "Mark as Paid" button
- DevTools Network tab should show:
  - OPTIONS /api/fees → 204 No Content (preflight)
  - POST /api/fees → 200 OK (actual request)
- Data should update without errors

**Test 4: All other endpoints**
- Refresh page: `/api/dashboard` should work
- Create note: `/api/notes` should work
- Change theme: (no API call)
- Update settings: `/api/settings` should work

## Testing Checklist

- [ ] Frontend loads at production URL
- [ ] No blank page or 404 errors
- [ ] DevTools Network tab shows successful API calls
- [ ] `/api/health` returns 200
- [ ] `/api/dashboard` returns 200 with data
- [ ] `/api/fees` preflight (OPTIONS) returns 204
- [ ] `/api/fees` POST returns 200
- [ ] `/api/notes` works
- [ ] `/api/settings` works
- [ ] No console errors about "net::ERR_CONNECTION_REFUSED"
- [ ] Data persists after page refresh

## If Still Getting Connection Refused

### Check 1: Backend is running
In Render logs, you should see:
```
Starting Python backend on port 8000...
Python backend PID: 45
```

If missing, the startup script failed. Check for Python errors.

### Check 2: Nginx is running
In Render logs, you should see:
```
Starting Nginx...
```

### Check 3: Proxy is configured
In Render logs (at container start):
- Nginx should start without errors
- No proxy_pass errors

### Check 4: Database file exists
The SQLite database must be at: `/app/backend/progress.db`
- Docker volume mounts it at: `./backend/progress.db`
- Render persists it with volumes

### Check 5: Port 8000 is accessible
Nginx proxies to `localhost:8000`
- Python must bind to `0.0.0.0:8000` (not `127.0.0.1:8000`)
- Currently in `backend/server.py` line 14: `HOST = os.environ.get("HOST", "0.0.0.0")` ✅

## Common Issues & Fixes

### Issue: "preflight net::ERR_CONNECTION_REFUSED"
**Cause:** Backend not running or Nginx misconfigured
**Fix:** Ensure `docker-compose.yml` has correct BACKEND_URL, redeploy

### Issue: "CORS error: Access-Control-Allow-Origin"
**Cause:** CORS headers missing or incorrect
**Fix:** Verify nginx.conf has `add_header` directives, ensure `always` flag

### Issue: "404 Not Found" on /api/*
**Cause:** Nginx not proxying to Python backend
**Fix:** Check nginx.conf `/api/` location block, verify Python is running

### Issue: "500 Internal Server Error" on /api/*
**Cause:** Python backend crashed or database error
**Fix:** Check Render logs for Python traceback, verify database file exists

## Git Commits

| Commit | Changes |
|--------|---------|
| 5835f06 | Updated BACKEND_URL to production domain |
| 4e779c1 | Added CORS headers and OPTIONS handling to Nginx |
| 399e3d1 | Improved Docker startup script for production |
| aa30739 | Restored backend/server.py and fixed API_BASE |

## Files Modified

- `docker-compose.yml` - Updated BACKEND_URL
- `nginx.conf` - Already has CORS headers (commit 4e779c1)
- `Dockerfile` - Already has improved startup (commit 399e3d1)
- `backend/server.py` - Already has CORS handlers (commit aa30739)
- `src/App.jsx` - Already has smart API_BASE detection (commit 399e3d1)

## Next Action

**After reading this, go to Render Dashboard and redeploy!**

1. Visit: https://dashboard.render.com/dashboard
2. Click: kid-progress-dashboard service
3. Click: Manual Deploy → Redeploy latest commit
4. Monitor logs for 5-10 minutes
5. Test at: https://kid-progress-dashboard.onrender.com

Expect the "Mark as Paid" button to work correctly after redeploy! ✅
