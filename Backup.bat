@echo off
setlocal

:: Get current date in YYYYMMDD format
for /f "tokens=2-4 delims=/.- " %%a in ('date /t') do (
  set day=%%a
  set month=%%b
  set year=%%c
)
set TODAY=%year%%month%%day%

:: Set backup directory path
set BACKUP_DIR=.\backups\kitchen_crm_%TODAY%

:: Create backup directory
mkdir %BACKUP_DIR%

:: Run mongodump
mongodump --db kitchen_crm --out %BACKUP_DIR%

echo Backup completed to %BACKUP_DIR%
pause
