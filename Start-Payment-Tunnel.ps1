$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $PSScriptRoot
$resultPath = Join-Path $PSScriptRoot 'tunnel-result.json'
$logPath = Join-Path $PSScriptRoot 'payment-tunnel.log'
$ok = $false
$publicUrl = $null
@{ok=$false;running=$true;at=[DateTimeOffset]::UtcNow.ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath $resultPath -Encoding utf8
function Tunnel-Step([string]$Name,[scriptblock]$Action) {
    Write-Host "`n$Name"
    & $Action 2>&1 | ForEach-Object { Write-Host ([string]$_); Add-Content -LiteralPath $logPath -Value ([string]$_) -Encoding utf8 }
    if ($LASTEXITCODE -ne 0) { throw "$Name basarisiz; cikis kodu $LASTEXITCODE" }
}
function Http-Status([string]$Url,[string]$Method='GET') {
    try {
        $requestOptions=@{Uri=$Url;Method=$Method;UseBasicParsing=$true;TimeoutSec=15;MaximumRedirection=0;ErrorAction='Stop'}
        if($Method -eq 'POST') {$requestOptions.ContentType='application/x-www-form-urlencoded';$requestOptions.Body='probe=1'}
        return [int](Invoke-WebRequest @requestOptions).StatusCode
    } catch {
        if($_.Exception.Response){return [int]$_.Exception.Response.StatusCode}
        return 0
    }
}
try {
    Tunnel-Step 'Docker erisimi' { docker info --format '{{.ServerVersion}}' }
    & (Join-Path $PSScriptRoot 'Prepare-Monitoring.ps1')
    Tunnel-Step 'Uygulamayi hazirlama' { docker compose up --wait --wait-timeout 300 api web waf }
    Tunnel-Step 'Odeme ve e-posta gecidini baslatma' { docker compose -f compose.yaml -f compose.tunnel.yaml --profile tunnel up -d --force-recreate --wait --wait-timeout 120 callback-gateway }
    Tunnel-Step 'Yalnizca gerekli yolun acik oldugunu test etme' { docker compose -f compose.yaml -f compose.tunnel.yaml --profile tunnel run --build --rm --no-deps tunnel-check }
    Tunnel-Step 'Gecici HTTPS tunelini baslatma' { docker compose -f compose.yaml -f compose.tunnel.yaml --profile tunnel up -d --no-deps --force-recreate payment-tunnel }
    for($i=0;$i -lt 45;$i++) {
        $output = docker compose -f compose.yaml -f compose.tunnel.yaml --profile tunnel logs --no-color payment-tunnel 2>&1 | Out-String
        if($LASTEXITCODE -ne 0){throw 'Tunel gunlugu okunamadi.'}
        $match=[regex]::Match($output,'https://[a-z0-9-]+\.trycloudflare\.com')
        if($match.Success){$publicUrl=$match.Value;break}
        Start-Sleep -Seconds 2
    }
    if(-not $publicUrl){throw 'HTTPS adresi olusmadi; payment-tunnel Docker gunlugunu kontrol edin.'}
    Write-Host "Olusan HTTPS adresi: $publicUrl"
    Tunnel-Step 'Dis HTTPS yollarini Docker icinden dogrulama' { docker compose -f compose.yaml -f compose.tunnel.yaml --profile tunnel run --rm --no-deps tunnel-check node api/test/tunnel-public-smoke.mjs $publicUrl }
    @('iyzico HTTPS uygulama adresi:',$publicUrl,'Yalnizca odeme donusu ve e-posta abonelikten cikis aciktir. ERP arayuzu localhost adresinde kalir.','Kapatma: Stop-Payment-Tunnel.ps1') | Set-Content -LiteralPath 'LOCAL-TUNNEL.txt' -Encoding utf8
    $ok=$true
    Write-Host "`niyzico HTTPS uygulama adresi: $publicUrl" -ForegroundColor Green
    Write-Host 'Ayarlar ve Entegrasyonlar > iyzico Sandbox > HTTPS uygulama adresi alanina yukaridaki ana adresi yazip kaydedin.'
    Write-Host 'E-posta testi: Ayni HTTPS ana adresini E-posta / SMTP > HTTPS uygulama adresi alanina yazip kaydedin.'
    Write-Host 'ERP kullanimi icin http://localhost adresinizi kullanmaya devam edin. Yeni tunelde adres degisir.'
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    Add-Content -LiteralPath $logPath -Value $_.Exception.Message -Encoding utf8
    docker compose -f compose.yaml -f compose.tunnel.yaml --profile tunnel logs --tail 50 payment-tunnel callback-gateway 2>&1 | ForEach-Object {Add-Content -LiteralPath $logPath -Value ([string]$_) -Encoding utf8}
    docker compose -f compose.yaml -f compose.tunnel.yaml --profile tunnel stop payment-tunnel callback-gateway 2>&1 | Out-Null
} finally {
    @{ok=$ok;running=$false;at=[DateTimeOffset]::UtcNow.ToString('o');url=$publicUrl;scope='iyzico-callback-and-email-unsubscribe'} | ConvertTo-Json | Set-Content -LiteralPath $resultPath -Encoding utf8
}
if(-not $ok){exit 1}

