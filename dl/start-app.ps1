# PowerShell script to start the e-commerce application
# This script starts both backend and frontend servers

Write-Host "🚀 Starting E-Commerce Application..." -ForegroundColor Green
Write-Host ""

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check if Node.js is installed
if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js version: $(node --version)" -ForegroundColor Green

# Check if npm is installed
if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ npm version: $(npm --version)" -ForegroundColor Green
Write-Host ""

# Install backend dependencies if node_modules doesn't exist
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location "backend"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
    Set-Location ".."
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
}

# Install frontend dependencies if node_modules doesn't exist
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location "frontend"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
    Set-Location ".."
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
}

# Check if .env file exists in backend
if (-not (Test-Path "backend/.env")) {
    Write-Host "⚠️  Backend .env file not found. Creating from example..." -ForegroundColor Yellow
    Copy-Item "backend/.env.example" "backend/.env"
    Write-Host "📝 Please edit backend/.env with your MongoDB connection string" -ForegroundColor Cyan
    Write-Host "   Update MONGODB_URI with your MongoDB Atlas credentials" -ForegroundColor Cyan
    Write-Host ""
    
    # Ask if user wants to continue
    $continue = Read-Host "Do you want to continue anyway? The app will use default settings (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "Please configure backend/.env and run this script again." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "🔧 Starting servers..." -ForegroundColor Green
Write-Host ""

# Start backend server in background
Write-Host "🌐 Starting backend server on http://localhost:5000" -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location "backend"
    npm run dev
}

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server in background
Write-Host "⚛️  Starting frontend server on http://localhost:3000" -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location "frontend"
    npm start
}

Write-Host ""
Write-Host "🎉 Application is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access your application at:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 To stop the application:" -ForegroundColor Yellow
Write-Host "   Press Ctrl+C or close this window" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Server logs:" -ForegroundColor Yellow

# Monitor both jobs and display output
try {
    while ($backendJob.State -eq "Running" -or $frontendJob.State -eq "Running") {
        # Check backend output
        if ($backendJob.HasMoreData) {
            $backendOutput = Receive-Job $backendJob
            if ($backendOutput) {
                Write-Host "[Backend] $backendOutput" -ForegroundColor Blue
            }
        }
        
        # Check frontend output
        if ($frontendJob.HasMoreData) {
            $frontendOutput = Receive-Job $frontendJob
            if ($frontendOutput) {
                Write-Host "[Frontend] $frontendOutput" -ForegroundColor Magenta
            }
        }
        
        Start-Sleep -Seconds 1
    }
}
catch {
    Write-Host "Application stopped." -ForegroundColor Yellow
}
finally {
    # Clean up jobs
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $frontendJob -ErrorAction SilentlyContinue
    Write-Host "✅ Cleanup completed." -ForegroundColor Green
}