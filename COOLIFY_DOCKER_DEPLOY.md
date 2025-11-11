# DVtools - Coolify Deployment Guide

## Quick Deploy with Docker Hub

Your DVtools application is ready to deploy on Coolify using Docker Hub.

### Docker Image
- **Image**: `manojkumarlabhala/dvtools_1:latest`
- **Registry**: Docker Hub (Public)

---

## 🚀 Deployment Steps

### 1. Build and Push to Docker Hub

Run the build script:

```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

This will:
- Build the Docker image
- Tag it as `manojkumarlabhala/dvtools_1:latest`
- Push to Docker Hub
- Display the image URL

### 2. Deploy on Coolify

#### Option A: Using Docker Image (Recommended)

1. **Create New Resource** in Coolify
   - Select "Docker Image"
   - Image: `manojkumarlabhala/dvtools_1:latest`
   - Registry: Docker Hub (no auth needed for public images)

2. **Configure Environment Variables**

   Required variables:
   ```env
   # Database
   DATABASE_URL=your-database-url
   
   # Redis
   REDIS_URL=your-redis-url
   
   # NextAuth
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
   
   # Application
   NODE_ENV=production
   APP_URL=https://your-domain.com
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   
   # Admin
   ADMIN_EMAIL=admin@your-domain.com
   ADMIN_PASSWORD=strong-password-here
   
   # SEO
   SITE_NAME=DvTools
   SITE_DESCRIPTION=Professional developer tools
   SITE_URL=https://your-domain.com
   ```

3. **Configure Port**
   - Port: `3000`

4. **Set Health Check** (Optional)
   - Path: `/api/health`
   - Interval: 30s

5. **Deploy**
   - Click "Deploy"
   - Monitor logs for successful startup

#### Option B: Using Docker Compose

1. **Create New Resource** in Coolify
   - Select "Docker Compose"

2. **Paste this docker-compose.yml**:
   ```yaml
   services:
     dvtools:
       image: manojkumarlabhala/dvtools:latest
       ports:
         - "3000:3000"
       environment:
         DATABASE_URL: ${DATABASE_URL}
         REDIS_URL: ${REDIS_URL}
         NEXTAUTH_URL: ${NEXTAUTH_URL}
         NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
         NODE_ENV: production
         APP_URL: ${APP_URL}
         NEXT_PUBLIC_BASE_URL: ${APP_URL}
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
         interval: 30s
         timeout: 10s
         retries: 3
       restart: unless-stopped
   ```

3. **Configure environment variables** in Coolify UI

4. **Deploy**

---

## 🔧 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `mysql://user:pass@host:3306/db` |
| `REDIS_URL` | Redis connection string | `redis://host:6379/0` |
| `NEXTAUTH_URL` | Your app's public URL | `https://dvtools.example.com` |
| `NEXTAUTH_SECRET` | NextAuth secret (32+ chars) | Generate with `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Admin user email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin user password | Use a strong password |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | `900000` (15 min) |
| `ENABLE_ANALYTICS` | Enable analytics | `true` |
| `SMTP_HOST` | SMTP server hostname | - |
| `SMTP_PORT` | SMTP server port | `587` |

### Payment Gateway Variables (Optional)

For donation features:

```env
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_SANDBOX_MODE=false

# Razorpay
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

---

## 🔄 Update Deployment

To update your deployed app:

1. **Build and push new image**:
   ```bash
   ./build-and-push.sh v1.0.1  # Or use 'latest'
   ```

2. **Restart in Coolify**:
   - Coolify will pull the latest image
   - Restart the service

---

## 🐛 Troubleshooting

### Build Fails
- Check Docker is running: `docker info`
- Ensure you're logged in: `docker login`
- Check disk space: `df -h`

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check database is accessible from container
- Ensure SSL settings are correct

### Health Check Fails
- Check app logs in Coolify
- Verify port 3000 is exposed
- Test health endpoint: `curl http://localhost:3000/api/health`

### Prisma Migration Issues
- Database migrations run automatically on container start
- Check entrypoint.sh logs
- Manually run: `npx prisma migrate deploy`

---

## 📊 Monitoring

### Health Check Endpoint
```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "redis": "connected"
}
```

### Container Logs
View in Coolify dashboard or:
```bash
docker logs -f container-name
```

---

## 🔒 Security Checklist

- [ ] Use strong `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- [ ] Use strong `ADMIN_PASSWORD`
- [ ] Enable HTTPS in production (Coolify handles this)
- [ ] Restrict database access to app server only
- [ ] Use environment-specific Redis instances
- [ ] Enable rate limiting
- [ ] Regular security updates

---

## 📦 Local Testing

Test the Docker image locally before deploying:

```bash
# Build image
docker build -t manojkumarlabhala/dvtools:latest .

# Run locally
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e REDIS_URL="your-redis-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  manojkumarlabhala/dvtools:latest

# Test
curl http://localhost:3000/api/health
```

---

## 🆘 Support

- **Documentation**: See README.md
- **Issues**: Check application logs in Coolify
- **Database**: Verify connection and migrations
- **Cache**: Verify Redis connection

---

## 📝 Notes

- Image is built for `linux/amd64` platform
- Automatic database migrations on startup
- Health checks monitor database and Redis connectivity
- Optimized multi-stage build for smaller image size
- Non-root user for security
- Standalone Next.js output for optimal performance

---

**Ready to deploy!** 🚀

Follow the steps above to get your DVtools app running on Coolify.
