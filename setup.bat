@echo off
title Student Organization System - Setup
cd /d "%~dp0"

echo ============================================
echo  Student Organization System - First Setup
echo ============================================
echo.

cd backend
if not exist vendor (
    echo Installing PHP dependencies...
    composer install --no-interaction
)

if not exist database\database.sqlite (
    echo Creating database file...
    type nul > database\database.sqlite
)

echo Running migrations and sample data...
php artisan key:generate --force
php artisan migrate:fresh --seed --force

cd ..\frontend
if not exist node_modules (
    echo Installing Node dependencies...
    call npm install
)

echo NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api> "%~dp0frontend\.env.local"

cd ..
echo.
echo Setup complete!
echo Run start.bat to launch the application.
pause
