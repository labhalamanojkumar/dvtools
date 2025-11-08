# DVtools Deployment Verification Script
# Run this to verify your Docker image works before deploying to Coolify

Write-Host "🔍 DVtools Deployment Verification" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Function to print status
function Print-Status {
    param([bool]$success, [string]$message)
    if ($success) {
        Write-Host "✅ $message" -ForegroundColor Green
    } else {
        Write-Host "❌ $message" -ForegroundColor Red
    }
}

Write-Host "1. Checking Docker availability..." -NoNewline
try {
    $dockerVersion = docker --version 2>$null
    Print-Status $true "Docker is installed"
} catch {
    Print-Status $false "Docker is not available"
}

Write-Host "2. Pulling Docker image..." -NoNewline
try {
    docker pull manojkumarlabhala/dvtools:v1.0.0 2>$null | Out-Null
    Print-Status $true "Image pulled successfully"
} catch {
    Print-Status $false "Failed to pull image"
}

Write-Host "3. Checking image exists..." -NoNewline
try {
    $images = docker images "manojkumarlabhala/dvtools" 2>$null
    if ($images -match "dvtools") {
        Print-Status $true "Image exists locally"
    } else {
        Print-Status $false "Image not found locally"
    }
} catch {
    Print-Status $false "Failed to check images"
}

Write-Host "4. Testing container creation..." -NoNewline
try {
    docker create --name dvtools-test manojkumarlabhala/dvtools:v1.0.0 2>$null | Out-Null
    Print-Status $true "Container created successfully"
} catch {
    Print-Status $false "Failed to create container"
}

Write-Host "5. Checking container configuration..." -NoNewline
try {
    $inspect = docker inspect dvtools-test 2>$null | ConvertFrom-Json
    $entrypoint = $inspect.Config.Entrypoint
    if ($entrypoint -and $entrypoint[0] -eq "/app/entrypoint.sh") {
        Print-Status $true "Entrypoint configured correctly"
    } else {
        Print-Status $false "Entrypoint not configured correctly"
    }
} catch {
    Print-Status $false "Failed to inspect container"
}

Write-Host "6. Checking exposed ports..." -NoNewline
try {
    $inspect = docker inspect dvtools-test 2>$null | ConvertFrom-Json
    $ports = $inspect.Config.ExposedPorts
    if ($ports -and $ports."3000/tcp") {
        Print-Status $true "Port 3000 exposed"
    } else {
        Print-Status $false "Port 3000 not exposed"
    }
} catch {
    Print-Status $false "Failed to check ports"
}

Write-Host "7. Checking health check..." -NoNewline
try {
    $inspect = docker inspect dvtools-test 2>$null | ConvertFrom-Json
    $healthcheck = $inspect.Config.Healthcheck
    if ($healthcheck -and $healthcheck.Test) {
        Print-Status $true "Health check configured"
    } else {
        Print-Status $false "Health check not configured"
    }
} catch {
    Print-Status $false "Failed to check health check"
}

Write-Host "8. Cleaning up test container..." -NoNewline
try {
    docker rm dvtools-test 2>$null | Out-Null
    Print-Status $true "Test container cleaned up"
} catch {
    Print-Status $false "Failed to clean up test container"
}

Write-Host ""
Write-Host "📋 VERIFICATION COMPLETE" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If all checks are ✅, your Docker image is ready for deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 To deploy locally for testing:" -ForegroundColor Yellow
Write-Host "   docker run -d -p 3000:3000 --name dvtools \"
Write-Host "     -e DATABASE_URL='your-db-url' \"
Write-Host "     -e NEXTAUTH_URL='http://localhost:3000' \"
Write-Host "     -e NEXTAUTH_SECRET='test-secret' \"
Write-Host "     manojkumarlabhala/dvtools:v1.0.0"
Write-Host ""
Write-Host "🌐 Then visit: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🩺 Health check: http://localhost:3000/api/health" -ForegroundColor Cyan