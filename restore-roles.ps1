Write-Host "Restaurare roluri corecte pentru utilizatori..." -ForegroundColor Yellow

# Mapare username -> rol corect
$rolMapping = @{
    'admin' = 'admin'
    'client1' = 'client'
    'client2' = 'client'
    'client3' = 'client'
    'client4' = 'client'
    'client5' = 'client'
    'timi' = 'client'
    'operator1' = 'operator'
    'operator2' = 'operator'
    'curier1' = 'curier'
    'curier2' = 'curier'
    'curier3' = 'curier'
    'sofer1' = 'curier'
    'sofer2' = 'curier'
}

try {
    $utilizatori = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/utilizatori" -Method Get -UseBasicParsing
    
    foreach ($user in $utilizatori) {
        $rolCorect = $rolMapping[$user.username]
        
        if ($rolCorect) {
            if ($user.rol -ne $rolCorect) {
                Write-Host "Restaurare $($user.username): $($user.rol) -> $rolCorect..." -ForegroundColor Cyan
                
                $user.rol = $rolCorect
                $json = $user | ConvertTo-Json -Depth 5
                
                $response = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/utilizatori/$($user.idUtilizator)" `
                    -Method Put `
                    -Body $json `
                    -ContentType "application/json" `
                    -UseBasicParsing
                
                Write-Host "  OK" -ForegroundColor Green
            } else {
                Write-Host "$($user.username) deja are rolul corect: $rolCorect" -ForegroundColor Gray
            }
        } else {
            Write-Host "ATENTIE: Nu stiu rolul corect pentru $($user.username), il las cu rol $($user.rol)" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`nGata! Rolurile au fost restaurate." -ForegroundColor Green
    
} catch {
    Write-Host "Eroare: $_" -ForegroundColor Red
}
