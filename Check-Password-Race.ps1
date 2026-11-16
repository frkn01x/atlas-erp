$ErrorActionPreference='Continue'
Set-Location -LiteralPath $PSScriptRoot
$resultPath=Join-Path $PSScriptRoot 'password-race-result.json'
$logPath=Join-Path $PSScriptRoot 'password-race-check.log'
$testResult=$null
Set-Content -LiteralPath $logPath -Value '' -Encoding utf8
@{executed=$false;running=$true} | ConvertTo-Json | Set-Content -LiteralPath $resultPath -Encoding utf8
function Auth-Test-Step([string]$Name,[scriptblock]$Action){
 Write-Host "`n--- $Name ---"
 & $Action 2>&1 | ForEach-Object{Write-Host ([string]$_);Add-Content -LiteralPath $logPath -Value ([string]$_) -Encoding utf8}
 if($LASTEXITCODE -ne 0){throw "$Name basarisiz."}
}
try{
 Auth-Test-Step 'Izole test imaji' {docker compose -p atlas-erp-auth-race -f compose.auth-race.yaml build auth-race}
 Auth-Test-Step 'Gecici yerel test veritabani' {docker compose -p atlas-erp-auth-race -f compose.auth-race.yaml up -d --wait --wait-timeout 150 auth-test-mongo}
 Auth-Test-Step 'Eszamanli parola ve giris denemesi' {docker compose -p atlas-erp-auth-race -f compose.auth-race.yaml run --rm --no-deps auth-race}
 $match=Select-String -LiteralPath $logPath -Pattern 'AUTH_RACE_RESULT=(\{[^\r\n]+\})' | Select-Object -Last 1
 if(-not $match){throw 'Test sonucu bulunamadi.'}
 $testResult=$match.Matches[0].Groups[1].Value | ConvertFrom-Json
 $testResult | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $resultPath -Encoding utf8
 if($testResult.vulnerable){Write-Host 'BULGU DOGRULANDI: Eski parolayla baslatilan giris, parola degisiminden sonra calisan oturum olusturdu.' -ForegroundColor Yellow}
 else{Write-Host 'Bu kontrollu senaryoda eski-parola oturumu kabul edilmedi.' -ForegroundColor Green}
}catch{
 Write-Host $_.Exception.Message -ForegroundColor Red
 @{executed=$false;error=$_.Exception.Message} | ConvertTo-Json | Set-Content -LiteralPath $resultPath -Encoding utf8
}finally{
 # Only the explicitly named disposable test project; no ERP services/volumes.
 docker compose -p atlas-erp-auth-race -f compose.auth-race.yaml down --remove-orphans 2>&1 | ForEach-Object{Write-Host ([string]$_)}
}
if(-not $testResult -or -not $testResult.executed){exit 1}
