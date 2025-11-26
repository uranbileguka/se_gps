# Deployment to fleet.uranbileg.dev

## Prerequisites
- Server with Docker and Docker Compose installed
- Domain `fleet.uranbileg.dev` pointing to your server IP
- Ports 80, 443, and 8000 open on your firewall

## Deployment Steps

### 1. Connect to your server
```bash
ssh your-user@your-server-ip
```

### 2. Install Docker and Docker Compose (if not already installed)
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt update
sudo apt install docker-compose -y

# Add your user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 3. Clone the repository
```bash
cd /opt  # or your preferred directory
git clone https://github.com/uranbileguka/se_gps.git
cd se_gps
```

### 4. Build and start the application
```bash
docker-compose up -d --build
```

This will:
- Build the backend (Django) container on port 8000
- Build the frontend (React + Nginx) container on port 80
- Automatically run migrations
- Start both services

### 5. Check services are running
```bash
docker-compose ps
```

You should see:
```
NAME              IMAGE                  STATUS
gps_backend       se_gps_backend        Up
gps_frontend      se_gps_frontend       Up
```

### 6. View logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

## Access Your Application

- **Frontend (Main App)**: http://fleet.uranbileg.dev/
- **Backend API (Direct)**: http://fleet.uranbileg.dev:8000/
- **Django Admin**: http://fleet.uranbileg.dev:8000/admin/

## API Endpoints Available

Via Frontend Proxy (through port 80):
- http://fleet.uranbileg.dev/pages/api/
- http://fleet.uranbileg.dev/navixy/api/
- http://fleet.uranbileg.dev/admin/

Direct Backend Access (port 8000):
- http://fleet.uranbileg.dev:8000/pages/api/
- http://fleet.uranbileg.dev:8000/navixy/api/
- http://fleet.uranbileg.dev:8000/admin/

## Initial Setup

### Create Django superuser
```bash
docker-compose exec backend python manage.py createsuperuser
```

### Create test user (for login)
```bash
docker-compose exec backend python manage.py shell << 'EOF'
from django.contrib.auth.models import User
user, created = User.objects.get_or_create(username='testuser', email='test@test.com')
user.set_password('testpass123')
user.save()
print(f"User created: {user.username}")
EOF
```

### Generate GPS reports
```bash
docker-compose exec backend python manage.py generate_gps_reports --date 2025-11-01
```

## SSL Certificate Setup (Recommended for Production)

### Option 1: Using Certbot with Docker

1. Install certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

2. Stop nginx container temporarily:
```bash
docker-compose stop frontend
```

3. Get SSL certificate:
```bash
sudo certbot certonly --standalone -d fleet.uranbileg.dev
```

4. Update nginx.conf to use SSL (see SSL configuration below)

5. Restart containers:
```bash
docker-compose up -d
```

### SSL Nginx Configuration

Update `frontend_gps/nginx.conf`:
```nginx
server {
    listen 80;
    server_name fleet.uranbileg.dev;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name fleet.uranbileg.dev;

    ssl_certificate /etc/letsencrypt/live/fleet.uranbileg.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fleet.uranbileg.dev/privkey.pem;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # ... rest of proxy configurations
}
```

Then mount SSL certificates in docker-compose.yml:
```yaml
frontend:
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro
```

## Firewall Configuration

Make sure these ports are open:
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8000/tcp
sudo ufw enable
```

## Maintenance Commands

### Update application
```bash
cd /opt/se_gps
git pull origin main
docker-compose up -d --build
```

### View container status
```bash
docker-compose ps
```

### Restart services
```bash
docker-compose restart
```

### Stop services
```bash
docker-compose down
```

### View resource usage
```bash
docker stats
```

### Backup database
```bash
docker-compose exec backend python manage.py dumpdata > backup_$(date +%Y%m%d).json
```

### Restore database
```bash
cat backup_20251125.json | docker-compose exec -T backend python manage.py loaddata --format=json -
```

## Troubleshooting

### Check if containers are running
```bash
docker-compose ps
```

### Check container logs
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Restart a specific service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Access backend shell
```bash
docker-compose exec backend python manage.py shell
```

### Test backend connectivity
```bash
curl http://fleet.uranbileg.dev:8000/admin/
curl http://fleet.uranbileg.dev:8000/pages/api/
```

### Check nginx configuration
```bash
docker-compose exec frontend nginx -t
```

## Production Checklist

- [ ] Set DEBUG=False in settings.py
- [ ] Configure proper SECRET_KEY
- [ ] Setup SSL certificate
- [ ] Configure firewall
- [ ] Setup automatic backups
- [ ] Configure log rotation
- [ ] Setup monitoring (optional)
- [ ] Configure email settings for Django
- [ ] Setup domain DNS properly
- [ ] Test all API endpoints
- [ ] Create superuser account

## Login Credentials

Default test user:
- Email: test@test.com
- Password: testpass123

You can create more users via Django admin or the register endpoint.
