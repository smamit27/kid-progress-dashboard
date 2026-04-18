#!/bin/bash

# Kid Progress Dashboard - Start Backend & Frontend Together
# Usage: ./start-app.sh

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Kid Progress Dashboard - Starting Backend & Frontend      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}⚠️  Python 3 is not installed!${NC}"
    echo "Please install Python 3 from https://www.python.org"
    exit 1
fi

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Start Backend
echo -e "${BLUE}▶ Starting Backend Server...${NC}"
echo "  Port: 8000"
echo "  URL: http://127.0.0.1:8000"
echo ""

cd backend
python3 server.py &
BACKEND_PID=$!

# Give backend a moment to start
sleep 2

# Go back to root directory
cd "$SCRIPT_DIR"

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Backend failed to start!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo ""

# Start Frontend
echo -e "${BLUE}▶ Starting Frontend (Vite Dev Server)...${NC}"
echo "  Port: 5173"
echo "  URL: http://localhost:5173"
echo ""

npm run dev &
FRONTEND_PID=$!

# Give frontend a moment to start
sleep 3

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo -e "║          ${GREEN}✅ Both Services Started Successfully!${NC}          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Frontend:${NC}  http://localhost:5173"
echo -e "${GREEN}Backend:${NC}   http://127.0.0.1:8000"
echo ""
echo -e "${YELLOW}To stop both services:${NC}"
echo "  Press Ctrl+C"
echo ""
echo "────────────────────────────────────────────────────────────────"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping services...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✅ All services stopped${NC}"
}

# Set up trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Wait for both processes
wait
