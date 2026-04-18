# Kid Progress Dashboard - Project Information

## Project Identity

**Name:** Kid Progress Dashboard  
**Full Name:** Kid Progress Dashboard - Track Learning Journey  
**Version:** 0.0.0  
**Type:** Educational Tracking Web Application

## Project Description

A comprehensive web application designed to track a child's educational progress from Prep through Class 12. The dashboard provides parents and educators with:

- **Progress Tracking**: Monitor learning milestones and academic progress
- **Routine Planning**: Daily timetables and meal plans adapted to school class
- **Habit Management**: Weekly habits and routines support
- **Parent Notes**: Collaborative communication system
- **Fee Management**: School fee tracking and payment status
- **Holiday Calendar**: Track school holidays and breaks
- **Report Generation**: Export timetables and meal plans as Excel/PDF

## Technology Stack

### Frontend
- **React 18.2**: Modern UI components with hooks
- **Vite**: Fast build tool and development server
- **CSS3**: Theme system with CSS custom properties (light/dark/high-contrast)

### Backend
- **Python 3.11**: Standard library HTTP server
- **SQLite**: Lightweight, file-based database
- **CORS Support**: Enables cross-origin API calls

### Additional Tools
- **XLSX**: Excel file generation and export
- **HTML2PDF**: PDF document generation
- **Playwright**: E2E testing framework
- **Docker**: Containerization for deployment

## File Structure

```
kid-progress-dashboard/
├── src/
│   ├── App.jsx              # Main React component
│   ├── App.css              # Styles with theme system
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── backend/
│   └── server.py            # Python HTTP server
├── public/
│   └── images/
│       └── amishi.jpg       # Child profile photo
├── tests/
│   └── app.spec.js          # Playwright test suite
├── index.html               # HTML entry point
├── package.json             # Node dependencies
├── vite.config.js           # Vite configuration
├── Dockerfile               # Frontend container
├── backend/Dockerfile       # Backend container
├── docker-compose.yml       # Multi-container orchestration
└── .gitignore               # Git exclusions
```

## Key Features

### 1. Theme System
- **Light Theme**: Warm, welcoming design (#d86f52 primary)
- **Dark Theme**: Cool, muted colors (#ff9d73 primary)
- **High-Contrast Theme**: Maximum accessibility (#000000 primary)

### 2. Class-Specific Content
- **Prep**: Foundation learning with playful routines
- **Class 1-12**: Progressively adapted curriculum and routines
- **Auto-adaptation**: Content updates as child progresses

### 3. Export Capabilities
- Download weekly timetables as Excel (.xlsx)
- Generate printable PDFs with professional styling
- One-click file generation with child name and class

### 4. Collaborative Features
- Parent notes with teacher comments
- Habit tracking and milestones
- Holiday calendar for school year planning

## Configuration

### Environment
- **Frontend URL**: http://localhost:5173 (dev)
- **Backend URL**: http://127.0.0.1:8000
- **Database**: `backend/progress.db` (SQLite)

### Build Commands
```bash
# Development
npm run dev              # Start dev server
./start-app.sh         # Start frontend + backend (macOS/Linux)
start-app.bat          # Start frontend + backend (Windows)

# Production
npm run build           # Build optimized frontend
docker compose up       # Run with Docker
```

## Documentation Files

- **README.md**: Quick start and feature overview
- **START_HERE.md**: Beginner's guide to setup
- **DOCKER_SETUP.md**: Container deployment guide
- **START_APP_GUIDE.md**: One-command startup scripts
- **DEPLOYMENT_READY.md**: Production deployment checklist

## Release Information

- **Latest Update**: Theme system complete, download features added, Git ready
- **Status**: Production-ready for educational use
- **License**: (To be specified)

## Contact & Support

For issues, feature requests, or questions:
- Review documentation in root directory
- Check QUICK_START_TESTING.md for testing procedures
- Refer to DOCKER_QUICK_REF.md for deployment

---

**Last Updated:** April 18, 2026  
**Project Status:** Active Development & Maintenance
