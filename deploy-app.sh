#!/bin/bash

# Script de deployment para YuhuHero
# Ejecutar después de setup-server.sh

set -e

echo "🚀 Deployando YuhuHero en game.yuhu.mx..."

# Variables
DOMAIN="game.yuhu.mx"
PROJECT_DIR="/var/www/$DOMAIN"
REPO_URL="https://github.com/tu-usuario/yuhuhero.git"  # Cambiar por tu repo

# 1. Clonar o actualizar repositorio
echo "📥 Clonando repositorio..."
if [ -d "$PROJECT_DIR/.git" ]; then
    cd $PROJECT_DIR
    git pull origin main
else
    git clone $REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
fi

# 2. Configurar variables de entorno para Node.js backend
echo "⚙️ Configurando variables de entorno..."
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yuhuhero
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
CORS_ORIGIN=https://game.yuhu.mx
EOF

# 3. Configurar variables de entorno para Python backend
cat > yuhuhero/game_back/.env << 'EOF'
ENVIRONMENT=production
MONGODB_URL=mongodb://localhost:27017/yuhuhero_game
SECRET_KEY=tu_secret_key_super_seguro_aqui
ALLOWED_ORIGINS=["https://game.yuhu.mx"]
EOF

# 4. Instalar dependencias Node.js backend
echo "📦 Instalando dependencias del backend Node.js..."
cd backend
npm install --production
cd ..

# 5. Instalar dependencias Python backend
echo "🐍 Instalando dependencias del backend Python..."
cd yuhuhero/game_back
pip3 install -r requirements.txt
cd ../..

# 6. Build del frontend React
echo "⚛️ Haciendo build del frontend..."
cd yuhuhero/game_front
npm install
npm run build
cd ../..

# 7. Copiar build al directorio web
echo "📋 Copiando archivos del frontend..."
rm -rf $PROJECT_DIR/build
cp -r yuhuhero/game_front/build $PROJECT_DIR/

# 8. Configurar PM2 para los backends
echo "🔄 Configurando PM2..."

# Configuración PM2 para Node.js backend
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'yuhuhero-backend-node',
      script: 'backend/index.js',
      cwd: '/var/www/game.yuhu.mx',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      log_file: '/var/log/yuhuhero/backend-node.log',
      error_file: '/var/log/yuhuhero/backend-node-error.log',
      out_file: '/var/log/yuhuhero/backend-node-out.log'
    },
    {
      name: 'yuhuhero-backend-python',
      script: 'python3',
      args: 'main.py',
      cwd: '/var/www/game.yuhu.mx/yuhuhero/game_back',
      instances: 1,
      exec_mode: 'fork',
      env: {
        HOST: '0.0.0.0',
        PORT: 8000
      },
      log_file: '/var/log/yuhuhero/backend-python.log',
      error_file: '/var/log/yuhuhero/backend-python-error.log',
      out_file: '/var/log/yuhuhero/backend-python-out.log'
    }
  ]
};
EOF

# 9. Iniciar aplicaciones con PM2
echo "🚀 Iniciando aplicaciones..."
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 10. Actualizar configuración de Nginx
echo "🌐 Actualizando configuración de Nginx..."
cp nginx-config/game.yuhu.mx.conf /etc/nginx/sites-available/$DOMAIN
nginx -t && systemctl reload nginx

# 11. Configurar renovación automática de SSL
echo "🔄 Configurando renovación automática de SSL..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "✅ ¡Deployment completado!"
echo ""
echo "🌐 Tu aplicación está disponible en: https://game.yuhu.mx"
echo "📊 Monitoreo con PM2: pm2 status"
echo "📝 Logs: pm2 logs"
echo ""
echo "🔍 Verificar estado:"
echo "  - Frontend: https://game.yuhu.mx"
echo "  - API Node.js: https://game.yuhu.mx/api/v1/"
echo "  - API Python: https://game.yuhu.mx/api/v2/" 