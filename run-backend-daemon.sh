#!/bin/bash

echo "Iniciando YuhuHero Backend como daemon..."
cd /var/www/yuhuhero/yuhuhero/game_back
source venv/bin/activate

# Matar cualquier instancia previa
pkill -f "uvicorn main:app" || true

# Esperar a que los procesos se cierren
sleep 2

# Iniciar en modo daemon
nohup uvicorn main:app --host 0.0.0.0 --port 5001 > app.log 2>&1 &

# Guardar PID
echo $! > app.pid

echo "Backend iniciado en segundo plano con PID $(cat app.pid)"
echo "Usa 'tail -f /var/www/yuhuhero/yuhuhero/game_back/app.log' para ver los logs" 