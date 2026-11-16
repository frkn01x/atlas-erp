$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $PSScriptRoot
docker compose -f compose.yaml -f compose.tunnel.yaml --profile tunnel stop payment-tunnel callback-gateway
if($LASTEXITCODE -ne 0){throw 'Tunel kapatilamadi; Docker servislerini kontrol edin.'}
@{ok=$true;running=$false;stopped=$true;at=[DateTimeOffset]::UtcNow.ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath 'tunnel-result.json' -Encoding utf8
Write-Host 'HTTPS odeme tuneli kapandi. Yerel ERP uygulamasi acik kalir.'
