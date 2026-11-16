$ErrorActionPreference='Continue'
Set-Location -LiteralPath $PSScriptRoot
$resultPath=Join-Path $PSScriptRoot 'monitoring-result.json'
$logPath=Join-Path $PSScriptRoot 'monitoring-check.log'
$ok=$false
$steps=New-Object System.Collections.Generic.List[object]
@{ok=$false;running=$true;at=[DateTimeOffset]::UtcNow.ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath $resultPath -Encoding utf8
Set-Content -LiteralPath $logPath -Value '' -Encoding utf8
function Monitoring-Step([string]$Name,[scriptblock]$Action){
 Write-Host "`n--- $Name ---"
 & $Action 2>&1 | ForEach-Object {Write-Host ([string]$_);Add-Content -LiteralPath $logPath -Value ([string]$_) -Encoding utf8}
 if($LASTEXITCODE -ne 0){throw "$Name basarisiz (cikis kodu $LASTEXITCODE)."}
 $steps.Add(@{name=$Name;ok=$true})
}
try{
 Monitoring-Step 'Docker erisimi' {docker info --format '{{.ServerVersion}}'}
 & (Join-Path $PSScriptRoot 'Prepare-Monitoring.ps1')
 if($LASTEXITCODE -ne 0){throw 'Monitoring hazirligi basarisiz.'}
 Monitoring-Step 'WAF ve izleme servisleri' {docker compose up --wait --wait-timeout 300 api web waf prometheus loki alloy nginx-exporter grafana}
 Monitoring-Step 'WAF ve monitoring testleri' {docker compose --profile security-check run --build --rm --no-deps security-check}
 $grafanaReady=$false
 for($attempt=0;$attempt -lt 15;$attempt++){
  try{
   $health=Invoke-RestMethod -Uri 'http://127.0.0.1:3001/api/health' -TimeoutSec 5 -ErrorAction Stop
   if($health.database -eq 'ok'){$grafanaReady=$true;break}
  }catch{}
  Start-Sleep -Seconds 2
 }
 if(-not $grafanaReady){throw 'Grafana Docker icinde calisiyor fakat yerel 3001 portuna erisilemiyor.'}
 $steps.Add(@{name='Grafana yerel HTTP erisimi';ok=$true})
 $ok=$true
 Write-Host 'Kontroller gecti. Grafana: http://localhost:3001' -ForegroundColor Green
 Write-Host 'Grafana giris bilgileri LOCAL-MONITORING.txt dosyasinda.'
}catch{
 Write-Host $_.Exception.Message -ForegroundColor Red
 Add-Content -LiteralPath $logPath -Value $_.Exception.Message -Encoding utf8
}finally{
 @{ok=$ok;running=$false;at=[DateTimeOffset]::UtcNow.ToString('o');steps=@($steps.ToArray())} | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $resultPath -Encoding utf8
}
if(-not $ok){exit 1}
