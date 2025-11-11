# 🐳 Docker Deployment with Coolify

## Quick Start

This application is fully configured and ready for deployment on Coolify VPS via Docker.

## Prerequisites

- ✅ Coolify installed on VPS
- ✅ Git repository access
- ✅ Domain name (optional)
- ✅ Database (MySQL/PostgreSQL)

## One-Click Deploy

1. **Create App in Coolify**
   - Select: Docker Compose
   - Repository: `https://github.com/labhalamanojkumar/DvTools.git`
   - Compose file: `docker-compose.coolify.yml`

2. **Set Environment Variables**
   ```bash
   DATABASE_URL=mysql://user:pass@host:3306/db
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=your-secret-here
   APP_URL=https://your-domain.com
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=SecurePass123!
   ```

3. **Deploy** 🚀

## Documentation

- 📖 **Full Guide**: [COOLIFY_DEPLOYMENT_GUIDE.md](./COOLIFY_DEPLOYMENT_GUIDE.md)
- 🔧 **Environment Template**: [.env.production.template](./.env.production.template)

## Pre-Deployment Check

### Linux/Mac:
```bash
chmod +x prepare-coolify-deploy.sh
./prepare-coolify-deploy.sh
```

### Windows:
```cmd
prepare-coolify-deploy.bat
```

## What's Included

✅ **Multi-stage Docker build** - Optimized for size and speed  
✅ **Health checks** - Automatic container monitoring  
✅ **Database migrations** - Auto-run on startup  
✅ **Security** - Non-root user, minimal attack surface  
✅ **Resource limits** - CPU and memory constraints  
✅ **Volume persistence** - Data and logs preserved  
✅ **Coolify labels** - Automatic service discovery  

## Architecture

```
┌─────────────────────────────────────┐
│          Coolify VPS                │
│  ┌───────────────────────────────┐  │
│  │     DvTools Container         │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │   Next.js App (Port 3000)│  │  │
│  │  │   + Prisma ORM          │  │  │
│  │  │   + Health Check        │  │  │
│  │  └─────────────────────────┘  │  │
│  │           ↓                   │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │   MySQL/PostgreSQL      │  │  │
│  │  └─────────────────────────┘  │  │
│  │           ↓                   │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │   Redis (Optional)      │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
│              ↓                      │
│  ┌───────────────────────────────┐  │
│  │   Coolify Reverse Proxy       │  │
│  │   + SSL/TLS (Let's Encrypt)   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Resource Requirements

| Tier | CPU | RAM | Storage |
|------|-----|-----|---------|
| **Minimum** | 1 core | 1GB | 10GB |
| **Recommended** | 2 cores | 2GB | 20GB |
| **Production** | 4 cores | 4GB | 50GB |

## Build Time

- First build: **5-7 minutes**
- Subsequent builds: **2-3 minutes** (with cache)

## Monitoring

Built-in health check endpoint:
```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-11T10:30:00.000Z",
  "database": "connected",
  "version": "1.0.0"
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check build logs in Coolify |
| Database error | Verify `DATABASE_URL` |
| App not starting | Check `NEXTAUTH_SECRET` is set |
| Port conflict | Change `PORT` in Coolify |
| SSL not working | Wait for DNS propagation (5-10 min) |

## Security Features

- ✅ Non-root container user
- ✅ Read-only file system (where possible)
- ✅ No secrets in image
- ✅ Automatic security updates
- ✅ Rate limiting enabled
- ✅ HTTPS enforced
- ✅ Environment variables encrypted

## Performance Optimizations

- ✅ Multi-stage Docker build
- ✅ Layer caching
- ✅ Production dependencies only
- ✅ Next.js standalone output
- ✅ Static page generation
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Redis caching (optional)

## Updates & Maintenance

**Auto-Deploy** (Recommended):
Enable in Coolify → App Settings → Auto Deploy

**Manual Deploy**:
1. Push code to repository
2. Click "Redeploy" in Coolify

**Database Migrations**:
Automatic on container start (via `entrypoint.sh`)

## Backup Strategy

**Automatic**:
- Coolify backs up volumes
- Database snapshots (if using Coolify DB)

**Manual**:
```bash
# Backup database
docker exec dvtools-app npx prisma db pull > backup.sql

# Backup uploads/data
docker cp dvtools-app:/app/data ./backup-data
```

## Scaling

**Horizontal** (Multiple Instances):
1. Deploy additional containers
2. Configure Coolify load balancer
3. Share database across instances

**Vertical** (More Resources):
Update in `docker-compose.coolify.yml`:
```yaml
resources:
  limits:
    cpus: '2.0'
    memory: 2G
```

## Cost Estimation

| Provider | Server | Monthly Cost |
|----------|--------|--------------|
| **DigitalOcean** | 2 Core, 2GB | $12/month |
| **Hetzner** | 2 Core, 4GB | €4.5/month |
| **Linode** | 2 Core, 4GB | $12/month |
| **Vultr** | 2 Core, 4GB | $12/month |

*+ Domain: ~$10/year*

## Support

- 📚 [Full Documentation](./COOLIFY_DEPLOYMENT_GUIDE.md)
- 🐛 [Report Issues](https://github.com/labhalamanojkumar/DvTools/issues)
- 💬 Coolify Community: https://coolify.io/discord

## Success Checklist

- [ ] Code pushed to Git
- [ ] Coolify app created
- [ ] Environment variables configured
- [ ] Database connected
- [ ] First deployment successful
- [ ] Health check passing
- [ ] Domain configured (optional)
- [ ] SSL enabled (optional)
- [ ] Monitoring active
- [ ] Backups configured

---

**Ready to deploy?** Run the preparation script and follow the [deployment guide](./COOLIFY_DEPLOYMENT_GUIDE.md)! 🚀
