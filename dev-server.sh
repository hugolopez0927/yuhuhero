#!/bin/bash

# Script para configurar desarrollo directo en servidor
# Con hot reload para cambios instantáneos

SERVER_IP="198.211.97.86"
SSH_KEY="C:\Users\HugoLopez\.ssh\id_rsa"

echo "🚀 Configurando desarrollo directo en servidor..."

# Configurar VS Code remote en el servidor
ssh -i "$SSH_KEY" root@$SERVER_IP << 'EOF'

# Instalar code-server para editar desde el navegador
curl -fsSL https://code-server.dev/install.sh | sh

# Configurar code-server
mkdir -p ~/.config/code-server
cat > ~/.config/code-server/config.yaml << 'CONFIG'
bind-addr: 0.0.0.0:8080
auth: password
password: yuhuhero2024
cert: false
CONFIG

# Configurar desarrollo con hot reload
cd /var/www/yuhuhero/yuhuhero/game_front

# Instalar concurrently para correr múltiples comandos
npm install -g concurrently

# Crear script de desarrollo
cat > dev-hot.sh << 'DEV_SCRIPT'
#!/bin/bash
concurrently \
  "npm start" \
  "watch -n 2 'cp -r build/* /var/www/html/game.yuhu.mx/ 2>/dev/null || true'"
DEV_SCRIPT

chmod +x dev-hot.sh

# Iniciar code-server
pm2 start code-server --name "vscode-server" -- --bind-addr 0.0.0.0:8080
pm2 save

echo "✅ Configuración completada!"
echo "🌐 VS Code: http://198.211.97.86:8080 (password: yuhuhero2024)"

EOF

echo "✅ ¡Listo!"
echo ""
echo "🖥️ Opciones de desarrollo:"
echo "1. Editar desde navegador: http://198.211.97.86:8080"
echo "2. Conectar VS Code remote: ssh root@198.211.97.86"
echo "3. Usar sync rápido: ./sync-fast.sh" 