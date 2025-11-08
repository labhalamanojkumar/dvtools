# 🚨 CRITICAL: Coolify Deployment Fix

## The Problem
Coolify is trying to run: `docker push manojkumarlabhala/dvtools:v1.0.0` during deployment, which is **WRONG**.

**This command should NEVER run during deployment!** Coolify should be **pulling** the image, not pushing it.

## Root Cause Analysis

The error `"unable to get image 'docker push manojkumarlabhala/dvtools:v1.0.0'"` indicates:

1. **Wrong deployment mode**: Coolify thinks it's building/pushing instead of pulling
2. **Configuration error**: Image reference has a space or invalid format
3. **Registry misunderstanding**: Coolify is confused about Docker Hub vs local build

## ✅ VERIFIED: Images are Available

```bash
✅ docker pull manojkumarlabhala/dvtools:v1.0.0  # WORKS
✅ docker pull manojkumarlabhala/dvtools:latest  # WORKS
✅ Images exist on Docker Hub: https://hub.docker.com/r/manojkumarlabhala/dvtools
```

---

# 🔧 FIXES (Try in Order)

## Fix 1: Correct Coolify Configuration

### Step 1: Delete Failed Deployment
- Go to Coolify dashboard
- **Delete** the failed deployment completely
- Wait 2-3 minutes

### Step 2: Create Fresh Docker Image Deployment

1. **New Resource** → **Docker Image** (NOT Docker Compose!)
2. **Image Configuration:**
   ```
   Registry: Docker Hub
   Image: manojkumarlabhala/dvtools:v1.0.0
   Tag: v1.0.0
   ```
   ⚠️ **NO spaces, NO extra characters**

3. **Advanced Settings:**
   ```
   Port: 3000
   Health Check: /api/health
   Pull Strategy: Always
   ```

4. **Environment Variables** (add these):
   ```env
   DATABASE_URL=mysql://user:pass@host:3306/db
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=your-secret-here
   NODE_ENV=production
   ```

5. **Deploy**

## Fix 2: If Fix 1 Doesn't Work - Use Docker Compose

### Step 1: Upload Files to Repository
Ensure your repository contains:
- ✅ `docker-compose.coolify.yml` (we created this)
- ✅ All source files

### Step 2: Deploy as Docker Compose

1. **New Resource** → **Docker Compose**
2. **Repository:** Your Git repository
3. **Compose File:** `docker-compose.coolify.yml`
4. **Environment Variables:** Set in Coolify UI
5. **Deploy**

## Fix 3: Manual Docker Commands (If Coolify Still Fails)

If Coolify continues to fail, deploy manually:

```bash
# 1. Pull and run locally first
docker pull manojkumarlabhala/dvtools:v1.0.0
docker run -d -p 3000:3000 --name dvtools \
  -e DATABASE_URL="your-db-url" \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  -e NEXTAUTH_SECRET="your-secret" \
  manojkumarlabhala/dvtools:v1.0.0

# 2. Test locally
curl http://localhost:3000/api/health

# 3. If works, the image is fine - Coolify config is the problem
```

---

# 🔍 DIAGNOSIS CHECKLIST

## Is the Image Available?
```bash
✅ docker pull manojkumarlabhala/dvtools:v1.0.0  # Should work
✅ docker images | grep dvtools                   # Should show image
```

## Is Coolify Configured Correctly?
- ❌ **Don't use:** Build from source
- ❌ **Don't use:** Custom Dockerfile
- ✅ **Use:** Docker Image from Docker Hub

## Common Coolify Mistakes

### ❌ WRONG: Build Configuration
```
Type: Dockerfile
Context: .
Dockerfile: Dockerfile
```

### ✅ CORRECT: Image Configuration
```
Type: Docker Image
Registry: Docker Hub
Image: manojkumarlabhala/dvtools:v1.0.0
```

---

# 🚀 QUICK DEPLOYMENT (If All Else Fails)

## Option A: Use Latest Tag
Try `manojkumarlabhala/dvtools:latest` instead of `v1.0.0`

## Option B: Manual Deploy Script

Create a deployment script:

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying DVtools..."

# Pull latest image
docker pull manojkumarlabhala/dvtools:v1.0.0

# Stop existing container
docker stop dvtools || true
docker rm dvtools || true

# Run new container
docker run -d \
  --name dvtools \
  -p 3000:3000 \
  -e DATABASE_URL="$DATABASE_URL" \
  -e NEXTAUTH_URL="$NEXTAUTH_URL" \
  -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  --restart unless-stopped \
  manojkumarlabhala/dvtools:v1.0.0

echo "✅ Deployment complete!"
echo "🌐 Visit: http://localhost:3000"
```

---

# 📞 SUPPORT CHECKLIST

## Before Contacting Support

1. **Verify image exists:**
   ```bash
   docker pull manojkumarlabhala/dvtools:v1.0.0
   echo "Exit code: $?"
   ```

2. **Check Coolify logs:**
   - Go to deployment logs
   - Look for the exact error
   - Share the full error log

3. **Test with different tag:**
   ```bash
   docker pull manojkumarlabhala/dvtools:latest
   ```

## If Still Failing

**The issue is 100% Coolify configuration, not the Docker image.**

Possible causes:
- Coolify version issue
- Registry authentication problem
- Port conflict
- Environment variable format issue

---

# 🎯 FINAL VERIFICATION

Run this to confirm everything works:

```bash
# Test image pull
docker pull manojkumarlabhala/dvtools:v1.0.0 && echo "✅ Image OK"

# Test basic run
docker run --rm manojkumarlabhala/dvtools:v1.0.0 echo "✅ Container OK"

# Check image info
docker inspect manojkumarlabhala/dvtools:v1.0.0 | grep -A 5 "Config" | head -10
```

**Expected output:**
```
✅ Image OK
✅ Container OK
    "Entrypoint": [
        "/app/entrypoint.sh"
    ],
```

---

# 📋 SUMMARY

**Status:** ✅ **Images are perfect and available**
**Problem:** Coolify deployment configuration
**Solution:** Use Docker Image deployment mode, not build mode

**Next Steps:**
1. Delete failed deployment
2. Create new Docker Image resource
3. Use exact image name: `manojkumarlabhala/dvtools:v1.0.0`
4. Set environment variables
5. Deploy

**If still failing:** The issue is Coolify-specific, not your application. Consider manual deployment or contact Coolify support with the exact error logs.