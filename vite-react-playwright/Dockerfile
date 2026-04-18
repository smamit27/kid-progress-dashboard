# Multi-stage build: Build frontend + Run both frontend and backend

# Stage 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Final image with both Nginx and Python backend
FROM ubuntu:22.04

# Install Nginx and Python
RUN apt-get update && apt-get install -y \
    nginx \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies from backend (if requirements.txt exists)
COPY backend/server.py /app/backend/server.py

WORKDIR /app

# Copy built frontend from build stage
COPY --from=build /app/dist /var/www/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create a proper startup script that handles both services
RUN mkdir -p /app/backend && cat > /start.sh << 'SCRIPT'
#!/bin/bash
set -e

echo "Starting Kid Progress Dashboard..."

# Start Python backend in background
echo "Starting Python backend on port 8000..."
cd /app/backend
python3 server.py &
PYTHON_PID=$!
echo "Python backend PID: $PYTHON_PID"

# Give Python server time to start
sleep 2

# Start Nginx in foreground (required for Docker)
echo "Starting Nginx..."
exec nginx -g "daemon off;"

# If Nginx stops, kill Python backend
trap "kill $PYTHON_PID 2>/dev/null || true" EXIT
SCRIPT

chmod +x /start.sh

# Copy database
COPY backend/progress.db /app/backend/progress.db 2>/dev/null || true

# Expose ports (80 for Nginx, 8000 for Python)
EXPOSE 80 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost/api/health || exit 1

# Start both services
CMD ["/start.sh"]
