@echo off
echo ========================================
echo  Appliance Management System - Setup
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

:: Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MongoDB is not installed or not in PATH
    echo Please install MongoDB from https://www.mongodb.com/try/download/community
    echo.
) else (
    echo [OK] MongoDB found
)
echo.

:: Setup Server
echo ========================================
echo  Setting up Server...
echo ========================================
cd /d "%~dp0Server"

if not exist "node_modules\" (
    echo Installing server dependencies...
    call npm install
) else (
    echo Server dependencies already installed.
)

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
)

echo.
echo Do you want to seed the database? (Y/N)
set /p SEED="Choice: "
if /i "%SEED%"=="Y" (
    echo Seeding database...
    call npm run seed
) else if /i "%SEED%"=="y" (
    echo Seeding database...
    call npm run seed
)

echo.
echo Starting server in development mode...
start cmd /k "npm run dev"

:: Wait a bit for server to start
timeout /t 3 /nobreak >nul

:: Setup Client
echo.
echo ========================================
echo  Setting up Client...
echo ========================================
cd /d "%~dp0Client"

if not exist "node_modules\" (
    echo Installing client dependencies...
    call npm install
) else (
    echo Client dependencies already installed.
)

if not exist ".env" (
    echo Creating .env file...
    echo VITE_API_URL=http://localhost:5000/api > .env
)

echo.
echo Starting client development server...
start cmd /k "npm run dev"

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Two terminal windows have been opened:
echo 1. Server running on http://localhost:5000
echo 2. Client running on http://localhost:5173
echo.
echo Default login credentials:
echo Email: admin@example.com
echo Password: password123
echo.
pause
