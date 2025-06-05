#!/bin/bash

# Navegar al directorio del proyecto
cd /var/www/yuhuhero/yuhuhero/game_back

# Activar el entorno virtual
source venv/bin/activate

# Matar cualquier proceso de uvicorn existente
pkill -f "uvicorn main:app"

# Esperar un momento para asegurarse de que los procesos anteriores se cierren
sleep 2

# Iniciar el servidor en segundo plano
nohup uvicorn main:app --host 0.0.0.0 --port 5001 > app.log 2>&1 &

# Guardar el PID para referencia futura
echo $! > app.pid

echo "YuhuHero backend iniciado con PID $(cat app.pid)" 