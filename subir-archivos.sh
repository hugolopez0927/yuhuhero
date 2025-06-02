#!/bin/bash

# Script para subir archivos de configuración al servidor
# Ejecutar desde tu computadora local (Windows/WSL)

# Variables - CONFIGURADAS PARA TU SERVIDOR
SERVER_IP="198.211.97.86"
SERVER_USER="root"
SSH_KEY="C:\Users\HugoLopez\.ssh\id_rsa"  # Ruta de tu clave SSH

echo "🚀 Subiendo archivos de configuración a game.yuhu.mx..."
echo "📡 Servidor: $SERVER_USER@$SERVER_IP"
echo "🔐 Usando clave SSH: $SSH_KEY"

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
echo "📤 Subiendo archivos..."

echo "  → setup-server.sh"
scp -i "$SSH_KEY" "setup-server.sh" "$SERVER_USER@$SERVER_IP:/tmp/yuhuhero-config/"

echo "  → deploy-app.sh" 
scp -i "$SSH_KEY" "deploy-app.sh" "$SERVER_USER@$SERVER_IP:/tmp/yuhuhero-config/"

echo "  → verificar-dns.sh"
scp -i "$SSH_KEY" "verificar-dns.sh" "$SERVER_USER@$SERVER_IP:/tmp/yuhuhero-config/"

echo "  → nginx-config/game.yuhu.mx.conf"
scp -i "$SSH_KEY" "nginx-config/game.yuhu.mx.conf" "$SERVER_USER@$SERVER_IP:/tmp/yuhuhero-config/nginx-config/"

echo "  → Archivos de documentación"
scp -i "$SSH_KEY" "DNS-CONFIG.md" "INSTALACION-COMPLETA.md" "$SERVER_USER@$SERVER_IP:/tmp/yuhuhero-config/"

# Hacer ejecutables los scripts
echo "🔧 Configurando permisos..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "chmod +x /tmp/yuhuhero-config/*.sh"

echo "✅ ¡Archivos subidos correctamente!"
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