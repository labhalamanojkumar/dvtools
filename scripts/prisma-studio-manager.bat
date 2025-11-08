@echo off
REM Prisma Studio Manager Script for Windows
REM Helps manage Prisma Studio connections reliably

echo 🔧 Prisma Studio Manager
echo =========================

REM Check if port 5555 is in use
netstat -an | find "5555" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Port 5555 is in use (Prisma Studio running)
    echo 📊 Primary Prisma Studio (port 5555): RUNNING
    echo 🌐 Access at: http://localhost:5555
    goto :commands
)

REM Check if port 5556 is in use
netstat -an | find "5556" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Port 5556 is in use (Prisma Studio running)
    echo 📊 Alternative Prisma Studio (port 5556): RUNNING
    echo 🌐 Access at: http://localhost:5556
    goto :commands
)

echo ❌ No Prisma Studio instances found
echo.
echo Starting Prisma Studio...
start /B npm run db:studio >nul 2>&1
timeout /t 3 /nobreak >nul

REM Check again if port 5555 is now in use
netstat -an | find "5555" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Prisma Studio started successfully!
    echo 🌐 Access at: http://localhost:5555
) else (
    echo ❌ Failed to start Prisma Studio
)

:commands
echo.
echo 💡 Commands:
echo    npm run db:studio     - Start on port 5555
echo    npm run db:studio:alt - Start on port 5556
echo    npx prisma studio     - Start with default settings

pause