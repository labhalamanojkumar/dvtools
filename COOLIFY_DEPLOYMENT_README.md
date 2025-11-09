# DVtools - Coolify VPS Deployment Guide

## 🚀 Quick Deployment to Coolify VPS

This guide will help you deploy DVtools to a Coolify VPS instance using Docker.

### Prerequisites
- Coolify instance running on your VPS
- Domain name (optional but recommended)
- Docker Hub account (for pre-built images)

---

## 📋 Deployment Options

### Option 1: Using Pre-built Docker Image (Recommended)

#### Step 1: Deploy from Docker Hub
1. Go to your Coolify dashboard
2. Click **"New Resource"** → **"Docker Image"**
3. Configure:
   ```
   Registry: Docker Hub
   Image: manojkumarlabhala/dvtools:latest
   Tag: latest
   ```
4. Click **"Deploy"**

#### Step 2: Configure Environment Variables
Add these environment variables in Coolify:

```env
# Database (Required)
DATABASE_URL=mysql://user:password@host:port/database_name
DATABASE_PROVIDER=mysql

# NextAuth (Required)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secure-secret-here

# Application (Required)
NODE_ENV=production
APP_URL=https://yourdomain.com

# Admin Account (Required)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password-here

# Optional Features
ENABLE_ANALYTICS=false
RUN_MIGRATIONS=true
SITE_NAME=DvTools
SITE_DESCRIPTION=Professional developer tools
```

#### Step 3: Configure Database
1. In Coolify, create a new MySQL or PostgreSQL database
2. Use the connection URL as `DATABASE_URL`
3. Set `DATABASE_PROVIDER` to `mysql` or `postgresql`

---

### Option 2: Using Docker Compose

#### Step 1: Upload Files
1. Upload `docker-compose.coolify.yml` to Coolify
2. Coolify will automatically detect and use it

#### Step 2: Configure Environment Variables
Same as Option 1 above.

---

### Option 3: Build from Source

#### Step 1: Deploy from Git Repository
1. Go to Coolify dashboard → **"New Resource"** → **"Git Repository"**
2. Enter repository URL
3. Branch: `main` (or your deployment branch)
4. Build Pack: **Dockerfile**

#### Step 2: Environment Variables
Same as Option 1 above.

---

## 🔧 Environment Variables Reference

### Required Variables
```env
DATABASE_URL=mysql://user:password@host:port/db
DATABASE_PROVIDER=mysql
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=openssl rand -base64 32
NODE_ENV=production
APP_URL=https://yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password
```

### Optional Variables
```env
# Redis (for caching)
REDIS_URL=redis://host:port

# Payment Gateways
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-password

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

---

## 🗄️ Database Setup

### MySQL Database (Recommended)
1. Create MySQL database in Coolify
2. Use connection string: `mysql://user:pass@host:port/db`
3. Set `DATABASE_PROVIDER=mysql`

### PostgreSQL Database
1. Create PostgreSQL database in Coolify
2. Use connection string: `postgresql://user:pass@host:port/db`
3. Set `DATABASE_PROVIDER=postgresql`

---

## 🌐 Domain Configuration

1. In Coolify, go to your service settings
2. Add your domain in the **"Domains"** section
3. Update DNS records to point to your Coolify instance
4. Update `NEXTAUTH_URL` and `APP_URL` with your domain

---

## 🔍 Health Checks & Monitoring

The application includes:
- Health check endpoint: `/api/health`
- Automatic database migration on startup
- Resource limits configured for VPS

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
- Check `DATABASE_URL` format
- Ensure database is running
- Verify credentials

#### 2. Build Failures
- Check Docker image availability
- Verify environment variables
- Check build logs in Coolify

#### 3. Application Won't Start
- Check health endpoint: `https://yourdomain.com/api/health`
- Verify all required environment variables
- Check Coolify logs

---

## 📊 Post-Deployment

1. **Access Admin Panel**: `https://yourdomain.com/admin`
2. **Test Features**: Try different tools
3. **Configure Payments**: Set up payment gateways if needed
4. **Monitor Logs**: Check Coolify logs for issues

---

## 🔄 Updates

To update the application:
1. Pull latest changes from repository
2. Coolify will automatically rebuild and deploy
3. Or update the Docker image tag if using pre-built images

---

## 📞 Support

If you encounter issues:
1. Check Coolify logs
2. Verify environment variables
3. Test database connection
4. Check health endpoint

Happy deploying! 🎉