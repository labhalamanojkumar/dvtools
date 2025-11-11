# Coolify VPS Deployment Guide for DvTools

## ⚠️ CRITICAL: Read Before Deployment

### Common Issues & Solutions

**1. News Articles Not Showing After Deployment:**
- **Cause:** Using SQLite (`file:./prisma/dev.db`) instead of MySQL
- **Solution:** Set correct `DATABASE_URL` in Coolify (see Environment Variables section)

**2. Images Not Displaying/Upload Fails:**
- **Cause:** No persistent storage volume
- **Solution:** Already configured with `dvtools_uploads` volume mount

**3. Posts Created But Not Visible:**
- **Cause:** Post status is DRAFT or future `publishedAt` date
- **Solution:** Set status to PUBLISHED and current/past date

📖 **See `DEPLOYMENT_TROUBLESHOOTING.md` for detailed troubleshooting**

---

## Prerequisites

- Coolify installed on your VPS
- Domain name configured (optional but recommended)
- Git repository access (GitHub/GitLab)

## Quick Deployment Steps

### 1. Create New Application in Coolify

1. Log into your Coolify dashboard
2. Click **"+ New"** → **"Application"**
3. Select **"Docker Compose"** as the build pack
4. Connect your Git repository: `https://github.com/labhalamanojkumar/DvTools.git`
5. Select branch: `fix/image-optimizer-server-and-ui` (or `main`)

### 2. Configure Build Settings

**Build Pack**: Docker Compose  
**Docker Compose File**: `docker-compose.coolify.yml`  
**Port**: `3000`  
**Health Check Path**: `/api/health`

### 3. Environment Variables Configuration

Add these **required** environment variables in Coolify:

```bash
# Database (Required) - Use Coolify's database service
# ⚠️ CRITICAL: Do NOT use SQLite (file:./prisma/dev.db) in production
# It will NOT persist data in Docker containers
DATABASE_URL=mysql://username:password@mysql:3306/dvtools
DATABASE_PROVIDER=mysql

# NextAuth (Required) - Generate with: openssl rand -base64 32
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-generated-secret-here

# Application URLs (Required)
APP_URL=https://your-domain.com
SITE_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Admin Account (Required)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!

# Application Settings
NODE_ENV=production
SITE_NAME=DvTools
SITE_DESCRIPTION=Professional developer tools platform
RUN_MIGRATIONS=true
```

### 4. Optional Environment Variables

```bash
# Redis (for caching)
REDIS_URL=redis://redis:6379

# Analytics
ENABLE_ANALYTICS=true

# Performance
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
LOG_LEVEL=info

# Payment Gateways (if needed)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

# OAuth Providers (if needed)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### 5. Database Setup (MySQL Recommended)

**Option A: Use Coolify's MySQL Service**
1. Create a new MySQL database service in Coolify
2. Copy the connection URL
3. Use it as `DATABASE_URL`

**Option B: External Database**
```bash
DATABASE_URL="mysql://user:password@host:port/database?sslaccept=accept_invalid_certs"
```

**Option C: PostgreSQL**
```bash
DATABASE_URL="postgresql://user:password@host:port/database?sslaccept=accept_invalid_certs"
DATABASE_PROVIDER=postgresql
```

### 6. Domain Configuration

1. In Coolify, go to **"Domains"** section
2. Add your domain: `dvtools.yourdomain.com`
3. Enable **SSL/TLS** (Let's Encrypt)
4. Update `NEXTAUTH_URL` and `APP_URL` to match your domain

### 7. Deploy

Click **"Deploy"** button in Coolify. The deployment process will:

1. ✅ Pull latest code from repository
2. ✅ Build Docker image
3. ✅ Run database migrations
4. ✅ Generate Prisma client
5. ✅ Start the application
6. ✅ Health check verification

Deployment usually takes **3-5 minutes**.

## Post-Deployment

### Verify Deployment

1. **Health Check**: `https://your-domain.com/api/health`
2. **Home Page**: `https://your-domain.com`
3. **Admin Panel**: `https://your-domain.com/admin`

### Create Admin User

If auto-creation fails, SSH into your container:

```bash
# In Coolify terminal
npx prisma db seed
```

Or manually create admin through the API.

### Check Logs

In Coolify dashboard:
- Click on your application
- Go to **"Logs"** tab
- Filter by date/severity

## Resource Requirements

### Minimum (Small VPS)
- **CPU**: 1 core
- **RAM**: 1GB
- **Disk**: 10GB
- **Bandwidth**: 1TB/month

### Recommended (Production)
- **CPU**: 2 cores
- **RAM**: 2GB
- **Disk**: 20GB SSD
- **Bandwidth**: 2TB/month

### Coolify Resource Limits
Already configured in `docker-compose.coolify.yml`:
```yaml
resources:
  limits:
    cpus: '1.0'
    memory: 1G
  reservations:
    cpus: '0.5'
    memory: 512M
```

## Troubleshooting

### Build Fails

**Issue**: Build timeout or memory issues  
**Solution**: Increase Docker build resources in Coolify settings

```bash
# Check build logs
docker logs dvtools-app --tail 100
```

### Database Connection Error

**Issue**: Cannot connect to database  
**Solution**: 
1. Verify `DATABASE_URL` is correct
2. Check database service is running
3. Ensure network connectivity between services

```bash
# Test database connection
npx prisma db push --skip-generate
```

### Application Not Starting

**Issue**: Container exits immediately  
**Solution**:
1. Check logs: `docker logs dvtools-app`
2. Verify all required environment variables are set
3. Check `NEXTAUTH_SECRET` is properly generated

### Migration Errors

**Issue**: Prisma migrations fail  
**Solution**:
```bash
# Reset migrations (development only)
npx prisma migrate reset --force

# Or skip migrations temporarily
RUN_MIGRATIONS=false
```

### Port Already in Use

**Issue**: Port 3000 conflict  
**Solution**: Change port in Coolify settings:
```bash
PORT=3001
```

### SSL Certificate Issues

**Issue**: Let's Encrypt certificate not generated  
**Solution**:
1. Verify domain DNS points to server IP
2. Wait 5-10 minutes for DNS propagation
3. Force certificate renewal in Coolify

## Advanced Configuration

### Custom Docker Image

If you want to use a pre-built image:

1. Build and push image:
```bash
docker build -t your-registry/dvtools:latest .
docker push your-registry/dvtools:latest
```

2. In `docker-compose.coolify.yml`, replace:
```yaml
# Comment out build section
# build:
#   context: .
#   dockerfile: Dockerfile

# Use pre-built image
image: your-registry/dvtools:latest
```

### Enable Redis Caching

1. Add Redis service in Coolify
2. Set `REDIS_URL` environment variable
3. Redeploy application

### Monitoring & Alerts

In Coolify:
1. Enable **"Monitoring"**
2. Set up **webhook notifications** for deployments
3. Configure **health check alerts**

### Backup Strategy

**Database Backup**:
```bash
# Automated daily backup
docker exec dvtools-app npx prisma db pull > backup-$(date +%Y%m%d).sql
```

**Application Data**:
- Coolify automatically backs up volumes
- Additional backups: `/app/data` and `/app/logs` volumes

### Scaling

**Horizontal Scaling**:
1. Use Coolify's load balancer
2. Deploy multiple instances
3. Share database across instances

**Vertical Scaling**:
Update resource limits in `docker-compose.coolify.yml`:
```yaml
resources:
  limits:
    cpus: '2.0'
    memory: 2G
```

## Environment-Specific Configurations

### Development
```bash
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_ANALYTICS=false
```

### Staging
```bash
NODE_ENV=production
LOG_LEVEL=info
ENABLE_ANALYTICS=true
SITE_NAME=DvTools Staging
```

### Production
```bash
NODE_ENV=production
LOG_LEVEL=warn
ENABLE_ANALYTICS=true
RATE_LIMIT_MAX_REQUESTS=100
```

## Security Checklist

- [ ] Strong `NEXTAUTH_SECRET` generated
- [ ] Admin password changed from default
- [ ] Database credentials secured
- [ ] SSL/TLS enabled
- [ ] Environment variables encrypted in Coolify
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers enabled
- [ ] Regular updates scheduled

## Performance Optimization

### Enable Caching
```bash
REDIS_URL=redis://redis:6379
```

### CDN Integration
Configure Coolify reverse proxy for static assets

### Database Optimization
```bash
# In Prisma schema
connectionLimit = 10
poolTimeout = 30
```

### Build Optimization
Already configured in Dockerfile:
- Multi-stage builds
- Layer caching
- Production-only dependencies

## Maintenance

### Update Application

**Automatic** (Recommended):
1. Enable **auto-deploy** in Coolify
2. Coolify monitors Git repository
3. Deploys on new commits

**Manual**:
1. Click **"Redeploy"** in Coolify
2. Select commit/branch
3. Deploy

### Database Migrations

```bash
# Run new migrations
npx prisma migrate deploy

# View migration status
npx prisma migrate status
```

### View Application Logs

```bash
# In Coolify terminal
docker logs dvtools-app -f --tail 100

# Application logs
tail -f /app/logs/*.log
```

## Support & Documentation

- **Repository**: https://github.com/labhalamanojkumar/DvTools
- **Issues**: GitHub Issues
- **Coolify Docs**: https://coolify.io/docs
- **Next.js Docs**: https://nextjs.org/docs

## Quick Commands Reference

```bash
# Check application status
docker ps | grep dvtools

# View logs
docker logs dvtools-app --tail 50

# Restart application
docker restart dvtools-app

# Execute commands in container
docker exec -it dvtools-app sh

# Database migrations
docker exec -it dvtools-app npx prisma migrate deploy

# Generate Prisma client
docker exec -it dvtools-app npx prisma generate

# Check health
curl https://your-domain.com/api/health
```

## Success Indicators

✅ Build completes without errors  
✅ Health check returns 200  
✅ Homepage loads with styling  
✅ Admin panel accessible  
✅ Database connection successful  
✅ SSL certificate active  
✅ All tools functional  

## Next Steps After Deployment

1. ✅ Test all developer tools
2. ✅ Configure payment gateways (if needed)
3. ✅ Set up analytics tracking
4. ✅ Configure email notifications
5. ✅ Add custom domain
6. ✅ Enable monitoring & alerts
7. ✅ Set up backup schedule
8. ✅ Configure CDN (optional)
9. ✅ Run security audit
10. ✅ Performance testing

---

**Deployment Status**: Ready for Production ✨

For issues or questions, create an issue on GitHub or check Coolify logs.
