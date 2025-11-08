# 🚨 FIX: Docker Image Reference Format Error

## Problem
The error `"unable to get image 'docker push manojkumarlabhala/dvtools:v1.0.0': Error response from daemon: invalid reference format"` occurs when there's a space or invalid character in the Docker image tag.

## ✅ Solution: Correct Image Reference

**❌ Wrong format (with space):**
```
manojkumarlabhala/dvtools: v1.0.0
```

**✅ Correct format (no space):**
```
manojkumarlabhala/dvtools:v1.0.0
```

---

# Coolify Deployment Options

## Option 1: Docker Image Deployment (Recommended)

### Step 1: Verify Images on Docker Hub
```bash
# Check if images exist
curl -s https://hub.docker.com/v2/repositories/manojkumarlabhala/dvtools/tags/ | jq '.results[].name'
```

### Step 2: Deploy in Coolify

1. **Go to Coolify Dashboard**
2. **Create New Resource** → **Docker Image**
3. **Configure:**
   - **Image**: `manojkumarlabhala/dvtools:v1.0.0` ⚠️ **NO SPACE after colon**
   - **Registry**: Docker Hub (public)
   - **Port**: `3000`
   - **Health Check**: `/api/health`

4. **Environment Variables** (Required):
   ```env
   DATABASE_URL=mysql://user:password@host:3306/database
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=your-random-secret-here
   ```

5. **Deploy**

## Option 2: Docker Compose Deployment

### Step 1: Upload Files to Repository
Ensure these files are in your repository:
- `docker-compose.coolify.yml` (created)
- `Dockerfile` (exists)
- All source code

### Step 2: Deploy in Coolify

1. **Create New Resource** → **Docker Compose**
2. **Point to your repository**
3. **Select** `docker-compose.coolify.yml`
4. **Set Environment Variables** in Coolify dashboard
5. **Deploy**

---

# Environment Variables Required

## Essential (Required)
```env
# Database
DATABASE_URL=mysql://user:password@host:3306/database
DIRECT_URL=mysql://user:password@host:3306/database

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=openssl rand -base64 32

# Application
NODE_ENV=production
PORT=3000
```

## Optional (Features)
```env
# Admin Account
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password

# Payment Gateways
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

# Troubleshooting

## Error: "invalid reference format"

**Cause:** Space in image tag name
**Fix:** Ensure no spaces: `manojkumarlabhala/dvtools:v1.0.0`

## Error: "image not found"

**Cause:** Image not pushed to Docker Hub
**Fix:** Run push commands:
```bash
docker push manojkumarlabhala/dvtools:latest
docker push manojkumarlabhala/dvtools:v1.0.0
```

## Error: "port already in use"

**Cause:** Port 3000 already used
**Fix:** Change port in Coolify config or stop other service

## Error: "health check failed"

**Cause:** Application not starting properly
**Fix:** Check logs and environment variables

---

# Verification Steps

## 1. Check Image Availability
```bash
# Pull image locally
docker pull manojkumarlabhala/dvtools:v1.0.0

# Run locally for testing
docker run -p 3000:3000 -e DATABASE_URL=... manojkumarlabhala/dvtools:v1.0.0
```

## 2. Test Health Endpoint
```bash
curl https://yourdomain.com/api/health
# Expected: {"status":"healthy","database":"connected"}
```

## 3. Test Application Pages
```bash
curl https://yourdomain.com/
curl https://yourdomain.com/tools
curl https://yourdomain.com/api/health
```

---

# Current Status

✅ **Images built and pushed successfully**
- `manojkumarlabhala/dvtools:latest`
- `manojkumarlabhala/dvtools:v1.0.0`
- Size: 563MB each
- Available on Docker Hub

✅ **Configuration files created**
- `docker-compose.coolify.yml` (corrected)
- `DOCKER_DEPLOYMENT_COMPLETE.md`

🚀 **Ready for deployment!**

Use **Option 1 (Docker Image)** for the simplest deployment, or **Option 2 (Docker Compose)** if you need more control.