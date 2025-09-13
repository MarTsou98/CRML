@echo off
:: --- Request admin privileges ---
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: --- Start MongoDB ---
echo Starting MongoDB as Administrator...
:: Use start with /min to launch in a minimized window and /b to detach
start "" /min "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db"

:: Exit immediately after starting MongoDB
exit
