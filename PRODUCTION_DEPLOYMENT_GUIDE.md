# RMC System - Production Deployment Guide

## Overview
This guide covers deploying both the Django backend and Next.js frontend to production.

---

## BACKEND DEPLOYMENT (Django)

### 1. Environment Setup

#### Create Production .env File
```bash
cd rmc_system
# Copy and customize the .env file for production
cp .env.example .env
# Edit .env with production values
```

**Required Variables:**
```
DEBUG=False
SECRET_KEY=<generate-new-secure-key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_ENGINE=django.db.backends.postgresql
DB_NAME=rmc_system_db
DB_USER=rmc_user
DB_PASSWORD=<secure-password>
DB_HOST=<postgres-host>
DB_PORT=5432
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=<app-password>
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### 2. Generate New SECRET_KEY

```python
# Generate a new secret key:
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**⚠️ IMPORTANT:** Never use the hardcoded key from settings.py in production!

### 3. Database Migration

#### PostgreSQL Setup
```bash
# On your PostgreSQL server
createdb rmc_system_db
createuser rmc_user
ALTER USER rmc_user PASSWORD '<secure-password>';
GRANT ALL PRIVILEGES ON DATABASE rmc_system_db TO rmc_user;
```

#### Run Migrations
```bash
cd rmc_system
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Server Configuration

#### Using Gunicorn (Recommended)

**Install:**
```bash
pip install gunicorn
```

**Create gunicorn config** (`gunicorn_config.py`):
```python
import multiprocessing
import os

workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 50
preload_app = True
daemon = False
bind = ["0.0.0.0:8000"]
pidfile = "/var/run/gunicorn.pid"
umask = 0
user = None
group = None
tmp_upload_dir = None
secure_scheme_headers = {
    "PROXY_PROTOCOL": "PROXY",
    "X_FORWARDED_PROTOCOL": "x-forwarded-proto",
    "X_FORWARDED_PROTO": "x-forwarded-proto",
    "X_FORWARDED_SSL": "x-forwarded-ssl",
    "X_FORWARDED_SCHEME": "x-forwarded-scheme",
}
forwarded_allow_ips = "*"
accesslog = "/var/log/rmc_system/access.log"
errorlog = "/var/log/rmc_system/error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'
```

**Run:**
```bash
gunicorn -c gunicorn_config.py rmc_system.wsgi:application
```

#### Using Systemd Service (Recommended)

Create `/etc/systemd/system/rmc_system.service`:
```ini
[Unit]
Description=RMC System Django Application
After=network.target
Wants=postgresql.service

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/path/to/rmc_system
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/gunicorn -c gunicorn_config.py rmc_system.wsgi:application
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Enable service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable rmc_system.service
sudo systemctl start rmc_system.service
```

### 6. Nginx Reverse Proxy Configuration

Create `/etc/nginx/sites-available/rmc_system`:
```nginx
upstream django_app {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    client_max_body_size 15M;

    location /static/ {
        alias /path/to/rmc_system/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias /path/to/rmc_system/media/;
        expires 7d;
    }

    location / {
        proxy_pass http://django_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/rmc_system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL Certificate Setup (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

### 8. Backup Database

```bash
# Regular backups (add to crontab)
pg_dump -U rmc_user rmc_system_db > /backups/rmc_system_$(date +%Y%m%d_%H%M%S).sql
```

---

## FRONTEND DEPLOYMENT (Next.js)

### 1. Environment Setup

Create `.env.production` with production values:
```bash
cd rmc_frontend
cp .env.example .env.production
# Edit with production URLs
```

**Required Variables:**
```
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_ENV=production
```

### 2. Build Application

```bash
npm install
npm run build
```

### 3. Server Configuration

#### Using Nodejs with Systemd

Create `/etc/systemd/system/rmc_frontend.service`:
```ini
[Unit]
Description=RMC System Next.js Frontend
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/path/to/rmc_frontend
Environment="NODE_ENV=production"
Environment="PORT=3000"
ExecStart=/usr/bin/node /path/to/rmc_frontend/.next/standalone/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable rmc_frontend.service
sudo systemctl start rmc_frontend.service
```

#### Using PM2 (Alternative)

```bash
npm install -g pm2
pm2 start npm --name "rmc-frontend" -- start
pm2 save
pm2 startup
```

### 4. Nginx Reverse Proxy Configuration

Add to existing Nginx config:
```nginx
upstream next_app {
    server 127.0.0.1:3000;
}

server {
    # ... SSL configuration from backend setup

    # Frontend routing
    location / {
        proxy_pass http://next_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support if needed
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## Monitoring & Maintenance

### 1. Application Logs

**Django logs:**
```bash
tail -f /var/log/rmc_system/error.log
tail -f /var/log/rmc_system/access.log
```

**Frontend logs:**
```bash
pm2 logs rmc-frontend
# or journalctl if using systemd
journalctl -u rmc_frontend.service -f
```

### 2. Health Checks

Create a health check endpoint in Django:
```python
# In urls.py
path('api/health/', health_check, name='health_check')

# In views.py
from django.http import JsonResponse
from django.db import connection

def health_check(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return JsonResponse({'status': 'healthy'})
    except Exception as e:
        return JsonResponse({'status': 'unhealthy', 'error': str(e)}, status=500)
```

### 3. Monitoring Tools

Recommended tools:
- **Sentry** - Error tracking
- **DataDog** - Application monitoring
- **New Relic** - Performance monitoring
- **Prometheus** + **Grafana** - Metrics and visualization

### 4. Regular Maintenance

```bash
# Clear old logs
find /var/log/rmc_system -name "*.log" -mtime +30 -delete

# Database maintenance
python manage.py clearsessions
python manage.py optimize_images

# Security updates
sudo apt update && sudo apt upgrade -y
pip list --outdated
```

---

## Security Checklist

- [ ] Change Django SECRET_KEY
- [ ] Set DEBUG = False
- [ ] Configure ALLOWED_HOSTS
- [ ] Enable SSL/TLS
- [ ] Set CSRF_COOKIE_SECURE = True
- [ ] Set SESSION_COOKIE_SECURE = True
- [ ] Configure CORS_ALLOWED_ORIGINS (not *all*)
- [ ] Set up firewall rules
- [ ] Enable HSTS
- [ ] Configure email properly
- [ ] Set up backups
- [ ] Enable application monitoring
- [ ] Review and rotate API tokens
- [ ] Set strong database passwords
- [ ] Configure rate limiting
- [ ] Enable security headers

---

## Troubleshooting

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -h <host> -U <user> -d <database> -c "SELECT 1"
```

### Static Files Not Loading
```bash
python manage.py collectstatic --clear --noinput
sudo chown -R www-data:www-data /path/to/staticfiles
```

### 502 Bad Gateway
```bash
# Check Gunicorn status
sudo systemctl status rmc_system.service
# Check logs
sudo journalctl -u rmc_system.service -n 50
```

### CORS Issues
- Verify CORS_ALLOWED_ORIGINS includes frontend URL
- Check Accept-Language header in requests
- Ensure API URL matches NEXT_PUBLIC_API_URL

---

## Support and References

- Django Deployment: https://docs.djangoproject.com/en/5.2/howto/deployment/
- Next.js Production: https://nextjs.org/docs/going-to-production
- Gunicorn: https://gunicorn.org/
- Nginx: https://nginx.org/
- PostgreSQL: https://www.postgresql.org/docs/
