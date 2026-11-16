$ErrorActionPreference='Continue'
Set-Location -LiteralPath $PSScriptRoot
$log=Join-Path $PSScriptRoot 'mongodb-upgrade.log'
$result=Join-Path $PSScriptRoot 'mongodb-upgrade-result.json'
$project='atlas-erp-mongo-upgrade'
$image='atlas-erp-mongodb7-test'
$extract=$null
Set-Content -LiteralPath $log -Value '' -Encoding utf8
@{ok=$false;running=$true} | ConvertTo-Json | Set-Content -LiteralPath $result -Encoding utf8
function Step([string]$Name,[scriptblock]$Action){
 Write-Host "`n--- $Name ---"
 & $Action 2>&1 | ForEach-Object{Write-Host ([string]$_);Add-Content -LiteralPath $log -Value ([string]$_) -Encoding utf8}
 if($LASTEXITCODE -ne 0){throw "$Name basarisiz; devam edilmedi."}
}
try{
 Step 'Docker erisimi' {docker version --format '{{.Server.Version}}'}
 Step 'MongoDB 7.9 test imaji' {docker build --target test -t $image .}
 Step 'Birim testleri' {docker run --rm --network none --read-only --tmpfs /tmp:size=32m --cap-drop ALL --security-opt no-new-privileges --memory 512m $image npm test}
 Step 'React derlemesi' {docker build --target build -t atlas-erp-mongodb7-web-check .}
 Step 'Izole entegrasyon imajlari' {docker compose -p $project -f compose.mongo-upgrade.yaml build driver-test ai-fixture}
 Step 'Gecici test MongoDB ve AI' {docker compose -p $project -f compose.mongo-upgrade.yaml up -d --wait --wait-timeout 150 auth-test-mongo ai-fixture}
 Step 'Modul ve veritabani uyumlulugu' {docker compose -p $project -f compose.mongo-upgrade.yaml run --rm --no-deps driver-test}
 Step 'Parola ve oturum regresyonu' {powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File (Join-Path $PSScriptRoot 'Check-Password-Race.ps1')}
 $race=Get-Content -LiteralPath password-race-result.json -Raw | ConvertFrom-Json
 if(-not $race.executed -or $race.vulnerable -or $race.inFlightLoginStatus -ne 401 -or $race.staleVersionSessionAccessStatus -ne 401){throw 'Oturum regresyonu beklenen sonucu vermedi.'}
 Step 'Docker lock surumunu dogrulama' {docker run --rm --network none --read-only $image node api/test/check-mongo-lock.mjs}
 Write-Host 'Docker lock dosyasini okuma'
 $lockLines = & docker.exe run --rm --network none --read-only --entrypoint cat $image /app/package-lock.json
 if($LASTEXITCODE -ne 0){throw 'Docker lock dosyasi okunamadi.'}
 $lockText = $lockLines -join "`n"

 [IO.File]::WriteAllText((Join-Path $PSScriptRoot 'package-lock.mongodb7.tmp.json'), $lockText, (New-Object System.Text.UTF8Encoding($false)))
 Copy-Item -LiteralPath package-lock.mongodb7.tmp.json -Destination package-lock.json -Force
 Remove-Item -LiteralPath package-lock.mongodb7.tmp.json
 Step 'Dogrulanan API surumunu baslatma' {docker compose up -d --build --wait --wait-timeout 150 api}
 Step 'WAF baglantisini yenileme' {docker compose restart waf}
 $healthy=$false
 for($i=0;$i -lt 30;$i++){
  try{$r=Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:8080/api/health' -TimeoutSec 5;if($r.StatusCode -eq 200){$healthy=$true;break}}catch{}
  Start-Sleep -Seconds 2
 }
 if(-not $healthy){throw 'Guncelleme sonrasi HTTP saglik kontrolu gecmedi; logu inceleyin.'}
 @{ok=$true;running=$false;driver='7.9.0';isolatedAcceptance=$true;authRegression=$true;deployed=$true;at=(Get-Date).ToUniversalTime().ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath $result -Encoding utf8
 Write-Host 'MongoDB surucusu guncellendi; izole testler ve uygulama saglik kontrolu gecti.' -ForegroundColor Green
}catch{
 @{ok=$false;running=$false;error=$_.Exception.Message;at=(Get-Date).ToUniversalTime().ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath $result -Encoding utf8
 Write-Host $_.Exception.Message -ForegroundColor Red
}finally{
 if($extract){docker rm $extract 2>&1 | Out-Null}
 docker compose -p $project -f compose.mongo-upgrade.yaml down --remove-orphans 2>&1 | ForEach-Object{Write-Host ([string]$_)}
}
