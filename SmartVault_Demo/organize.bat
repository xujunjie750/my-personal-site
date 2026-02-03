@echo off
title SmartVault Auto-Collector
cls
echo ========================================
echo       SmartVault: Collecting All Photos...
echo ========================================

:: 检查目标文件夹
if not exist "SecretPhotos" mkdir "SecretPhotos"

:: 搬运所有图片文件 (*.jpg, *.png, *.jpeg)
move "raw_photo\*.jpg" "SecretPhotos\"
move "raw_photo\*.png" "SecretPhotos\"
move "raw_photo\*.jpeg" "SecretPhotos\"
move "raw_photo\*.bmp" "SecretPhotos\"

echo.
echo [DONE] All files have been moved to your Secure Vault.
pause