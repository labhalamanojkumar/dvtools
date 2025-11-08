# DvTools - Production Deployment Guide

## ✅ Pre-Deployment Checklist

### Build Verification
- [x] Next.js production build successful (301 pages generated)
- [x] TypeScript compilation passed
- [x] All API routes optimized with `force-dynamic`
- [x] Docker configuration validated
- [x] docker-compose.coolify.yml ready

### Configuration Files
- [x] `.env.production` configured
- [x] `Dockerfile` optimized (Node 20, multi-stage)
- [x] `docker-compose.coolify.yml` with Coolify labels
- [x] `entrypoint.sh` for migrations
- [x] Health check endpoint: `/api/health`

## 🚀 Deployment Steps

### 1. Push Docker Image to Docker Hub

```bash
# Login to Docker Hub
docker login

# Build the image (if not already built)
docker build -t manojkumarlabhala/dvtools:latest .

# Tag with version
docker tag manojkumarlabhala/dvtools:latest manojkumarlabhala/dvtools:v1.0.0

# Push to Docker Hub
docker push manojkumarlabhala/dvtools:latest
docker push manojkumarlabhala/dvtools:v1.0.0
```

### 2. Deploy to Coolify VPS

#### Option A: Using Docker Compose (Recommended)

1. **Upload docker-compose.coolify.yml to your VPS**
   ```bash
   scp docker-compose.coolify.yml user@your-vps:/path/to/deployment/
   ```

2. **Set up environment variables on Coolify**
   - Navigate to your Coolify dashboard
   - Create new service from Docker Compose
   - Upload `docker-compose.coolify.yml`
   - Configure environment variables:
     ```
     DATABASE_URL=your_database_url
     NEXTAUTH_SECRET=your_secret_key
     NEXTAUTH_URL=https://your-domain.com
     STRIPE_SECRET_KEY=your_stripe_key
     ```

3. **Deploy**
   ```bash
   cd /path/to/deployment
   docker-compose -f docker-compose.coolify.yml up -d
   ```

#### Option B: Using Coolify UI

1. Create new service in Coolify
2. Select "Docker Image"
3. Enter image: `manojkumarlabhala/dvtools:latest`
4. Configure:
   - Port: 3000
   - Health check: `/api/health`
   - Volumes:
     - `dvtools_data:/app/data`
     - `dvtools_logs:/app/logs`
5. Set environment variables
6. Deploy

### 3. Post-Deployment Verification

Check the following endpoints:

```bash
# Health check
curl https://your-domain.com/api/health

# Main page
curl https://your-domain.com

# Admin panel (requires auth)
https://your-domain.com/admin
```

### 4. Database Setup

The entrypoint script automatically runs:
```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db push --accept-data-loss
```

If you need to manually initialize:
```bash
docker exec -it dvtools-app sh
npx prisma migrate deploy
npx prisma generate
```

## 🔧 Configuration Details

### Environment Variables Required

```env
# Database
DATABASE_URL=mysql://user:pass@host:3306/dbname

# NextAuth
NEXTAUTH_SECRET=generate-random-secret-here
NEXTAUTH_URL=https://your-domain.com

# Payment (Optional)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Docker Compose Configuration

The `docker-compose.coolify.yml` includes:
- **Service**: DvTools app on port 3000
- **Health Check**: Checks `/api/health` every 30s
- **Volumes**: Persistent data and logs
- **Resources**: CPU limit 1 core, Memory 1GB
- **Network**: External Coolify network
- **Labels**: Coolify-specific metadata

### Volumes

- `dvtools_data`: Application data storage
- `dvtools_logs`: Application logs

## 📊 Monitoring

### Health Check Endpoint

```bash
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-08T...",
  "database": "connected",
  "uptime": 12345
}
```

### Container Logs

```bash
# View logs
docker logs dvtools-app -f

# Last 100 lines
docker logs dvtools-app --tail 100
```

### Resource Usage

```bash
# Check container stats
docker stats dvtools-app

# Check disk usage
docker system df
```

## 🔒 Security Checklist

- [ ] HTTPS enabled (handled by Coolify)
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Security headers configured (in next.config.mjs)

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs dvtools-app

# Check container status
docker ps -a | grep dvtools

# Restart container
docker restart dvtools-app
```

### Database Connection Issues

```bash
# Test database connection
docker exec dvtools-app npx prisma db execute --stdin <<< "SELECT 1"

# Check DATABASE_URL
docker exec dvtools-app printenv DATABASE_URL
```

### Build Failures

```bash
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker build --no-cache -t manojkumarlabhala/dvtools:latest .
```

### Memory Issues

If the container is using too much memory:
1. Increase memory limit in docker-compose.yml
2. Optimize Next.js build with `NODE_OPTIONS=--max-old-space-size=2048`

## 📈 Scaling

### Horizontal Scaling

To run multiple instances:

```yaml
deploy:
  replicas: 3
  update_config:
    parallelism: 1
    delay: 10s
```

### Load Balancing

Coolify automatically handles load balancing across replicas.

## 🔄 Updates & Rollbacks

### Update to New Version

```bash
# Pull latest image
docker pull manojkumarlabhala/dvtools:latest

# Restart with new image
docker-compose -f docker-compose.coolify.yml up -d
```

### Rollback

```bash
# Use previous version
docker pull manojkumarlabhala/dvtools:v1.0.0
docker-compose -f docker-compose.coolify.yml up -d
```

## 📝 Maintenance

### Backup

```bash
# Backup volumes
docker run --rm -v dvtools_data:/data -v $(pwd):/backup alpine tar czf /backup/dvtools-data-backup.tar.gz /data

# Backup database
docker exec dvtools-app npx prisma db execute --stdin <<< "BACKUP DATABASE"
```

### Cleanup

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

## 🎯 Performance Optimization

1. **CDN**: Use Cloudflare or similar for static assets
2. **Caching**: Redis for session and API caching
3. **Database**: Connection pooling configured in Prisma
4. **Compression**: Gzip enabled in production

## 📞 Support

- GitHub Issues: https://github.com/your-repo/issues
- Documentation: https://your-domain.com/docs
- Health Status: https://your-domain.com/api/health

---

**Last Updated**: November 8, 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready
