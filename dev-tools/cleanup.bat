@echo off
echo Bread of Life Website - Cleanup Script
echo =========================================
echo.
echo This script will remove unnecessary files and organize your website files.
echo.

REM Create a development tools directory if it doesn't exist
if not exist "c:\xampp\htdocs\dev-tools" (
    echo Creating development tools directory...
    mkdir "c:\xampp\htdocs\dev-tools"
    echo.
)

REM Move development tools to the dev-tools directory
echo Moving development tools to dev-tools directory...
if exist "c:\xampp\htdocs\generate-responsive-images.bat" (
    move "c:\xampp\htdocs\generate-responsive-images.bat" "c:\xampp\htdocs\dev-tools\"
    echo - Moved generate-responsive-images.bat
)
if exist "c:\xampp\htdocs\minify.js" (
    move "c:\xampp\htdocs\minify.js" "c:\xampp\htdocs\dev-tools\"
    echo - Moved minify.js
)
echo.

REM Remove temporary and unused directories
echo Removing temporary and unused directories...
if exist "c:\xampp\htdocs\.tmp.drivedownload" (
    rmdir /s /q "c:\xampp\htdocs\.tmp.drivedownload"
    echo - Removed .tmp.drivedownload directory
)
if exist "c:\xampp\htdocs\.tmp.driveupload" (
    rmdir /s /q "c:\xampp\htdocs\.tmp.driveupload"
    echo - Removed .tmp.driveupload directory
)
if exist "c:\xampp\htdocs\.vs" (
    rmdir /s /q "c:\xampp\htdocs\.vs"
    echo - Removed .vs directory
)
echo.

REM Check if config.php is needed
echo Checking for unused PHP files...
if exist "c:\xampp\htdocs\config.php" (
    echo Found config.php. Moving to dev-tools directory for review.
    move "c:\xampp\htdocs\config.php" "c:\xampp\htdocs\dev-tools\"
    echo - Moved config.php
)
echo.

REM Move this cleanup script to dev-tools when done
echo Moving cleanup script to dev-tools directory...
echo.

echo =========================================
echo Cleanup completed successfully!
echo All development tools have been moved to the dev-tools directory.
echo Please review the files in the dev-tools directory and delete any that are not needed.
echo.
echo Press any key to move this cleanup script to dev-tools and exit...
pause > nul

REM Move this script to dev-tools
move "%~f0" "c:\xampp\htdocs\dev-tools\"
