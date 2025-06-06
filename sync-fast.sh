#!/bin/bash

# Script de sincronización rápida
# Sube cambios directamente al servidor sin git

SERVER_IP="198.211.97.86"
SSH_KEY="C:\Users\HugoLopez\.ssh\id_rsa"

echo "⚡ Sincronización rápida de cambios..."

# Sincronizar archivos del frontend directamente
echo "📤 Subiendo cambios del frontend..."
rsync -avz --delete -e "ssh -i $SSH_KEY" \
  yuhuhero/game_front/src/ \
  root@$SERVER_IP:/var/www/yuhuhero/yuhuhero/game_front/src/

# Hacer build y copiar en el servidor
echo "🔄 Haciendo build en el servidor..."
ssh -i "$SSH_KEY" root@$SERVER_IP << 'EOF'
cd /var/www/yuhuhero/yuhuhero/game_front
npm run build
cp -r build/* /var/www/html/game.yuhu.mx/
echo "✅ Cambios aplicados!"
EOF

echo "🎉 ¡Listo! Los cambios ya están en https://yuhugame.padi.company/" 