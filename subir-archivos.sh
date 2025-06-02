#!/bin/bash

# Script para subir archivos de configuración al servidor
# Ejecutar desde tu computadora local (Windows/WSL)

# Variables - CONFIGURADAS PARA TU SERVIDOR
SERVER_IP="198.211.97.86"
SERVER_USER="root"
SSH_KEY="C:\Users\HugoLopez\.ssh\id_rsa"  # Ruta de tu clave SSH

echo "🚀 Subiendo archivos de configuración a game.yuhu.mx"

# Verificar que los archivos existen
echo "🔍 Verificando archivos locales..."
required_files=(
    "setup-server.sh"
    "deploy-app.sh" 
    "nginx-config/game.yuhu.mx.conf"
    "verificar-dns.sh"
    "DNS-CONFIG.md"
    "INSTALACION-COMPLETA.md"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ Faltan archivos:"
    printf ' - %s\n' "${missing_files[@]}"
    echo "⚠️  Asegúrate de estar en el directorio correcto"
    exit 1
fi

echo "✅ Todos los archivos están presentes"

# Verificar conectividad SSH
echo "🔐 Verificando conectividad SSH..."
if ! ssh -i "$SSH_KEY" -o BatchMode=yes -o ConnectTimeout=5 "$SERVER_USER@$SERVER_IP" echo "Conectado" 2>/dev/null; then
    echo "❌ No se puede conectar por SSH"
    echo "🔧 Verifica:"
    echo "   - IP del servidor: $SERVER_IP"
    echo "   - Usuario: $SERVER_USER"
    echo "   - Clave SSH: $SSH_KEY"
    echo "   - Firewall del servidor (puerto 22)"
    exit 1
fi

echo "✅ SSH conectado correctamente"

# Crear directorios en el servidor
echo "📁 Creando directorios en el servidor..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "mkdir -p /tmp/yuhuhero-config/nginx-config"

# Subir archivos
echo "📤 Subiendo archivos de configuración..."
scp -i "$SSH_KEY" nginx-config/game.yuhu.mx.conf "$SERVER_USER@$SERVER_IP:/etc/nginx/sites-available/"
scp -i "$SSH_KEY" setup-server.sh "$SERVER_USER@$SERVER_IP:/root/"
scp -i "$SSH_KEY" deploy-app.sh "$SERVER_USER@$SERVER_IP:/root/"

echo "  → verificar-dns.sh"
scp -i "$SSH_KEY" "verificar-dns.sh" "$SERVER_USER@$SERVER_IP:/tmp/yuhuhero-config/"

echo "  → Archivos de documentación"
scp -i "$SSH_KEY" "DNS-CONFIG.md" "INSTALACION-COMPLETA.md" "$SERVER_USER@$SERVER_IP:/tmp/yuhuhero-config/"

# Hacer ejecutables los scripts
echo "🔧 Configurando permisos..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "chmod +x /tmp/yuhuhero-config/*.sh"

echo "✅ Archivos subidos correctamente"

echo "🔄 Ejecutando deployment..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "
    echo '🚀 Iniciando deployment desde rama main...'
    cd /var/www
    
    # Eliminar clon anterior
    rm -rf yuhuhero
    
    # Clonar desde rama main
    git clone -b main https://github.com/hugolopez0927/yuhuhero.git
    cd yuhuhero
    
    echo '📋 Verificando estructura del proyecto:'
    ls -la
    
    echo '📂 Verificando carpetas importantes:'
    echo '=== backend ==='
    ls -la backend/ 2>/dev/null || echo 'No hay carpeta backend directa'
    
    echo '=== yuhuhero ==='
    ls -la yuhuhero/ 2>/dev/null || echo 'No hay carpeta yuhuhero directa'
    
    echo '=== game_front ==='
    ls -la yuhuhero/game_front/ 2>/dev/null || echo 'No hay game_front en yuhuhero/'
    
    echo '=== game_back ==='
    ls -la yuhuhero/game_back/ 2>/dev/null || echo 'No hay game_back en yuhuhero/'
"

echo "✅ Verificación completada. Revisa la salida para confirmar que todas las carpetas están presentes."

echo ""
echo "📋 Próximos pasos en el SERVIDOR:"
echo "1. Conectarte por SSH:"
echo "   ssh -i \"$SSH_KEY\" $SERVER_USER@$SERVER_IP"
echo ""
echo "2. Ir al directorio de configuración:"
echo "   cd /tmp/yuhuhero-config"
echo ""
echo "3. Verificar DNS primero:"
echo "   ./verificar-dns.sh"
echo ""
echo "4. Si DNS está OK, ejecutar configuración:"
echo "   sudo bash setup-server.sh"
echo ""
echo "🚨 IMPORTANTE: No olvides editar la URL del repositorio en deploy-app.sh" 