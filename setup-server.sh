#!/bin/bash

# Script de configuración para game.yuhu.mx
# Ejecutar como root: sudo bash setup-server.sh

set -e

echo "🚀 Configurando servidor para game.yuhu.mx..."

# Variables
DOMAIN="game.yuhu.mx"
PROJECT_DIR="/var/www/$DOMAIN"
USER=$(whoami)

# 1. Actualizar sistema
echo "📦 Actualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar dependencias básicas
echo "🔧 Instalando dependencias..."
apt install -y curl wget git nginx certbot python3-certbot-nginx \
    nodejs npm python3 python3-pip mongodb-org build-essential

# 3. Instalar Node.js LTS (si no está actualizado)
echo "📊 Instalando Node.js LTS..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
apt-get install -y nodejs

# 4. Instalar PM2 para manejo de procesos
echo "⚙️ Instalando PM2..."
npm install -g pm2

# 5. Crear directorio del proyecto
echo "📁 Creando directorios..."
mkdir -p $PROJECT_DIR
mkdir -p /var/log/yuhuhero

# 6. Configurar MongoDB
echo "🗄️ Configurando MongoDB..."
systemctl start mongod
systemctl enable mongod

# 7. Configurar firewall
echo "🔥 Configurando firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 8. Configurar Nginx
echo "🌐 Configurando Nginx..."
# Remover configuración por defecto
rm -f /etc/nginx/sites-enabled/default

# Copiar nuestra configuración (temporal sin SSL)
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    server_name game.yuhu.mx www.game.yuhu.mx;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}
EOF

# Habilitar sitio
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 9. Obtener certificado SSL
echo "🔒 Obteniendo certificado SSL..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@yuhu.mx

# 10. Configurar la configuración final de Nginx con SSL
echo "🔐 Configurando Nginx con SSL..."
# La configuración completa se copiará manualmente después

echo "✅ Configuración básica completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Clonar tu repositorio en $PROJECT_DIR"
echo "2. Configurar variables de entorno"
echo "3. Instalar dependencias y hacer build"
echo "4. Configurar PM2 para los backends"
echo "5. Copiar la configuración final de Nginx"
echo ""
echo "🔗 El certificado SSL está listo para $DOMAIN" 