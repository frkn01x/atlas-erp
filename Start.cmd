@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy RemoteSigned -File "%~dp0Start.ps1"
set "ERP_EXIT=%ERRORLEVEL%"
echo.
if not "%ERP_EXIT%"=="0" pause
exit /b %ERP_EXIT%
