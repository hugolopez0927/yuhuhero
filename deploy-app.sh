#!/bin/bash

# Script de deployment para YuhuHero
# Ejecutar después de setup-server.sh

set -e

echo "🚀 Deployando YuhuHero en game.yuhu.mx..."

# Variables
DOMAIN="game.yuhu.mx"
PROJECT_DIR="/var/www/yuhuhero"
REPO_URL="https://github.com/hugolopez0927/yuhuhero.git"

# 1. Ya estamos en el directorio correcto
cd $PROJECT_DIR

# 2. Configurar variables de entorno para Node.js backend
echo "⚙️ Configurando variables de entorno para backend Node.js..."
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yuhuhero
JWT_SECRET=yuhuhero_jwt_secret_super_seguro_2024_hugo
CORS_ORIGIN=https://game.yuhu.mx
EOF

# 3. Configurar variables de entorno para Python backend
echo "⚙️ Configurando variables de entorno para backend Python..."
cat > yuhuhero/game_back/.env << 'EOF'
ENVIRONMENT=production
MONGODB_URL=mongodb://localhost:27017/yuhuhero_game
SECRET_KEY=yuhuhero_python_secret_super_seguro_2024_hugo
ALLOWED_ORIGINS=["https://game.yuhu.mx"]
EOF

# 4. Instalar dependencias Node.js backend
echo "📦 Instalando dependencias del backend Node.js..."
cd backend
npm install --omit=dev
cd ..

# 5. Crear ambiente virtual Python e instalar dependencias
echo "🐍 Configurando ambiente virtual Python..."
cd yuhuhero/game_back

# Crear ambiente virtual si no existe
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activar ambiente virtual e instalar dependencias
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ../..

# 6. Build del frontend React
echo "⚛️ Haciendo build del frontend..."
cd yuhuhero/game_front
npm install
npm run build
cd ../..

# 7. Copiar build al directorio web para Nginx
echo "📋 Copiando archivos del frontend..."
mkdir -p /var/www/html/game.yuhu.mx
rm -rf /var/www/html/game.yuhu.mx/*
cp -r yuhuhero/game_front/build/* /var/www/html/game.yuhu.mx/

# 8. Configurar PM2 para los backends
echo "🔄 Configurando PM2..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'yuhuhero-backend-node',
      script: 'backend/index.js',
      cwd: '/var/www/yuhuhero',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      log_file: '/var/log/yuhuhero-backend-node.log',
      error_file: '/var/log/yuhuhero-backend-node-error.log',
      out_file: '/var/log/yuhuhero-backend-node-out.log'
    },
    {
      name: 'yuhuhero-backend-python',
      script: 'yuhuhero/game_back/venv/bin/python',
      args: 'main.py',
      cwd: '/var/www/yuhuhero/yuhuhero/game_back',
      instances: 1,
      exec_mode: 'fork',
      env: {
        HOST: '0.0.0.0',
        PORT: 8000
      },
      log_file: '/var/log/yuhuhero-backend-python.log',
      error_file: '/var/log/yuhuhero-backend-python-error.log',
      out_file: '/var/log/yuhuhero-backend-python-out.log'
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

# 10. Habilitar sitio en Nginx
echo "🌐 Habilitando sitio en Nginx..."
ln -sf /etc/nginx/sites-available/game.yuhu.mx /etc/nginx/sites-enabled/
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