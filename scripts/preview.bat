@echo off
title Widarto Impact - Website Preview
cd /d "%~dp0"

echo.
echo  ============================================
echo   Widarto Impact - Website Preview
echo  ============================================
echo.

if exist "out\index.html" (
  set "WEBROOT=%~dp0out"
  set "PS1=%~dp0scripts\preview-server.ps1"
  goto :start_server
)

if exist "index.html" (
  set "WEBROOT=%~dp0."
  set "PS1=%~dp0preview-server.ps1"
  goto :start_server
)

echo  Website not built yet.
echo  Run: npm run build
echo.
pause
exit /b 1

:start_server
echo  Starting preview...
echo  No Node.js required.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -Root "%WEBROOT%" -Port 3005
if errorlevel 1 (
  echo.
  echo  Could not start the preview server.
  echo.
)

pause
