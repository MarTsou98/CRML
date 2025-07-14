@echo off
REM Start backend server
start "Backend Server" /min cmd /k "cd backend && node server.js"

REM Start frontend server
start "Frontend Server" /min cmd /k "cd frontend\my-react-frontend && npm run dev"

