#!/bin/bash

# Script para configurar auto-deployment automático
# Los cambios se despliegan automáticamente cuando haces push a GitHub

SERVER_IP="198.211.97.86"
SSH_KEY="C:\Users\HugoLopez\.ssh\id_rsa"

echo "🚀 Configurando auto-deployment automático..."

# Conectar al servidor y configurar webhook
ssh -i "$SSH_KEY" root@$SERVER_IP << 'EOF'

# Crear directorio para el webhook
mkdir -p /var/www/webhook

# Crear script de deployment automático
cat > /var/www/webhook/deploy.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
cd /var/www/yuhuhero
echo "📥 Pulling latest changes..."
git pull origin main

echo "⚛️ Building frontend..."
cd yuhuhero/game_front
npm run build

echo "📋 Copying to web directory..."
cp -r build/* /var/www/html/game.yuhu.mx/

echo "🔄 Restarting services..."
pm2 restart all

echo "✅ Deployment complete!"
date >> /var/log/auto-deploy.log
DEPLOY_SCRIPT

chmod +x /var/www/webhook/deploy.sh

# Instalar webhook listener
npm install -g github-webhook-handler
cat > /var/www/webhook/webhook.js << 'WEBHOOK_SCRIPT'
const http = require('http');
const createHandler = require('github-webhook-handler');
const { exec } = require('child_process');

const handler = createHandler({ path: '/webhook', secret: 'yuhuhero-secret' });

http.createServer((req, res) => {
  handler(req, res, (err) => {
    res.statusCode = 404;
    res.end('no such location');
  });
}).listen(7777);

handler.on('error', (err) => {
  console.error('Error:', err.message);
});

handler.on('push', (event) => {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
    
  // Ejecutar deployment
  exec('/var/www/webhook/deploy.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    console.log(`Output: ${stdout}`);
  });
});

console.log('Webhook server running on port 7777');
WEBHOOK_SCRIPT

# Iniciar webhook con PM2
pm2 start /var/www/webhook/webhook.js --name "github-webhook"
pm2 save

echo "✅ Auto-deployment configurado!"
echo "🔗 Webhook URL: http://$SERVER_IP:7777/webhook"

EOF

echo "✅ Configuración completada!"
echo ""
echo "📋 Ahora configura en GitHub:"
echo "1. Ve a tu repositorio en GitHub"
echo "2. Settings > Webhooks > Add webhook"  
echo "3. Payload URL: http://198.211.97.86:7777/webhook"
echo "4. Content type: application/json"
echo "5. Secret: yuhuhero-secret"
echo "6. Events: Just the push event"
echo ""
echo "🎉 ¡Listo! Ahora solo haz push y se despliega automático!" 