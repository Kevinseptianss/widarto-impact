@echo off
title Widarto Impact - Website Preview
cd /d "%~dp0"

echo.
echo  ============================================
echo   Widarto Impact - Website Preview
echo  ============================================
echo.

if not exist "index.html" (
  echo  Website files not found in this folder.
  echo.
  pause
  exit /b 1
)

echo  Starting preview...
echo  No Node.js required.
echo  Keep this window open while you browse.
echo  Close this window when you are done.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0preview-server.ps1" -Root "%~dp0." -Port 3005
if errorlevel 1 (
  echo.
  echo  Could not start the preview server.
  echo  Try closing this window and opening it again.
  echo.
)

pause
