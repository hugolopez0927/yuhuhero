#!/bin/bash

# Navegar al directorio del proyecto
cd /var/www/yuhuhero/yuhuhero/game_back

# Activar el entorno virtual
source venv/bin/activate

# Iniciar el servidor en segundo plano
nohup uvicorn main:app --host 0.0.0.0 --port 5001 >> /var/www/yuhuhero/yuhuhero/game_back/app.log 2>&1 &

echo "Servidor iniciado en segundo plano. Consulta app.log para ver los logs." 