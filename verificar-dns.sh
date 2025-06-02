#!/bin/bash

# Script para verificar configuración DNS antes de continuar
echo "🔍 Verificando configuración DNS para game.yuhu.mx..."

# Función para verificar DNS
check_dns() {
    echo "📡 Comprobando resolución DNS..."
    
    # Verificar con nslookup
    if command -v nslookup >/dev/null 2>&1; then
        echo "Usando nslookup:"
        nslookup game.yuhu.mx
        echo ""
    fi
    
    # Verificar con dig si está disponible
    if command -v dig >/dev/null 2>&1; then
        echo "Usando dig:"
        dig game.yuhu.mx +short
        echo ""
    fi
    
    # Verificar con ping
    echo "Probando conectividad:"
    if ping -c 3 game.yuhu.mx >/dev/null 2>&1; then
        echo "✅ game.yuhu.mx responde a ping"
        IP=$(ping -c 1 game.yuhu.mx | grep "PING" | sed -E 's/.*\(([0-9.]+)\).*/\1/')
        echo "🌐 IP detectada: $IP"
    else
        echo "❌ game.yuhu.mx NO responde a ping"
        echo "⚠️  El DNS aún no está propagado o configurado incorrectamente"
        return 1
    fi
}

# Ejecutar verificación
if check_dns; then
    echo ""
    echo "✅ DNS está configurado correctamente!"
    echo "🚀 Puedes proceder con la instalación del servidor"
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. Conectarte a tu servidor por SSH"
    echo "2. Subir los archivos de configuración"
    echo "3. Ejecutar setup-server.sh"
else
    echo ""
    echo "❌ DNS no está configurado o no se ha propagado aún"
    echo ""
    echo "🔧 Acciones necesarias:"
    echo "1. Configurar registro DNS tipo A para 'game' apuntando a tu IP del servidor"
    echo "2. Esperar 5-30 minutos para propagación"
    echo "3. Ejecutar este script nuevamente"
    echo ""
    echo "📞 Verificar propagación en: https://dnschecker.org"
fi 