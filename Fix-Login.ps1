$ErrorActionPreference='Continue'
Set-Location -LiteralPath $PSScriptRoot
$ok=$false
try{
 & powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File (Join-Path $PSScriptRoot 'Check-Password-Race.ps1')
 if($LASTEXITCODE -ne 0){throw 'Izole parola testi tamamlanamadi; uygulama guncellenmedi.'}
 $result=Get-Content -Raw -LiteralPath 'password-race-result.json' | ConvertFrom-Json
 if(-not $result.executed -or $result.vulnerable -ne $false -or $result.inFlightLoginStatus -ne 401 -or $result.staleVersionSessionAccessStatus -ne 401 -or $result.newPasswordLoginStatus -ne 200){throw 'Oturum korumasi dogrulanamadi; uygulama guncellenmedi.'}
 docker run --rm --network none --read-only --cap-drop ALL --security-opt no-new-privileges:true --memory 256m --cpus 1 --pids-limit 64 --tmpfs /tmp:size=16m atlas-erp-auth-race-auth-race node --test api/test/domain.test.js api/test/access-ai.test.js
 if($LASTEXITCODE -ne 0){throw 'Ilgili regresyon testleri basarisiz; uygulama guncellenmedi.'}
 docker compose up --build --wait --wait-timeout 300 api
 if($LASTEXITCODE -ne 0){throw 'API guncellemesi basarisiz.'}
 $ok=$true
 Write-Host 'Duzeltme dogrulandi ve API guncellendi. Tarayicida yeniden giris yapin; mevcut parolalar degismedi.' -ForegroundColor Green
}catch{Write-Host $_.Exception.Message -ForegroundColor Red}
finally{@{ok=$ok;at=[DateTimeOffset]::UtcNow.ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath 'login-fix-result.json' -Encoding utf8}
if(-not $ok){exit 1}
