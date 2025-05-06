@echo off
echo Bread of Life Website - Responsive Image Generator
echo =========================================================
echo.
echo This script will create responsive versions of your images for better performance.
echo.

set IMAGE_DIR=c:\xampp\htdocs\assets\img
set CLIENTS_DIR=c:\xampp\htdocs\assets\img\clients

echo Creating responsive versions for main images...
echo.

REM Process main images
for %%f in ("%IMAGE_DIR%\*.jpg", "%IMAGE_DIR%\*.jpeg", "%IMAGE_DIR%\*.png", "%IMAGE_DIR%\*.webp") do (
    echo Processing: %%f
    
    REM Skip if already processed
    if not exist "%IMAGE_DIR%\%%~nf-small%%~xf" (
        REM Create small version (480px width)
        magick convert "%%f" -resize 480x -quality 80 "%IMAGE_DIR%\%%~nf-small%%~xf"
        echo Created small version: %%~nf-small%%~xf
    )
    
    if not exist "%IMAGE_DIR%\%%~nf-medium%%~xf" (
        REM Create medium version (800px width)
        magick convert "%%f" -resize 800x -quality 85 "%IMAGE_DIR%\%%~nf-medium%%~xf"
        echo Created medium version: %%~nf-medium%%~xf
    )
)

echo.
echo Creating responsive versions for client/partner images...
echo.

REM Process client/partner images
for %%f in ("%CLIENTS_DIR%\*.jpg", "%CLIENTS_DIR%\*.jpeg", "%CLIENTS_DIR%\*.png", "%CLIENTS_DIR%\*.webp") do (
    echo Processing: %%f
    
    REM Skip if already processed
    if not exist "%CLIENTS_DIR%\%%~nf-small%%~xf" (
        REM Create small version (480px width)
        magick convert "%%f" -resize 480x -quality 80 "%CLIENTS_DIR%\%%~nf-small%%~xf"
        echo Created small version: %%~nf-small%%~xf
    )
    
    if not exist "%CLIENTS_DIR%\%%~nf-medium%%~xf" (
        REM Create medium version (800px width)
        magick convert "%%f" -resize 800x -quality 85 "%CLIENTS_DIR%\%%~nf-medium%%~xf"
        echo Created medium version: %%~nf-medium%%~xf
    )
)

echo.
echo =========================================================
echo All responsive images have been created successfully!
echo.
echo Note: You'll need to have ImageMagick installed to run this script.
echo If you don't have it installed, please download it from:
echo https://imagemagick.org/script/download.php
echo.
echo Press any key to exit...
pause > nul
