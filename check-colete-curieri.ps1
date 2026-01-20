# Verificare colete pentru fiecare curier

Write-Host "=== Verificare Colete per Curier ===" -ForegroundColor Cyan

# Găsim toți curierii
$utilizatori = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/utilizatori" -Method Get -UseBasicParsing
$curieri = $utilizatori | Where-Object { $_.rol -eq 'curier' }

Write-Host "`nCurieri găsiți: $($curieri.Count)" -ForegroundColor Yellow

foreach ($curier in $curieri) {
    Write-Host "`n--- $($curier.username) (ID: $($curier.idUtilizator)) ---" -ForegroundColor Green
    
    try {
        # Încearcă să obțină pickups
        $pickups = Invoke-RestMethod -Uri "http://localhost:8081/api/curier/$($curier.idUtilizator)/pickups" -Method Get -UseBasicParsing
        Write-Host "  Pickups: $($pickups.Count)" -ForegroundColor Cyan
        
        # Încearcă să obțină livrari  
        $livrari = Invoke-RestMethod -Uri "http://localhost:8081/api/curier/$($curier.idUtilizator)/livrari" -Method Get -UseBasicParsing
        Write-Host "  Livrari: $($livrari.Count)" -ForegroundColor Cyan
        
        # Dashboard
        $dashboard = Invoke-RestMethod -Uri "http://localhost:8081/api/curier/$($curier.idUtilizator)/dashboard" -Method Get -UseBasicParsing
        Write-Host "  Total colete: $($dashboard.totalColete)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "  Eroare: $_" -ForegroundColor Red
    }
}

# Caută specific AWB87B80794
Write-Host "`n=== Căutare AWB87B80794 ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/api/tracking/AWB87B80794" -Method Get -UseBasicParsing
    $colet = $response.Content | ConvertFrom-Json
    Write-Host "Colet găsit!" -ForegroundColor Green
    Write-Host "  Status: $($colet.statusColet)" -ForegroundColor Cyan
    Write-Host "  Curier ID: $($colet.idCurier)" -ForegroundColor Cyan
    Write-Host ($colet | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "Colet nu a fost găsit sau eroare: $_" -ForegroundColor Red
}
