$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $PSScriptRoot
& (Join-Path $PSScriptRoot 'Prepare-Monitoring.ps1')
if (-not (Test-Path -LiteralPath '.env')) {
    Copy-Item -LiteralPath '.env.example' -Destination '.env'
    Write-Host '.env olusturuldu. MONGODB_URI, ADMIN_EMAIL ve ADMIN_PASSWORD alanlarini doldurup tekrar calistirin.'
    exit 1
}
docker info --format '{{.ServerVersion}}'
if ($LASTEXITCODE -ne 0) { throw 'Docker motoruna erisilemiyor. Docker Desktop ve terminal yetkilerini kontrol edin.' }
docker compose config --quiet
if ($LASTEXITCODE -ne 0) { throw '.env veya compose yapilandirmasi eksik.' }
docker compose up --wait --wait-timeout 300 api web waf prometheus loki alloy nginx-exporter grafana
if ($LASTEXITCODE -ne 0) { throw 'Konteynerler baslatilamadi. docker compose logs --tail 100 komutuyla kontrol edin.' }
docker compose ps
[ordered]@{ok=$true;at=[DateTimeOffset]::UtcNow.ToString('o');url='http://localhost:8080'} | ConvertTo-Json | Set-Content -LiteralPath 'start-result.json' -Encoding utf8
Write-Host 'Varsayilan uygulama adresi: http://localhost:8080 (APP_PORT degistirildiyse o portu kullanin).'
