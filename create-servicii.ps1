
$servicii = @(
    @{
        nume = "Standard"
        descriere = "Livrare standard in 2-3 zile lucratoare"
        pretBaza = 15.00
        pretPerKg = 2.00
        timpLivrare = "2-3 zile"
        activ = $true
    },
    @{
        nume = "Express"
        descriere = "Livrare rapida in 24 ore"
        pretBaza = 25.00
        pretPerKg = 3.00
        timpLivrare = "24 ore"
        activ = $true
    },
    @{
        nume = "Same Day"
        descriere = "Livrare in aceeasi zi (comanda pana la ora 12:00)"
        pretBaza = 45.00
        pretPerKg = 5.00
        timpLivrare = "Aceeasi zi"
        activ = $true
    },
    @{
        nume = "Economy"
        descriere = "Livrare economica in 5-7 zile lucratoare"
        pretBaza = 10.00
        pretPerKg = 1.50
        timpLivrare = "5-7 zile"
        activ = $true
    },
    @{
        nume = "Weekend"
        descriere = "Livrare sambata si duminica"
        pretBaza = 35.00
        pretPerKg = 4.00
        timpLivrare = "Weekend"
        activ = $true
    },
    @{
        nume = "Overnight"
        descriere = "Livrare peste noapte (dimineata urmatoare)"
        pretBaza = 40.00
        pretPerKg = 4.50
        timpLivrare = "8-12 ore"
        activ = $true
    }
)

foreach ($serviciu in $servicii) {
    $json = $serviciu | ConvertTo-Json
    Write-Host "Creez serviciu: $($serviciu.nume)..."
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8081/api/admin/servicii" `
            -Method Post `
            -Body $json `
            -ContentType "application/json" `
            -UseBasicParsing
        
        Write-Host "Serviciu creat: $($serviciu.nume)" -ForegroundColor Green
    } catch {
        Write-Host "Eroare la crearea serviciului $($serviciu.nume): $_" -ForegroundColor Red
    }
}

Write-Host "Gata! Serviciile au fost create." -ForegroundColor Cyan

