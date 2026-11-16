$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $PSScriptRoot
$backupDir = Join-Path $PSScriptRoot '.private/backups'
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$logPath = Join-Path $PSScriptRoot 'reset-demo.log'
$resultPath = Join-Path $PSScriptRoot 'reset-demo-result.json'
$ok = $false
$apiStopped = $false
@{ok=$false;running=$true;at=[DateTimeOffset]::UtcNow.ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath $resultPath -Encoding utf8
function Reset-Step([string]$Name,[scriptblock]$Action) {
    Write-Host "`n$Name"
    & $Action 2>&1 | ForEach-Object { $line=[regex]::Replace([string]$_,'mongodb(?:\+srv)?://[^\s"''<>]+','[ATLAS_URI_REDACTED]'); Write-Host $line; Add-Content -LiteralPath $logPath -Value $line -Encoding utf8 }
    if ($LASTEXITCODE -ne 0) { throw "$Name basarisiz; cikis kodu $LASTEXITCODE" }
}
try {
    Reset-Step 'Docker erisimi' { docker info --format '{{.ServerVersion}}' }
    & (Join-Path $PSScriptRoot 'Prepare-Monitoring.ps1')
    Reset-Step 'Guncel rehber ve bakim imajini derleme' { docker compose build api }
    $apiStopped = $true
    Reset-Step 'API ve e-posta iscilerini durdurma' { docker compose stop api }
    Reset-Step 'Sirket verilerini yedekleme ve demo is kayitlarini sifirlama' { docker compose run --rm --no-deps -e RESET_MAINTENANCE_MODE=api-stopped -v "${backupDir}:/backup" api node api/src/reset-demo.mjs --apply-all-demo }
    $saved = Get-Content -Raw -LiteralPath (Join-Path $backupDir 'reset-result.json') | ConvertFrom-Json
    if (-not $saved.ok) { throw 'Bakim sonuc dosyasi basarili degil.' }
    $saved | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $resultPath -Encoding utf8
    $ok = $true
} catch {
    @{ok=$false;running=$false;at=[DateTimeOffset]::UtcNow.ToString('o');error=$_.Exception.Message} | ConvertTo-Json | Set-Content -LiteralPath $resultPath -Encoding utf8
    Write-Host $_.Exception.Message -ForegroundColor Red
} finally {
    if ($apiStopped) {
        docker compose up --wait --wait-timeout 300 api web waf prometheus loki alloy nginx-exporter grafana
        $appReady = $LASTEXITCODE -eq 0
        $finalResult = Get-Content -Raw -LiteralPath $resultPath | ConvertFrom-Json
        $finalResult | Add-Member -NotePropertyName appReady -NotePropertyValue $appReady -Force
        $finalResult | Add-Member -NotePropertyName running -NotePropertyValue $false -Force
        if (-not $appReady) { $ok=$false; $finalResult.ok=$false; Write-Host 'Bakimdan sonra baslatma basarisiz; reset-demo-result.json ve Docker gunluklerini kontrol edin.' -ForegroundColor Red }
        $finalResult | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $resultPath -Encoding utf8
    }
}
if (-not $ok) { exit 1 }
Write-Host 'Demo sifirlandi; yeni rehber yuklendi. Kullanici/rol/API ayarlari korundu. Yedekler .private/backups klasorunde.'
