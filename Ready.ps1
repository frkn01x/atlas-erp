param([switch]$SkipAcceptance)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
& (Join-Path $PSScriptRoot 'Prepare-Monitoring.ps1')
$steps = [Collections.Generic.List[object]]::new()
$logPath = Join-Path $PSScriptRoot 'readiness.log'
$resultPath = Join-Path $PSScriptRoot 'readiness-result.json'
@{ok=$false;running=$true;startedAt=[DateTimeOffset]::UtcNow.ToString('o');steps=@()} | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $resultPath -Encoding utf8
$secretValues = @()
foreach ($envFile in @('.env','.env.test')) {
    if (Test-Path -LiteralPath $envFile) {
        foreach ($line in Get-Content -LiteralPath $envFile) {
            if ($line -match '^(MONGODB_URI|ADMIN_PASSWORD)=(.*)$') {
                $value = $Matches[2].Trim().Trim([char]39).Trim([char]34)
                if ($value.Length -ge 8) { $secretValues += $value }
            }
        }
    }
}
function Protect-Text([string]$Value) {
    foreach ($secret in $secretValues) { $Value = $Value.Replace($secret,'[REDACTED]') }
    $Value = [regex]::Replace($Value,'mongodb(?:\+srv)?://[^\s"''<>]+','[ATLAS_URI_REDACTED]')
    return $Value
}
function Step([string]$Name,[scriptblock]$Action) {
    # Windows PowerShell 5: native stderr satirlari ErrorRecord olabilir.
    # Docker ilerleme ciktisi tek basina basarisizlik sayilmaz; cikis kodu denetlenir.
    $ErrorActionPreference = 'Continue'
    Write-Host "`n--- $Name ---"
    $started = [DateTimeOffset]::UtcNow
    try {
        & $Action 2>&1 | ForEach-Object {
            $safe = Protect-Text ([string]$_)
            Write-Host $safe
            Add-Content -LiteralPath $logPath -Value $safe -Encoding utf8
        }
        if ($LASTEXITCODE -ne 0) { throw "Komut cikis kodu: $LASTEXITCODE" }
        $steps.Add(@{name=$Name;ok=$true;startedAt=$started.ToString('o')})
    } catch {
        $safe = Protect-Text $_.Exception.Message
        $steps.Add(@{name=$Name;ok=$false;startedAt=$started.ToString('o');error=$safe})
        throw $safe
    }
}
$ok = $false
$acceptanceStarted = $false
try {
    Step 'Docker erisimi' { docker info --format '{{.ServerVersion}}' }
    if (-not (Test-Path -LiteralPath '.env')) { throw '.env dosyasi gerekli.' }
    Step 'Compose yapilandirmasi' { docker compose config --quiet }
    Step 'Test imaji' { docker build --target test -t atlas-erp-tests . }
    Step 'Domain testleri' { docker run --rm atlas-erp-tests }
    Step 'React / web derlemesi' { docker build --target web -t atlas-erp-web-check . }
    Step 'Bagimlilik guvenlik denetimi' { docker run --rm --entrypoint npm atlas-erp-tests audit --audit-level=high }
    Step 'Docker lock dosyasini alma' {
        $lockId = docker create atlas-erp-tests
        if ($LASTEXITCODE -ne 0) { throw 'Gecici lock konteyneri olusturulamadi.' }
        try {
            docker cp "${lockId}:/app/package-lock.json" (Join-Path $PSScriptRoot 'package-lock.json')
            if ($LASTEXITCODE -ne 0) { throw 'Lock dosyasi kopyalanamadi.' }
        } finally {
            docker rm $lockId | Out-Null
        }
    }
    if (-not $SkipAcceptance) {
        if (-not (Test-Path -LiteralPath '.env.test')) { throw '.env.test dosyasi gerekli.' }
        $line = Get-Content -LiteralPath '.env.test' | Where-Object { $_ -match '^MONGODB_DB=' } | Select-Object -First 1
        if ($line -notmatch '^MONGODB_DB=[a-zA-Z0-9_]*(test|acceptance)[a-zA-Z0-9_]*$') { throw 'Kabul testleri icin ayri test veritabani gerekli.' }
        $acceptanceStarted = $true
        Step 'Atlas/API kabul testleri' { docker compose -f compose.yaml -f compose.acceptance.yaml -p atlas-erp-acceptance --env-file .env.test --profile acceptance up --build --abort-on-container-exit --exit-code-from acceptance acceptance }
        Step 'Test konteynerlerini kapatma' { docker compose -f compose.yaml -f compose.acceptance.yaml -p atlas-erp-acceptance --env-file .env.test --profile acceptance down }
        $acceptanceStarted = $false
    }
    Step 'Uygulamayi derle ve baslat' { docker compose up --build --wait --wait-timeout 300 api web waf prometheus loki alloy nginx-exporter grafana }
    Step 'HTTP hazirlik kontrolu' {
        $portLine = Get-Content -LiteralPath '.env' | Where-Object { $_ -match '^APP_PORT=' } | Select-Object -First 1
        $port = if ($portLine) { $portLine.Split('=',2)[1].Trim() } else { '8080' }
        for ($attempt=1; $attempt -le 15; $attempt++) {
            try {
                $health = Invoke-RestMethod -Uri "http://127.0.0.1:$port/api/health" -TimeoutSec 10 -ErrorAction Stop
                if (-not $health.ok) { throw 'Saglik kontrolu basarisiz.' }
                $html = Invoke-WebRequest -Uri "http://127.0.0.1:$port/" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
                if ($html.StatusCode -ne 200 -or $html.Content -notmatch 'id="root"') { throw 'React sayfasi sunulamadi.' }
                break
            } catch {
                if ($attempt -eq 15) { throw }
                Start-Sleep -Seconds 2
            }
        }
        Write-Host "Uygulama: http://localhost:$port"
        $global:LASTEXITCODE = 0
    }
    Step 'WAF ve monitoring guvenlik kontrolleri' { docker compose --profile security-check run --build --rm --no-deps security-check }
    $ok = $true
} catch {
    # Docker normal ilerleme mesajlarini stderr'e de yazar; temizleme bunlarla kesilmesin.
    $ErrorActionPreference = 'Continue'
    $safeError = Protect-Text $_.Exception.Message
    Write-Host "Durduruldu: $safeError" -ForegroundColor Red
    Add-Content -LiteralPath $logPath -Value "Durduruldu: $safeError" -Encoding utf8
    if ($acceptanceStarted) {
        docker compose -f compose.yaml -f compose.acceptance.yaml -p atlas-erp-acceptance --env-file .env.test --profile acceptance logs --tail 80 api web waf ai-fixture 2>&1 | ForEach-Object { Add-Content -LiteralPath $logPath -Value (Protect-Text ([string]$_)) -Encoding utf8 }
        docker compose -f compose.yaml -f compose.acceptance.yaml -p atlas-erp-acceptance --env-file .env.test --profile acceptance down 2>&1 | Out-Null
    }
    docker compose logs --tail 80 api web waf prometheus loki alloy nginx-exporter grafana 2>&1 | ForEach-Object { Add-Content -LiteralPath $logPath -Value (Protect-Text ([string]$_)) -Encoding utf8 }
} finally {
    @{ok=$ok;running=$false;at=[DateTimeOffset]::UtcNow.ToString('o');acceptanceSkipped=[bool]$SkipAcceptance;version=(Get-Content -Raw -LiteralPath 'package.json'|ConvertFrom-Json).version;steps=@($steps.ToArray())} | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $resultPath -Encoding utf8
}
if (-not $ok) { exit 1 }
Write-Host 'Kontroller gecti. Giris bilgileri LOCAL-ACCESS.txt dosyasinda.'
