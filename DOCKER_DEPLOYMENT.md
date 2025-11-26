# Docker Deployment Guide

## Prerequisites
- Docker installed on your server
- Docker Compose installed

## Quick Start

### 1. Clone the repository to your server
```bash
git clone <your-repo-url>
cd se_gps
```

### 2. Build and run with Docker Compose
```bash
docker-compose up -d --build
```

This will:
- Build both backend and frontend images
- Start the containers
- Backend will be available on port 8000
- Frontend will be available on port 80

### 3. Access the application
- Frontend: http://your-server-ip/
- Backend API: http://your-server-ip:8000/

## Management Commands

### View logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Stop services
```bash
docker-compose down
```

### Restart services
```bash
docker-compose restart
```

### Run Django management commands
```bash
# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Run migrations
docker-compose exec backend python manage.py migrate

# Generate GPS reports
docker-compose exec backend python manage.py generate_gps_reports --date 2025-11-01
```

### Access Django shell
```bash
docker-compose exec backend python manage.py shell
```

## Production Configuration

### 1. Update Django settings for production
In `backend_gps/my_portfilio/settings.py`:
```python
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com', 'your-server-ip']
```

### 2. Use environment variables
Create `.env` file in se_gps directory:
```env
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=your-domain.com,your-server-ip
DATABASE_URL=sqlite:///db.sqlite3
```

### 3. Update CORS settings
```python
CORS_ALLOWED_ORIGINS = [
    "http://your-domain.com",
    "https://your-domain.com",
]
```

### 4. Serve with SSL (recommended)
Use nginx or traefik as reverse proxy with Let's Encrypt SSL certificates.

## Troubleshooting

### Check container status
```bash
docker-compose ps
```

### Check container logs for errors
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

### Remove all containers and volumes
```bash
docker-compose down -v
```

## Database Backup

### Backup SQLite database
```bash
docker-compose exec backend python manage.py dumpdata > backup.json
```

### Restore database
```bash
docker-compose exec backend python manage.py loaddata backup.json
```

## Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Run migrations if needed
docker-compose exec backend python manage.py migrate
```
