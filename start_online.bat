@echo off
title Blling POS - Remote Access Tunnel
echo Starting Tunnel for Mobile Upload...
echo.
echo Installing dependencies (only first time)...
call npm install localtunnel qrcode-terminal

echo.
echo Launching Server with Terminal QR...
node tunnel.js

pause
