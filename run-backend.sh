#!/bin/bash

echo "Iniciando YuhuHero Backend..."
cd /var/www/yuhuhero/yuhuhero/game_back
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 5001 --reload 