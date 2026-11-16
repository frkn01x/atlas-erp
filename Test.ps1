$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
docker build --target test -t atlas-erp-tests .
if ($LASTEXITCODE -ne 0) { throw 'Docker test imaji derlenemedi.' }
docker run --rm atlas-erp-tests
if ($LASTEXITCODE -ne 0) { throw 'Birim testleri basarisiz.' }
