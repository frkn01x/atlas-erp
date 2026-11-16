@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy RemoteSigned -File "%~dp0Ready.ps1"
set "ERP_EXIT=%ERRORLEVEL%"
echo.
if "%ERP_EXIT%"=="0" (
  echo Hazirlik tamamlandi. Giris bilgileri LOCAL-ACCESS.txt dosyasinda.
) else (
  echo Islem durdu. readiness-result.json ve readiness.log dosyalarini kontrol edin.
)
pause
exit /b %ERP_EXIT%
