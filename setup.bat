@echo off
REM SpeakWell Setup Script for Windows

echo.
echo ============================================
echo   SpeakWell - Setup Script
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Python found: %python --version%
echo [OK] Node.js found:
node --version

echo.
echo [STEP 1] Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo [STEP 2] Installing Node.js dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install Node.js dependencies
    cd ..
    pause
    exit /b 1
)

echo.
echo [STEP 3] Building React frontend...
call npm run build
if errorlevel 1 (
    echo [ERROR] Failed to build React frontend
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo To start the website:
echo   1. Open Command Prompt
echo   2. Navigate to: %cd%
echo   3. Run: python main.py
echo   4. Open browser to: http://localhost:8000
echo.
echo For frontend development (hot reload):
echo   1. In frontend folder: npm start
echo   2. Opens at http://localhost:3000
echo.
pause
