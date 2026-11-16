$ErrorActionPreference='Continue'
Set-Location -LiteralPath $PSScriptRoot
$ok=$false
$logPath=Join-Path $PSScriptRoot 'reservation-check.log'
Set-Content -LiteralPath $logPath -Value '' -Encoding utf8
function Reservation-Step([string]$Name,[scriptblock]$Action){
 Write-Host "`n--- $Name ---"
 & $Action 2>&1 | ForEach-Object{Write-Host ([string]$_);Add-Content -LiteralPath $logPath -Value ([string]$_) -Encoding utf8}
 if($LASTEXITCODE -ne 0){throw "$Name basarisiz."}
}
try{
 Reservation-Step 'Test imaji' {docker build --target test -t atlas-erp-reservation-tests .}
 Reservation-Step 'Izole rezervasyon ve protokol testleri' {docker run --rm --network none --read-only --cap-drop ALL --security-opt no-new-privileges:true --memory 256m --cpus 1 --pids-limit 64 --tmpfs /tmp:size=32m atlas-erp-reservation-tests node --test api/test/payment-reconciliation.test.js api/test/payment-release.test.js api/test/protocol.test.js}
 Reservation-Step 'React derlemesi' {docker build --target web -t atlas-erp-reservation-web-check .}
 Reservation-Step 'API ve arayuzu guncelle' {docker compose up --build --wait --wait-timeout 300 api web waf}
 $ok=$true
 Write-Host 'Kontroller gecti. ERP sayfasini yenileyin. 5122 sonucu rezervasyonu serbest birakir; diger belirsizliklerde stok korunur.' -ForegroundColor Green
}catch{Write-Host $_.Exception.Message -ForegroundColor Red;Add-Content -LiteralPath $logPath -Value $_.Exception.Message -Encoding utf8}
finally{@{ok=$ok;at=[DateTimeOffset]::UtcNow.ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath 'reservation-check-result.json' -Encoding utf8}
if(-not $ok){exit 1}

