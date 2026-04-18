# 🚀 One-Command App Startup

Run both Backend & Frontend together with a single command!

## Quick Start

### macOS / Linux
```bash
chmod +x start-app.sh
./start-app.sh
```

### Windows
```bash
start-app.bat
```

---

## What It Does

✅ Starts Python backend on `http://127.0.0.1:8000`  
✅ Starts Vite frontend on `http://localhost:5173`  
✅ Both run in parallel (no Docker needed)  
✅ Single command to stop both (Ctrl+C)  

---

## Prerequisites

Make sure you have:
- ✅ Node.js installed (for frontend)
- ✅ Python 3 installed (for backend)
- ✅ Dependencies installed: `npm install`

---

## How to Use

### Step 1: Navigate to project folder
```bash
cd "/Users/sweta/Documents/New project/vite-react-playwright"
```

### Step 2: Make script executable (macOS/Linux only)
```bash
chmod +x start-app.sh
```

### Step 3: Run the script
**macOS/Linux:**
```bash
./start-app.sh
```

**Windows:**
```bash
start-app.bat
```

### Step 4: Open in browser
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000

### Step 5: Stop both services
```bash
Press Ctrl+C
```

---

## What You'll See

```
╔════════════════════════════════════════════════════════════════╗
║     Kid Progress Dashboard - Starting Backend & Frontend      ║
╚════════════════════════════════════════════════════════════════╝

▶ Starting Backend Server...
  Port: 8000
  URL: http://127.0.0.1:8000

✅ Backend started (PID: 12345)

▶ Starting Frontend (Vite Dev Server)...
  Port: 5173
  URL: http://localhost:5173

╔════════════════════════════════════════════════════════════════╗
║          ✅ Both Services Started Successfully!               ║
╚════════════════════════════════════════════════════════════════╝

Frontend:  http://localhost:5173
Backend:   http://127.0.0.1:8000

To stop both services:
  Press Ctrl+C
```

---

## Troubleshooting

### "Node.js is not installed"
→ Install from https://nodejs.org

### "Python 3 is not installed"
→ Install from https://www.python.org

### "npm not found"
→ Run `npm install` first to install dependencies

### "Backend failed to start"
→ Check if port 8000 is already in use:
  - macOS/Linux: `lsof -i :8000`
  - Windows: `netstat -ano | findstr :8000`

### "Frontend failed to start"
→ Check if port 5173 is already in use:
  - macOS/Linux: `lsof -i :5173`
  - Windows: `netstat -ano | findstr :5173`

### "Permission denied" (macOS/Linux)
→ Make the script executable:
  ```bash
  chmod +x start-app.sh
  ```

---

## Manual Alternative

If the script doesn't work, run these commands in separate terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
python3 server.py
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Then open:
- Frontend: http://localhost:5173
- Backend: http://127.0.0.1:8000

---

## Ports Used

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Python) | 8000 | http://127.0.0.1:8000 |

---

## Advanced Options

### Change Ports

**Frontend port:**
Edit `vite.config.js` and change:
```javascript
server: {
  port: 3000  // Change from 5173
}
```

**Backend port:**
Edit `backend/server.py` and change:
```python
PORT = 9000  # Change from 8000
```

---

## What's Running

### Frontend
- React + Vite development server
- Hot module reloading (auto-refresh on file changes)
- Browser opens automatically (may need manual opening)

### Backend
- Python HTTP server
- Serves API endpoints
- SQLite database (progress.db)

---

## Log Files

Both services output to the terminal. You can see:
- Frontend compilation messages
- Backend request logs
- Any errors in real-time

---

## Need Help?

### Check ports are free
```bash
# macOS/Linux
lsof -i :5173
lsof -i :8000

# Windows
netstat -ano | findstr :5173
netstat -ano | findstr :8000
```

### Kill processes using ports
```bash
# macOS/Linux - Backend
lsof -ti:8000 | xargs kill -9

# macOS/Linux - Frontend
lsof -ti:5173 | xargs kill -9

# Windows - Backend
netstat -ano | findstr :8000 | findstr LISTENING | for /f "tokens=5" %a in ('findstr /r ".*"') do taskkill /PID %a /F

# Windows - Frontend
netstat -ano | findstr :5173 | findstr LISTENING | for /f "tokens=5" %a in ('findstr /r ".*"') do taskkill /PID %a /F
```

---

## Tips

✅ **First time?** Run `npm install` before using the script  
✅ **Port busy?** Change ports in config files  
✅ **Want separate windows?** Modify the script to use `screen` or `tmux`  
✅ **Background running?** Add `&` at end (advanced users only)  

---

That's it! One command to run everything! 🚀
