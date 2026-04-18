# Kid Progress Dashboard

A starter web app for tracking a child's progress from prep through class 12.

## ✨ New Features (Latest Update)

### 📥 Download Timetable & Food Plans
- **Export to Excel**: Download weekly timetables and meal plans as .xlsx files
- **Export to PDF**: Generate print-ready PDF documents with professional styling
- **One-Click Downloads**: Available on Timetable and Food tabs
- **Easy Sharing**: Send plans to teachers, family, or print for home display

See [SUMMARY.md](./SUMMARY.md) for complete feature overview.

## Stack

- React + Vite frontend
- Python standard-library API server
- SQLite open-source database
- Playwright test
- **NEW**: XLSX library for Excel exports
- **NEW**: HTML2PDF for PDF generation

## Run the app

### Option 1: Local Development (Recommended for Development)

**Frontend:**
```bash
npm install          # Install dependencies (including new packages)
npm run dev          # Start development server (http://localhost:5173)
```

**Backend:**
```bash
python3 backend/server.py   # Runs on http://127.0.0.1:8000
```

The frontend runs on Vite and the backend runs on `http://127.0.0.1:8000`.
If the backend is not running, the React app still opens with sample data.

### Option 2: Docker (Recommended for Sharing & Deployment)

**Prerequisites:** Install [Docker Desktop](https://www.docker.com/products/docker-desktop)

**Run everything with Docker Compose:**
```bash
docker compose up -d
```

This will:
- Build and start the frontend (Nginx) on `http://localhost`
- Build and start the backend on `http://localhost:8000`
- Persist the SQLite database

**View logs:**
```bash
docker compose logs -f frontend
docker compose logs -f backend
```

**Stop everything:**
```bash
docker compose down
```

**Rebuild (after code changes):**
```bash
docker compose up -d --build
```

### Option 3: Build & Share Static App

For sharing the app without Docker or backend:
```bash
npm run build              # Creates dist/ folder
npx serve -s dist -l 5000 # Serve on http://localhost:5000
```

Then zip and share:
```bash
zip -r app-dist.zip dist
```

## 🎯 New Download Features

### Timetable Tab
- 📥 Click "Download as Excel" to export weekly routine
- 📄 Click "Download as PDF" to generate print-ready document

### Food Tab
- 📥 Click "Download as Excel" to export meal plans
- 📄 Click "Download as PDF" to generate print-ready document

**Filename Examples**:
- `Amishi_Timetable_Prep.xlsx`
- `Amishi_FoodPlan_Class1.pdf`

## 📚 Documentation

- **[SUMMARY.md](./SUMMARY.md)** - Quick overview of all changes
- **[DOWNLOAD_FEATURE_GUIDE.md](./DOWNLOAD_FEATURE_GUIDE.md)** - User guide for new features
- **[QUICK_START_TESTING.md](./QUICK_START_TESTING.md)** - Testing instructions
- **[IMPLEMENTATION_REPORT.md](./IMPLEMENTATION_REPORT.md)** - Technical documentation
- **[VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md)** - QA checklist

## API endpoints

- `GET /api/health`
- `GET /api/dashboard`
- `POST /api/notes`

## Database

SQLite database file:

- `backend/progress.db`

Stored profile photo:

- `public/images/amishi.jpg`

It is created automatically the first time you start the Python server.
