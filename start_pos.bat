@echo off
title Blling POS System
echo Starting Blling POS System...
echo Please ensure Node.js is installed.
echo.
echo Launching Server...
start "" node server.js
echo.
echo Opening localhost...
start "" http://localhost:3000
echo.
echo Done! Keep this window open.
pause
