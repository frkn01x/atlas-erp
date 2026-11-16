$ErrorActionPreference = 'Stop'
$privateDir = Join-Path $PSScriptRoot '.private'
New-Item -ItemType Directory -Force -Path $privateDir | Out-Null
$secretPath = Join-Path $privateDir 'grafana_admin_password'
if (-not (Test-Path -LiteralPath $secretPath)) {
    $buffer = New-Object byte[] 32
    $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($buffer)
    $rng.Dispose()
    $password = [Convert]::ToBase64String($buffer)
    [IO.File]::WriteAllText($secretPath,$password,[Text.UTF8Encoding]::new($false))
    [IO.File]::WriteAllLines((Join-Path $PSScriptRoot 'LOCAL-MONITORING.txt'),@('URL: http://localhost:3001','Username: admin',('Password: '+$password)),[Text.UTF8Encoding]::new($false))
}
Write-Host 'Grafana yerel sifre dosyasi hazir; deger yazdirilmadi.'
