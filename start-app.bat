@echo off
REM Kid Progress Dashboard - Start Backend & Frontend Together (Windows)
REM Usage: start-app.bat

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     Kid Progress Dashboard - Starting Backend ^& Frontend      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Python is not installed!
    echo Please install Python from https://www.python.org
    pause
    exit /b 1
)

echo ▶ Starting Backend Server...
echo   Port: 8000
echo   URL: http://127.0.0.1:8000
echo.

REM Start backend in a new terminal window
cd backend
start "Kid Dashboard - Backend" python server.py
cd ..

REM Wait a moment for backend to start
timeout /t 2 /nobreak

echo ✅ Backend started
echo.

echo ▶ Starting Frontend (Vite Dev Server)...
echo   Port: 5173
echo   URL: http://localhost:5173
echo.

REM Start frontend in a new terminal window
start "Kid Dashboard - Frontend" npm run dev

timeout /t 3 /nobreak

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          ✅ Both Services Started Successfully!               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Frontend:  http://localhost:5173
echo Backend:   http://127.0.0.1:8000
echo.
echo To stop services:
echo   Close the terminal windows (Ctrl+C in each window)
echo.
echo ────────────────────────────────────────────────────────────────
echo.
pause
