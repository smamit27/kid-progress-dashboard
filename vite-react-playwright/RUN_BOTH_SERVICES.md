# 🎯 Run Both Backend & Frontend with ONE Command

## ⚡ The Simplest Way

### macOS / Linux
```bash
./start-app.sh
```

### Windows
```bash
start-app.bat
```

That's it! Both services start together! 🚀

---

## 📋 Prerequisites

Before running, make sure you have:

1. **Node.js** installed
   ```bash
   node --version    # Should show v16+ or higher
   ```

2. **Python 3** installed
   ```bash
   python3 --version    # Should show 3.7+
   ```

3. **Dependencies installed** (run this once)
   ```bash
   npm install
   ```

---

## 🚀 Step-by-Step Guide

### Step 1: Open Terminal/Command Prompt
Navigate to your project folder:
```bash
cd "/Users/sweta/Documents/New project/vite-react-playwright"
```

### Step 2: Make Script Executable (macOS/Linux only)
```bash
chmod +x start-app.sh
```
*(Skip this on Windows)*

### Step 3: Run the Script

**macOS/Linux:**
```bash
./start-app.sh
```

**Windows:**
```bash
start-app.bat
```

### Step 4: Wait for Services to Start
You'll see:
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
```

### Step 5: Open in Browser
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000

### Step 6: Stop Both Services
Press **Ctrl+C** in the terminal. Both services stop automatically.

---

## 📊 What's Running

| Component | Port | URL | Language |
|-----------|------|-----|----------|
| Frontend (Vite Dev Server) | 5173 | http://localhost:5173 | JavaScript (React) |
| Backend (HTTP Server) | 8000 | http://127.0.0.1:8000 | Python |
| Database | — | progress.db | SQLite |

---

## 🔧 How It Works

The scripts do this automatically:

1. ✅ Check if Node.js is installed
2. ✅ Check if Python 3 is installed
3. ✅ Start backend on port 8000
4. ✅ Wait 2 seconds for backend to initialize
5. ✅ Start frontend on port 5173
6. ✅ Display both URLs
7. ✅ Keep both running until you press Ctrl+C
8. ✅ Stop both services cleanly on exit

---

## 🆘 Troubleshooting

### Issue: "Permission denied" (macOS/Linux)
```bash
chmod +x start-app.sh
./start-app.sh
```

### Issue: "Node.js is not installed"
Download from https://nodejs.org and install

### Issue: "Python 3 is not installed"
Download from https://www.python.org and install

### Issue: "Port already in use"

**Check what's using the port:**

macOS/Linux:
```bash
lsof -i :5173    # Check frontend port
lsof -i :8000    # Check backend port
```

Windows:
```bash
netstat -ano | findstr :5173
netstat -ano | findstr :8000
```

**Kill the process:**

macOS/Linux:
```bash
lsof -ti:5173 | xargs kill -9    # Kill frontend
lsof -ti:8000 | xargs kill -9    # Kill backend
```

Windows:
```bash
taskkill /PID <PID> /F
```

### Issue: Backend fails to start

Check if dependencies are missing:
```bash
cd backend
# There are no external dependencies for the backend (uses Python stdlib)
# But if you added any, install them:
pip install -r requirements.txt
```

### Issue: Frontend fails to start

Make sure dependencies are installed:
```bash
npm install
```

---

## 🎯 Manual Alternative (If Script Doesn't Work)

If you prefer, run these commands in **separate terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
python3 server.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then open:
- http://localhost:5173 (Frontend)
- http://127.0.0.1:8000 (Backend)

---

## 💡 Tips & Tricks

### Tip 1: Auto-open Browser
The frontend usually opens automatically. If not, manually open: http://localhost:5173

### Tip 2: Hot Reload
Any changes to React files automatically reload in browser (no need to restart)

### Tip 3: Backend Changes
Backend changes require restart. Press Ctrl+C and run script again.

### Tip 4: Use Different Ports
Edit `vite.config.js` for frontend port:
```javascript
server: {
  port: 3000  // Change to your preferred port
}
```

Edit `backend/server.py` for backend port:
```python
PORT = 9000  # Change to your preferred port
```

### Tip 5: Background Mode (Advanced)
To run in background (macOS/Linux):
```bash
./start-app.sh &
```

To see running processes:
```bash
jobs
```

To bring back to foreground:
```bash
fg
```

---

## 📁 Files

| File | Purpose |
|------|---------|
| `start-app.sh` | macOS/Linux startup script (executable) |
| `start-app.bat` | Windows startup script |
| `START_APP_GUIDE.md` | This guide |

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] Python 3 installed (`python3 --version`)
- [ ] npm dependencies installed (`npm install`)
- [ ] Script is executable (`chmod +x start-app.sh` on macOS/Linux)
- [ ] No services using ports 5173 or 8000
- [ ] Project folder path is correct

---

## 🎉 Success Indicators

✅ Both services started when you run the command  
✅ Frontend loads at http://localhost:5173  
✅ Backend responds at http://127.0.0.1:8000  
✅ No error messages in terminal  
✅ Both services stop when you press Ctrl+C  

---

## 📞 Need Help?

1. **Check prerequisites**: Node.js, Python 3, npm install
2. **Check ports**: Are 5173 and 8000 free?
3. **Check permissions**: Is start-app.sh executable?
4. **Read error messages**: Terminal shows exact problem

---

## 🚀 Ready?

Run this command:

**macOS/Linux:**
```bash
./start-app.sh
```

**Windows:**
```bash
start-app.bat
```

Happy coding! 🎊
