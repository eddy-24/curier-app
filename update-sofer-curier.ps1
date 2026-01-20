# Actualizare utilizatori de la sofer la curier
$updateQuery = @"
{
  "rol": "curier"
}
"@

# Găsim toți utilizatorii cu rol sofer
Write-Host "Căutare utilizatori cu rol sofer..." -ForegroundColor Yellow

try {
    $utilizatori = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/utilizatori" -Method Get -UseBasicParsing
    
    $soferi = $utilizatori | Where-Object { $_.rol -eq 'sofer' }
    
    if ($soferi.Count -eq 0) {
        Write-Host "Nu există utilizatori cu rol sofer." -ForegroundColor Green
    } else {
        Write-Host "Găsiți $($soferi.Count) utilizatori cu rol sofer. Actualizare..." -ForegroundColor Cyan
        
        foreach ($sofer in $soferi) {
            Write-Host "Actualizare: $($sofer.username) ($($sofer.nume) $($sofer.prenume))..." -ForegroundColor Yellow
            
            $sofer.rol = 'curier'
            $json = $sofer | ConvertTo-Json
            
            $response = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/utilizatori/$($sofer.idUtilizator)" `
                -Method Put `
                -Body $json `
                -ContentType "application/json" `
                -UseBasicParsing
            
            Write-Host "  ✓ Actualizat la curier" -ForegroundColor Green
        }
        
        Write-Host "`nToți șoferii au fost actualizați la curier!" -ForegroundColor Green
    }
} catch {
    Write-Host "Eroare: $_" -ForegroundColor Red
}
