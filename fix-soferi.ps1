$soferi = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/utilizatori" -Method Get | Where-Object { $_.rol -eq 'sofer' }

Write-Host "Gasiti $($soferi.Count) utilizatori cu rol sofer" -ForegroundColor Cyan

foreach ($sofer in $soferi) {
    Write-Host "Actualizare: $($sofer.username) ($($sofer.nume) $($sofer.prenume)) -> curier..." -ForegroundColor Yellow
    
    $sofer.rol = 'curier'
    $json = $sofer | ConvertTo-Json -Depth 5
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/utilizatori/$($sofer.idUtilizator)" -Method Put -Body $json -ContentType "application/json" -UseBasicParsing
        Write-Host "  Actualizat cu succes!" -ForegroundColor Green
    } catch {
        Write-Host "  Eroare: $_" -ForegroundColor Red
    }
}

Write-Host "Gata! Verificare finala..." -ForegroundColor Cyan
$soferiRamasi = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/utilizatori" -Method Get | Where-Object { $_.rol -eq 'sofer' }
if ($soferiRamasi.Count -eq 0) {
    Write-Host "Nu mai exista utilizatori cu rol sofer!" -ForegroundColor Green
} else {
    Write-Host "Mai sunt $($soferiRamasi.Count) utilizatori cu rol sofer" -ForegroundColor Red
}
