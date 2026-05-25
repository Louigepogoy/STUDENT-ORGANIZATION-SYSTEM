@echo off
title SOS - Production Mode (faster, no compile wait)
cd /d "%~dp0"

if not exist "backend\database\database.sqlite" call setup.bat

echo Starting API...
start "Laravel API" cmd /k "cd /d "%~dp0backend" && php artisan serve --host=127.0.0.1 --port=8000"
timeout /t 5 /nobreak >nul

echo Building frontend (one time, may take 1-2 min)...
cd frontend
call npm run build
if errorlevel 1 (
    echo Build failed. Try start.bat instead.
    pause
    exit /b 1
)

echo Starting website...
start "Next.js Production" cmd /k "cd /d "%~dp0frontend" && npm run start"
timeout /t 5 /nobreak >nul
start http://127.0.0.1:3000
echo Open http://127.0.0.1:3000
pause
