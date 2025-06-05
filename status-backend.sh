#!/bin/bash

echo "Verificando estado del YuhuHero Backend..."

if [ -f /var/www/yuhuhero/yuhuhero/game_back/app.pid ]; then
    PID=$(cat /var/www/yuhuhero/yuhuhero/game_back/app.pid)
    if ps -p $PID > /dev/null; then
        echo "El backend está activo con PID $PID"
        echo "Ver logs con: tail -f /var/www/yuhuhero/yuhuhero/game_back/app.log"
    else
        echo "El PID $PID no está activo, pero el archivo PID existe."
        echo "El backend podría estar caído. Reinícialo con run-backend-daemon.sh"
    fi
else
    # Comprobar si hay procesos de uvicorn ejecutándose
    PIDS=$(pgrep -f "uvicorn main:app")
    if [ -n "$PIDS" ]; then
        echo "El backend está activo con PID(s): $PIDS"
        echo "El archivo PID no existe. Esto podría causar problemas al detener el servicio."
    else
        echo "No hay procesos de backend ejecutándose."
        echo "Inicia el backend con run-backend-daemon.sh"
    fi
fi 