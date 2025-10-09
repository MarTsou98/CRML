@echo off
:: --- Request admin privileges ---
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: --- Set current directory to the location of this .bat file ---
cd /d "%~dp0"

:: --- Start MongoDB ---
::echo Starting MongoDB...
::start "" ".\MongoDB\Server\8.0\bin\mongod.exe" --dbpath ".\data\db"

:: --- Wait a few seconds for MongoDB to initialize ---
::timeout /t 5 /nobreak >nul

:: --- Run backup in a minimized window ---
echo Running database backup...
start "" /min ".\Backup.bat"

:: --- Start Node server ---
echo Starting Node backend...
start "" /min cmd /k "cd backend && node server.js"

:: --- Start React frontend ---
echo Starting React frontend...
start "" /min cmd /k "cd frontend\my-react-frontend && npm run dev"

:: --- Done ---
echo All servers started! Backup is running in the background.
exit


