# Backend: Python HTTP server
FROM python:3.11-slim

WORKDIR /app

# Copy the backend server script
COPY server.py .

# Copy the database (if it exists)
COPY progress.db . || true

# No external dependencies needed (uses stdlib only)
# But if needed in future, add requirements.txt and:
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/').read()" || exit 1

# Run the server
CMD ["python3", "server.py"]
