@echo off
REM Quick Coolify Deployment Preparation Script for DvTools (Windows)

echo ========================================
echo DvTools Coolify Deployment Preparation
echo ========================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed
    echo Please install Docker Desktop: https://docs.docker.com/desktop/install/windows-install/
    exit /b 1
)
echo [OK] Docker is installed

REM Check if docker-compose is available
docker compose version >nul 2>nul
if %errorlevel% neq 0 (
    docker-compose --version >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERROR] Docker Compose is not installed
        exit /b 1
    )
)
echo [OK] Docker Compose is installed

echo.
echo Checking required files...

REM Check required files
if not exist "Dockerfile" (
    echo [ERROR] Dockerfile is missing
    exit /b 1
)
echo [OK] Dockerfile exists

if not exist "docker-compose.coolify.yml" (
    echo [ERROR] docker-compose.coolify.yml is missing
    exit /b 1
)
echo [OK] docker-compose.coolify.yml exists

if not exist "entrypoint.sh" (
    echo [ERROR] entrypoint.sh is missing
    exit /b 1
)
echo [OK] entrypoint.sh exists

if not exist ".dockerignore" (
    echo [ERROR] .dockerignore is missing
    exit /b 1
)
echo [OK] .dockerignore exists

if not exist "prisma\schema.prisma" (
    echo [ERROR] prisma\schema.prisma is missing
    exit /b 1
)
echo [OK] prisma\schema.prisma exists

if not exist "package.json" (
    echo [ERROR] package.json is missing
    exit /b 1
)
echo [OK] package.json exists

echo.
echo Validating docker-compose.coolify.yml...
docker-compose -f docker-compose.coolify.yml config >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] docker-compose.coolify.yml has errors
    exit /b 1
)
echo [OK] docker-compose.coolify.yml is valid

echo.
echo Checking environment configuration...
if exist ".env.production.template" (
    echo [OK] Environment template found
    echo.
    echo Required environment variables for Coolify:
    echo    - DATABASE_URL
    echo    - NEXTAUTH_URL
    echo    - NEXTAUTH_SECRET
    echo    - APP_URL
    echo    - ADMIN_EMAIL
    echo    - ADMIN_PASSWORD
) else (
    echo [WARN] No environment template found
)

echo.
echo ========================================
echo Pre-deployment checks passed!
echo ========================================
echo.
echo Next steps:
echo 1. Push code to GitHub repository
echo 2. Create new application in Coolify
echo 3. Select Docker Compose build pack
echo 4. Configure environment variables (see .env.production.template)
echo 5. Deploy!
echo.
echo Full guide: COOLIFY_DEPLOYMENT_GUIDE.md
echo.
echo Deployment Checklist:
echo   [ ] Code pushed to Git repository
echo   [ ] Coolify application created
echo   [ ] Database service configured
echo   [ ] Environment variables set
echo   [ ] Domain configured (optional)
echo   [ ] SSL enabled (optional)
echo   [ ] Deploy button clicked
echo.
echo Ready for Coolify deployment!
echo.
pause
