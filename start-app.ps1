#!/usr/bin/env pwsh
# Script pentru pornirea aplicației Curier
# Autor: Generated for curier-app
# Data: 2025-11-20

Write-Host ""
Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🚚 Aplicație Curier - Starter      ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verifică PostgreSQL
Write-Host "🔍 Verificare PostgreSQL..." -ForegroundColor Yellow
$pgPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
if (Test-Path $pgPath) {
    Write-Host "✅ PostgreSQL găsit" -ForegroundColor Green
} else {
    Write-Host "❌ PostgreSQL nu este găsit la path-ul standard!" -ForegroundColor Red
    Write-Host "   Verifică că PostgreSQL este instalat și baza de date 'curier_app' există" -ForegroundColor Yellow
}

# Verifică Java
Write-Host "🔍 Verificare Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    if ($javaVersion -match "21\.") {
        Write-Host "✅ Java 21 găsit" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Java găsit dar nu este versiunea 21!" -ForegroundColor Yellow
        Write-Host "   Versiune detectată: $javaVersion" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Java nu este instalat sau nu este în PATH!" -ForegroundColor Red
    Write-Host "   Descarcă Java 21 de pe: https://adoptium.net/" -ForegroundColor Yellow
    exit 1
}

# Verifică Node.js
Write-Host "🔍 Verificare Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion găsit" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js nu este instalat!" -ForegroundColor Red
    Write-Host "   Descarcă Node.js de pe: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan

# Pornește backend
Write-Host ""
Write-Host "🚀 Pornesc backend-ul (Spring Boot)..." -ForegroundColor Green
Write-Host "   Port: 8080" -ForegroundColor Gray
Write-Host "   Log: Terminal separat" -ForegroundColor Gray

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$PSScriptRoot'; Write-Host '🔥 Backend Starting...' -ForegroundColor Cyan; .\mvnw.cmd spring-boot:run"
)

# Așteaptă backend
Write-Host ""
Write-Host "⏳ Aștept pornirea backend-ului..." -ForegroundColor Yellow
Write-Host "   Timp așteptare: 30 secunde" -ForegroundColor Gray

for ($i = 30; $i -gt 0; $i--) {
    Write-Host -NoNewline "`r   Timp rămas: $i secunde  " -ForegroundColor Yellow
    Start-Sleep -Seconds 1
}
Write-Host ""

# Verifică dacă backend-ul răspunde
Write-Host ""
Write-Host "🔍 Verificare backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 3 -ErrorAction SilentlyContinue
    Write-Host "✅ Backend pornit și răspunde!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend-ul nu răspunde încă (normal, mai are nevoie de timp)" -ForegroundColor Yellow
}

# Verifică dependințele frontend
Write-Host ""
Write-Host "🔍 Verificare dependințe frontend..." -ForegroundColor Yellow
$nodeModulesPath = "$PSScriptRoot\curier-app-frontend\node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "📦 Instalez dependințe frontend..." -ForegroundColor Cyan
    Push-Location "$PSScriptRoot\curier-app-frontend"
    npm install
    Pop-Location
    Write-Host "✅ Dependințe instalate" -ForegroundColor Green
} else {
    Write-Host "✅ Dependințe frontend OK" -ForegroundColor Green
}

# Pornește frontend
Write-Host ""
Write-Host "🎨 Pornesc frontend-ul (React + Vite)..." -ForegroundColor Green
Write-Host "   Port: 5174 (sau 5173)" -ForegroundColor Gray
Write-Host "   Log: Terminal separat" -ForegroundColor Gray

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$PSScriptRoot\curier-app-frontend'; Write-Host '🎨 Frontend Starting...' -ForegroundColor Cyan; npm run dev"
)

# Așteaptă frontend
Write-Host ""
Write-Host "⏳ Aștept pornirea frontend-ului (5 secunde)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          ✅ APLICAȚIA PORNEȘTE        ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Acesează aplicația:" -ForegroundColor Cyan
Write-Host "   🌐 http://localhost:5174" -ForegroundColor White
Write-Host ""
Write-Host "👤 Conturi demo:" -ForegroundColor Cyan
Write-Host "   Client:  username: client1  | parolă: pass123" -ForegroundColor White
Write-Host "   Curier:  username: curier1  | parolă: pass123" -ForegroundColor White
Write-Host "   Admin:   username: admin    | parolă: admin123" -ForegroundColor White
Write-Host ""
Write-Host "🔧 API Backend:" -ForegroundColor Cyan
Write-Host "   🌐 http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Pentru a opri aplicația, închide terminalele backend și frontend" -ForegroundColor Yellow
Write-Host ""
