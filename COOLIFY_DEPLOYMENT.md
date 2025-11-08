# DVtools Coolify Deployment Guide

## Quick Start for Coolify Deployment

### 1. Prerequisites
- Coolify instance running
- MySQL or PostgreSQL database (can be created in Coolify)
- Domain name configured in your DNS

### 2. Create Database in Coolify
1. Go to Coolify Dashboard → Resources → New Resource
2. Select **PostgreSQL** or **MySQL**
3. Create a new database named `dvtools_production`
4. Note the connection details

### 3. Deploy Application

#### Option 1: Using Git Repository
1. Go to Coolify Dashboard → Projects → New Project
2. Select **Git Repository**
3. Enter your repository URL
4. Branch: `main` or your deployment branch
5. Build Pack: **Dockerfile**

#### Option 2: Using Docker Compose
1. Upload `docker-compose.coolify.yml` to Coolify
2. Coolify will automatically detect and use it

### 4. Configure Environment Variables

In Coolify's environment variables section, add the following:

```env
# Database (use Coolify-generated database URL)
DATABASE_URL=mysql://username:password@db-host:3306/dvtools_production

# NextAuth (CRITICAL - generate secure secret)
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=https://yourdomain.com

# Application
NODE_ENV=production
APP_URL=https://yourdomain.com

# Admin Account
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>

# Site Configuration
SITE_NAME=DvTools
SITE_DESCRIPTION=Professional developer tools platform
SITE_URL=https://yourdomain.com

# Domain (for Traefik)
DOMAIN=yourdomain.com

# Optional: Redis
REDIS_URL=redis://redis-host:6379/0

# Migrations
RUN_MIGRATIONS=true

# Logging
LOG_LEVEL=info
```

### 5. Domain Configuration
1. In Coolify, go to your app → Domains
2. Add your domain: `yourdomain.com`
3. Enable HTTPS/SSL (Let's Encrypt)
4. Coolify will handle SSL certificates automatically

### 6. Health Check Configuration
Coolify will use the health check endpoint:
- **Path**: `/api/health`
- **Interval**: 30s
- **Timeout**: 10s

### 7. Deployment Process
1. Coolify will build the Docker image
2. Run database migrations automatically
3. Start the application
4. Configure SSL/TLS
5. Your app will be live at `https://yourdomain.com`

## Post-Deployment Steps

### 1. Verify Deployment
```bash
# Check if app is running
curl https://yourdomain.com/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Create Admin Account
The admin account is created automatically using `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

Login at: `https://yourdomain.com/auth/signin`

### 3. Database Seeding (Optional)
If you want to seed initial data:

```bash
# SSH into container via Coolify
npx prisma db seed
```

### 4. Configure Payment Gateways
This application supports multiple payment gateways. To enable payments:

1. Login to admin panel: `https://yourdomain.com/admin`
2. Go to **Payment Gateways** section
3. Configure at least one gateway (Stripe recommended for testing):
   - **Stripe**: Get API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - **PayPal**: Configure PayPal Business account
   - **DodoPay**: Configure DodoPay credentials
   - **Razorpay**: Configure Razorpay keys

4. Or configure via script (replace with real keys):
```bash
# SSH into container and run:
node scripts/configure-test-gateway.js
```

### 5. Monitor Logs
In Coolify Dashboard:
- Go to your app → Logs
- Monitor application logs in real-time

## Environment Variables Reference

### Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `mysql://user:pass@host:3306/db` |
| `NEXTAUTH_SECRET` | NextAuth encryption key | `<random-32-char-string>` |
| `NEXTAUTH_URL` | Application URL | `https://yourdomain.com` |
| `ADMIN_EMAIL` | Admin account email | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | Admin account password | `<strong-password>` |

### Optional Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection string | - |
| `RUN_MIGRATIONS` | Auto-run migrations | `true` |
| `LOG_LEVEL` | Logging level | `info` |
| `ENABLE_ANALYTICS` | Enable analytics | `true` |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit requests | `100` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `SMTP_HOST` | Email SMTP host | - |
| `SMTP_PORT` | Email SMTP port | `587` |
| `SMTP_USER` | Email SMTP username | - |
| `SMTP_PASSWORD` | Email SMTP password | - |
| `SMTP_FROM` | Email from address | `noreply@yourdomain.com` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | - |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | - |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | - |

## Database Options

### Option 1: Coolify Managed Database (Recommended)
1. Create PostgreSQL/MySQL in Coolify
2. Coolify generates connection URL
3. Add to environment variables

### Option 2: External Database
1. Use your existing database
2. Ensure network connectivity
3. Add connection URL to environment variables

### Option 3: Container Database
Uncomment database service in `docker-compose.coolify.yml`:
```yaml
database:
  image: postgres:15-alpine
  # ... configuration
```

## SSL/HTTPS Configuration

Coolify handles SSL automatically:
1. Add domain in Coolify
2. Enable SSL/TLS
3. Coolify uses Let's Encrypt
4. Auto-renewal configured

## Troubleshooting

### Build Fails
- Check build logs in Coolify
- Verify environment variables are set
- Ensure database is accessible

### Database Connection Error
```bash
# Test database connectivity
npx prisma db push
```

### Migration Issues
```bash
# Reset database (CAUTION: destroys data)
npx prisma migrate reset

# Or manually run migrations
npx prisma migrate deploy
```

### Container Won't Start
- Check logs in Coolify Dashboard
- Verify health check endpoint
- Ensure port 3000 is exposed

### SSL Certificate Issues
- Verify domain DNS points to Coolify server
- Check Coolify SSL settings
- Allow ports 80 and 443

## Scaling & Performance

### Horizontal Scaling
Coolify supports multiple instances:
1. Go to app settings → Scaling
2. Increase replica count
3. Coolify handles load balancing

### Resource Limits
Configure in Coolify:
- **Memory**: 512MB - 2GB recommended
- **CPU**: 0.5 - 2 cores recommended

## Backup Strategy

### Database Backup
```bash
# In Coolify, enable automatic backups
# Or manually backup:
npx prisma db pull > backup-$(date +%Y%m%d).sql
```

### Application Data
```bash
# Backup volumes:
# - /app/data
# - /app/logs
```

## Updates & Maintenance

### Deploy Updates
1. Push to git repository
2. Coolify auto-deploys (if webhook configured)
3. Or manually trigger deployment in Coolify

### Zero-Downtime Deployment
Coolify handles rolling updates:
- New container starts
- Health check passes
- Old container stops

## Monitoring

### Built-in Health Check
- Endpoint: `/api/health`
- Coolify monitors automatically

### Application Logs
- Real-time logs in Coolify Dashboard
- Persistent logs in `/app/logs`

### Metrics
- View in Coolify Dashboard
- CPU, Memory, Network usage

## Support

For issues:
1. Check Coolify logs
2. Review environment variables
3. Test database connectivity
4. Check application logs

## Security Checklist

- [ ] Strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Strong `ADMIN_PASSWORD`
- [ ] Database password secure
- [ ] SSL/HTTPS enabled
- [ ] Environment variables not exposed
- [ ] Firewall configured
- [ ] Regular backups enabled
- [ ] Rate limiting configured

## Production Checklist

- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Database connected
- [ ] Migrations run successfully
- [ ] Admin account accessible
- [ ] Health check passing
- [ ] Logs accessible
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Performance optimized

---

**Your DVtools instance is ready for production! 🚀**

Access your application at: `https://yourdomain.com`
Admin panel at: `https://yourdomain.com/admin`
