$ErrorActionPreference='Continue'
Set-Location -LiteralPath $PSScriptRoot
function Run-Step([scriptblock]$Action){& $Action;if($LASTEXITCODE -ne 0){throw 'Adim basarisiz; devam edilmedi.'}}
try{
 Run-Step {docker build --target test -t atlas-erp-nes-check .}
 Run-Step {docker run --rm --network none --read-only --memory 256m atlas-erp-nes-check node --test api/test/nes-error-detail.test.js api/test/protocol.test.js}
 Run-Step {docker compose up -d --build --wait --wait-timeout 180 api}
 Run-Step {docker compose restart waf}
 Write-Host 'NES hata aciklamasi guncellendi. ERP ekranini yenileyin. Bu betik fatura gondermedi.'
}catch{Write-Host $_.Exception.Message -ForegroundColor Red;exit 1}
