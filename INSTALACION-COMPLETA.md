# 🚀 Guía Completa de Instalación - YuhuHero en game.yuhu.mx

## 📋 Prerequisitos

- **Servidor Ubuntu/Debian** con acceso root
- **Dominio yuhu.mx** configurado
- **IP pública** del servidor
- **Acceso SSH** al servidor

## 🔧 Paso 1: Configurar DNS

1. **Ve a tu proveedor de dominio** (donde compraste yuhu.mx)
2. **Agrega estos registros DNS:**
   ```
   Nombre: game
   Tipo: A
   Valor: [IP_DE_TU_SERVIDOR]  ← Reemplaza con tu IP real
   ```
   ```
   Nombre: www.game
   Tipo: CNAME
   Valor: game.yuhu.mx
   ```

3. **Verificar DNS** (espera 5-30 minutos):
   ```bash
   nslookup game.yuhu.mx
   ```

## 🖥️ Paso 2: Preparar el servidor

1. **Conectarse por SSH:**
   ```bash
   ssh root@[IP_DE_TU_SERVIDOR]
   ```

2. **Subir archivos de configuración:**
   ```bash
   # Crear directorio temporal
   mkdir -p /tmp/yuhuhero-config
   cd /tmp/yuhuhero-config
   ```

3. **Copiar los archivos** `setup-server.sh`, `deploy-app.sh`, y `nginx-config/game.yuhu.mx.conf` al servidor

## ⚙️ Paso 3: Ejecutar configuración inicial

```bash
# Hacer ejecutables los scripts
chmod +x setup-server.sh deploy-app.sh

# Ejecutar configuración del servidor
sudo bash setup-server.sh
```

Este script instalará:
- ✅ Nginx
- ✅ Node.js y npm
- ✅ Python 3 y pip
- ✅ MongoDB
- ✅ PM2
- ✅ Certbot (Let's Encrypt)
- ✅ Certificado SSL automático

## 🚀 Paso 4: Deployar la aplicación

1. **Editar la URL del repositorio** en `deploy-app.sh`:
   ```bash
   nano deploy-app.sh
   # Cambiar: REPO_URL="https://github.com/tu-usuario/yuhuhero.git"
   # Por tu repositorio real
   ```

2. **Ejecutar deployment:**
   ```bash
   sudo bash deploy-app.sh
   ```

## 🔒 Paso 5: Configurar secretos de producción

**⚠️ IMPORTANTE: Cambiar los secretos por defecto**

1. **Backend Node.js:**
   ```bash
   nano /var/www/game.yuhu.mx/backend/.env
   ```
   Cambiar:
   ```env
   JWT_SECRET=tu_jwt_secret_super_seguro_aqui_generar_aleatorio
   ```

2. **Backend Python:**
   ```bash
   nano /var/www/game.yuhu.mx/yuhuhero/game_back/.env
   ```
   Cambiar:
   ```env
   SECRET_KEY=tu_secret_key_super_seguro_aqui_generar_aleatorio
   ```

3. **Reiniciar aplicaciones:**
   ```bash
   pm2 restart all
   ```

## 🎯 Paso 6: Verificar instalación

### ✅ Verificar servicios:
```bash
# Estado de Nginx
systemctl status nginx

# Estado de MongoDB
systemctl status mongod

# Estado de aplicaciones PM2
pm2 status

# Logs de aplicaciones
pm2 logs
```

### 🌐 Verificar en el navegador:
- **Frontend**: https://game.yuhu.mx
- **API Node.js**: https://game.yuhu.mx/api/v1/
- **API Python**: https://game.yuhu.mx/api/v2/

### 🔒 Verificar SSL:
```bash
# Verificar certificado
curl -I https://game.yuhu.mx
```

## 🔄 Comandos útiles de mantenimiento

### PM2 (Gestión de procesos):
```bash
pm2 status              # Ver estado
pm2 restart all         # Reiniciar todo
pm2 logs                # Ver logs
pm2 monit              # Monitor en tiempo real
```

### Nginx:
```bash
nginx -t                # Verificar configuración
systemctl reload nginx  # Recargar configuración
systemctl status nginx  # Ver estado
```

### SSL:
```bash
certbot certificates    # Ver certificados
certbot renew          # Renovar manualmente
```

### MongoDB:
```bash
systemctl status mongod # Ver estado
mongo                  # Conectar a MongoDB
```

## 🔧 Troubleshooting

### Si el sitio no carga:
1. Verificar DNS: `nslookup game.yuhu.mx`
2. Verificar Nginx: `systemctl status nginx`
3. Ver logs: `tail -f /var/log/nginx/error.log`

### Si las APIs no responden:
1. Verificar PM2: `pm2 status`
2. Ver logs: `pm2 logs`
3. Verificar puertos: `netstat -tlnp | grep :5000`

### Si SSL no funciona:
1. Verificar certificado: `certbot certificates`
2. Renovar: `certbot renew`
3. Verificar configuración Nginx: `nginx -t`

## 📝 Actualizaciones futuras

Para actualizar la aplicación:
```bash
cd /var/www/game.yuhu.mx
git pull origin main

# Si hay cambios en el frontend
cd yuhuhero/game_front
npm run build
cp -r build/* /var/www/game.yuhu.mx/build/

# Si hay cambios en backends
pm2 restart all
```

## 🎉 ¡Listo!

Tu aplicación YuhuHero debería estar funcionando en:
**https://game.yuhu.mx** 🚀 