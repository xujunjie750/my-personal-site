@echo off
title SmartVault Security System
color 0A
cls

echo ========================================
echo       SmartVault Security System
echo ========================================
echo.
echo [NOTICE] Unauthorized access is prohibited.
echo.

set /p pass="Please enter your 6-digit PIN: "

if "%pass%"=="123456" (
    echo.
    echo [SUCCESS] Identity verified. 
    echo Opening your secure folder...
    start explorer "SecretPhotos"
    timeout /t 2 >nul
    exit
) else (
    echo.
    echo [ERROR] Invalid PIN! Access Denied.
    echo.
    pause
    exit
)