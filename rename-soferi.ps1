# Actualizare nume pentru foștii șoferi

$updates = @(
    @{
        id = 101
        username = "sofer1"
        numeNou = "Georgescu"
        prenumeNou = "Curier5"
        usernameNou = "curier5"
    },
    @{
        id = 102
        username = "sofer2"
        numeNou = "Georgescu"
        prenumeNou = "Curier6"
        usernameNou = "curier6"
    }
)

foreach ($update in $updates) {
    Write-Host "Actualizare $($update.username) -> $($update.usernameNou) ($($update.prenumeNou) $($update.numeNou))..." -ForegroundColor Yellow
    
    try {
        # Obținem utilizatorul
        $user = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/utilizatori/$($update.id)" -Method Get -UseBasicParsing
        
        # Actualizăm datele
        $user.username = $update.usernameNou
        $user.nume = $update.numeNou
        $user.prenume = $update.prenumeNou
        
        # Trimitem update
        $json = $user | ConvertTo-Json -Depth 5
        $response = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/utilizatori/$($update.id)" `
            -Method Put `
            -Body $json `
            -ContentType "application/json" `
            -UseBasicParsing
        
        Write-Host "  OK - Acum este: $($update.prenumeNou) $($update.numeNou) (username: $($update.usernameNou))" -ForegroundColor Green
    } catch {
        Write-Host "  Eroare: $_" -ForegroundColor Red
    }
}

Write-Host "`nVerificare finala..." -ForegroundColor Cyan
$utilizatori = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/utilizatori" -Method Get -UseBasicParsing
$curieri = $utilizatori | Where-Object { $_.rol -eq 'curier' }
Write-Host "Curieri in sistem:" -ForegroundColor Green
$curieri | Select-Object username, nume, prenume | Format-Table -AutoSize
