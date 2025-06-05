#!/bin/bash

echo "Deteniendo YuhuHero Backend..."
if [ -f /var/www/yuhuhero/yuhuhero/game_back/app.pid ]; then
    PID=$(cat /var/www/yuhuhero/yuhuhero/game_back/app.pid)
    kill $PID 2>/dev/null || true
    rm /var/www/yuhuhero/yuhuhero/game_back/app.pid
    echo "Proceso con PID $PID detenido."
else
    # Si no hay archivo PID, intentar matar por nombre
    pkill -f "uvicorn main:app" || true
    echo "Procesos uvicorn detenidos."
fi 