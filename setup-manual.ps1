# Script de PowerShell para configurar YuhuHero en game.yuhu.mx
# Ejecutar desde PowerShell como Administrador

Write-Host "🚀 Configurando YuhuHero en game.yuhu.mx..." -ForegroundColor Green

# Variables
$SERVER_IP = "198.211.97.86"
$SSH_KEY = "C:\Users\HugoLópez\.ssh\id_rsa"

Write-Host "📡 Servidor: root@$SERVER_IP" -ForegroundColor Cyan

# 1. Subir archivos necesarios al servidor
Write-Host "📤 Subiendo archivos al servidor..." -ForegroundColor Yellow

# Crear directorio en el servidor
ssh -i "$SSH_KEY" root@$SERVER_IP "mkdir -p /tmp/yuhuhero-config/nginx-config"

# Subir archivos uno por uno
Write-Host "  → setup-server.sh"
scp -i "$SSH_KEY" "setup-server.sh" root@${SERVER_IP}:/tmp/yuhuhero-config/

Write-Host "  → deploy-app.sh"
scp -i "$SSH_KEY" "deploy-app.sh" root@${SERVER_IP}:/tmp/yuhuhero-config/

Write-Host "  → verificar-dns.sh"
scp -i "$SSH_KEY" "verificar-dns.sh" root@${SERVER_IP}:/tmp/yuhuhero-config/

Write-Host "  → nginx-config/game.yuhu.mx.conf"
scp -i "$SSH_KEY" "nginx-config/game.yuhu.mx.conf" root@${SERVER_IP}:/tmp/yuhuhero-config/nginx-config/

# Dar permisos ejecutables
ssh -i "$SSH_KEY" root@$SERVER_IP "chmod +x /tmp/yuhuhero-config/*.sh"

Write-Host "✅ Archivos subidos correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Ejecutar: ssh -i `"$SSH_KEY`" root@$SERVER_IP"
Write-Host "2. Ir a: cd /tmp/yuhuhero-config"
Write-Host "3. Verificar DNS: ./verificar-dns.sh"
Write-Host "4. Configurar servidor: sudo bash setup-server.sh"
Write-Host ""
Write-Host "🔗 Comando completo para conectarse:"
Write-Host "ssh -i `"$SSH_KEY`" root@$SERVER_IP" -ForegroundColor Cyan 