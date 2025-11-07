# Deployment Guide

## การ Deploy บน Vercel

### 1. Deploy Backend

```bash
# ใน backend directory
cd backend
vercel --prod
```

Environment Variables สำหรับ backend:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### 2. Deploy Frontend

```bash
# ใน frontend directory
cd frontend
vercel --prod
```

Environment Variables สำหรับ frontend:
- `NEXT_PUBLIC_API_URL` (URL ของ backend)
- `NEXT_PUBLIC_FRONTEND_URL`

## การ Deploy บน Railway

### 1. Deploy Database

```bash
# สร้าง MySQL database บน Railway
railway add mysql
```

### 2. Deploy Backend

```bash
cd backend
railway login
railway init
railway up
```

### 3. Deploy Frontend

```bash
cd frontend
railway init
railway up
```

## การ Deploy บน DigitalOcean App Platform

### 1. สร้าง App

1. เข้า DigitalOcean App Platform
2. สร้าง App ใหม่
3. เชื่อมต่อ GitHub repository

### 2. ตั้งค่า Components

#### Backend Component
- Name: `backend`
- Source Directory: `/backend`
- Build Command: `npm run build`
- Run Command: `npm start`
- HTTP Port: `3001`

#### Frontend Component
- Name: `frontend`
- Source Directory: `/frontend`
- Build Command: `npm run build`
- Run Command: `npm start`
- HTTP Port: `3000`

#### Database Component
- เลือก MySQL Managed Database

### 3. Environment Variables

ตั้งค่า environment variables ตามที่ระบุไว้ข้างต้น

## การ Deploy ด้วย Docker

### 1. สร้าง Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY frontend/package.json ./frontend/
COPY app/package.json ./app/
COPY shared/package.json ./shared/
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build applications
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built applications
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next ./frontend/.next
COPY --from=builder --chown=nextjs:nodejs /app/app/.next ./app/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000 3001

ENV PORT 3000

CMD ["npm", "start"]
```

### 2. สร้าง docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - DATABASE_URL=mysql://user:password@db:3306/elearning
      - NEXTAUTH_SECRET=your-secret-key
      - NEXTAUTH_URL=http://localhost:3001
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=elearning
      - MYSQL_USER=user
      - MYSQL_PASSWORD=password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

### 3. Deploy

```bash
docker-compose up -d
```

## การ Deploy บน VPS (Ubuntu)

### 1. ติดตั้ง Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install MySQL
sudo apt install mysql-server -y
```

### 2. Setup Database

```bash
sudo mysql_secure_installation
sudo mysql -u root -p

CREATE DATABASE e_learning_db;
CREATE USER 'elearning'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON e_learning_db.* TO 'elearning'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Deploy Application

```bash
# Clone repository
git clone https://github.com/your-username/e-learning-fb-demo.git
cd e-learning-fb-demo

# Install dependencies
npm run install:all

# Setup environment
cp .env.example .env
cp app/.env.example app/.env
cp frontend/.env.local.example frontend/.env.local

# Edit environment files with production values
nano app/.env
nano frontend/.env.local

# Run database migrations
npm run db:migrate
npm run db:seed

# Build applications
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Setup Nginx

```bash
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/elearning
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/elearning /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Setup SSL (Optional)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## PM2 Ecosystem Config

สร้างไฟล์ `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'elearning-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'elearning-backend',
      cwd: './backend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
```

## Monitoring และ Maintenance

### Health Checks

```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Restart applications
pm2 restart all

# Monitor resources
pm2 monit
```

### Database Backup

```bash
# Create backup script
nano backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u elearning -p e_learning_db > backup_$DATE.sql
```

### Auto Updates

```bash
# Create update script
nano update.sh
```

```bash
#!/bin/bash
cd /path/to/e-learning-fb-demo
git pull origin main
npm run install:all
npm run build
pm2 restart all
```