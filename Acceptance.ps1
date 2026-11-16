$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
& (Join-Path $PSScriptRoot 'Prepare-Monitoring.ps1')
if (-not (Test-Path -LiteralPath '.env.test')) {
    throw '.env.example dosyasindan .env.test olusturun. MONGODB_DB icin atlas_erp_acceptance gibi AYRI bir test veritabani ve ona ozel Atlas kullanicisi kullanin.'
}
$testConfig = Get-Content -LiteralPath '.env.test'
$databaseLine = $testConfig | Where-Object { $_ -match '^MONGODB_DB=' } | Select-Object -First 1
if (-not $databaseLine -or $databaseLine -notmatch '^MONGODB_DB=[a-zA-Z0-9_]*(test|acceptance)[a-zA-Z0-9_]*$') {
    throw 'Guvenlik icin test veritabani adinda test veya acceptance bulunmali.'
}
docker compose -f compose.yaml -f compose.acceptance.yaml -p atlas-erp-acceptance --env-file .env.test --profile acceptance up --build --abort-on-container-exit --exit-code-from acceptance acceptance
$testExit = $LASTEXITCODE
docker compose -f compose.yaml -f compose.acceptance.yaml -p atlas-erp-acceptance --env-file .env.test --profile acceptance down
if ($testExit -ne 0) { throw 'Kabul testleri basarisiz. Test ciktilarini inceleyin.' }
Write-Host 'Kabul testleri gecti. Test verileri yalnizca belirtilen test Atlas veritabaninda tutulur; otomatik silinmez.'
