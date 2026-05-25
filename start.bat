@echo off
title Student Organization System
cd /d "%~dp0"

echo Stopping old servers on ports 3000 and 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

if not exist "backend\database\database.sqlite" (
    echo First-time setup...
    call setup.bat
)

echo.
echo [1/2] Laravel API  http://127.0.0.1:8000
start "Laravel API" cmd /k "cd /d "%~dp0backend" && php artisan serve --host=127.0.0.1 --port=8000"

echo Waiting for API...
timeout /t 6 /nobreak >nul

echo [2/2] Next.js UI  http://localhost:3000
start "Next.js" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ============================================
echo   Open:  http://localhost:3000
echo   Or:    http://127.0.0.1:3000
echo.
echo   Wait for "Ready" in the Next.js window
echo   then refresh the browser (Ctrl+Shift+R)
echo ============================================
timeout /t 12 /nobreak >nul
start http://127.0.0.1:3000
pause
