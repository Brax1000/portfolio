@echo off
setlocal

echo ========================================================
echo   Braxten Portfolio - GitHub Push Helper
echo ========================================================
echo.

set /p REPO_NAME="Enter your GitHub repository name (press Enter for 'portfolio'): "
if "%REPO_NAME%"=="" set REPO_NAME=portfolio

echo.
echo Setting remote to https://github.com/Brax1000/%REPO_NAME%.git ...
"C:\Program Files\Git\bin\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/Brax1000/%REPO_NAME%.git

echo.
echo Pushing branch 'main' to GitHub...
echo (If a browser window appears, please click 'Sign in with your browser' to authorize)
echo.

"C:\Program Files\Git\bin\git.exe" push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCCESS! Your portfolio is now on GitHub!
    echo   View it at: https://github.com/Brax1000/%REPO_NAME%
    echo ========================================================
) else (
    echo --------------------------------------------------------
    echo If push failed, make sure you created the empty repo at:
    echo   https://github.com/new
    echo with the name '%REPO_NAME%'.
    echo --------------------------------------------------------
)

pause
