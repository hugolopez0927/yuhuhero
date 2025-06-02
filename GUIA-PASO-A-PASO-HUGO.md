# 🚀 Guía Paso a Paso - Hugo López - game.yuhu.mx

## 📊 Tu configuración:
- **IP Servidor:** 198.211.97.86
- **SSH:** `ssh -i "C:\Users\HugoLopez\.ssh\id_rsa" root@198.211.97.86`
- **Dominio objetivo:** game.yuhu.mx

---

## **🔧 PASO 1: Configurar DNS (PRIMERO Y MÁS IMPORTANTE)**

### ¿Dónde compraste yuhu.mx?
Necesitas ir al panel de control donde compraste el dominio (Namecheap, GoDaddy, Cloudflare, etc.)

### Agregar este registro DNS:
```
Nombre/Host: game
Tipo: A
Valor/IP: 198.211.97.86
TTL: 300 (o Automático)
```

### Ejemplos por proveedor:

**Si es Namecheap:**
1. Login → Domain List → Manage → Advanced DNS
2. Add New Record:
   - Type: `A Record`
   - Host: `game`
   - Value: `198.211.97.86`
   - TTL: `Automatic`

**Si es Cloudflare:**
1. Dashboard → tu dominio → DNS → Records
2. Add record:
   - Type: `A`
   - Name: `game`
   - IPv4 address: `198.211.97.86`
   - Proxy status: ❌ DNS only (por ahora)

**Si es GoDaddy:**
1. My Products → Domains → DNS
2. Add → A Record:
   - Host: `game`
   - Points to: `198.211.97.86`
   - TTL: `600 seconds`

---

## **🔍 PASO 2: Verificar DNS (Esperar 5-30 minutos después del Paso 1)**

Desde tu computadora Windows (PowerShell o WSL):

```powershell
# Verificar resolución DNS
nslookup game.yuhu.mx

# Debería devolver: 198.211.97.86
```

### Si no funciona aún:
- ⏰ Espera más tiempo (hasta 2 horas máximo)
- 🌐 Verifica en: https://dnschecker.org
- 🔄 Revisa que pusiste el registro DNS correctamente

---

## **📤 PASO 3: Subir archivos al servidor**

Desde tu directorio donde tienes los archivos (PowerShell o WSL):

```bash
# Hacer ejecutable el script
chmod +x subir-archivos.sh

# Ejecutar (ya está configurado con tu IP y clave SSH)
./subir-archivos.sh
```

---

## **🖥️ PASO 4: Conectarse al servidor y verificar**

```bash
# Conectar al servidor
ssh -i "C:\Users\HugoLopez\.ssh\id_rsa" root@198.211.97.86

# Una vez conectado, ir al directorio
cd /tmp/yuhuhero-config

# Verificar que DNS funciona desde el servidor
./verificar-dns.sh
```

**⚠️ IMPORTANTE:** Si `verificar-dns.sh` dice que DNS no está configurado, NO continúes. Regresa al Paso 1.

---

## **⚙️ PASO 5: Configurar el servidor (si DNS está OK)**

```bash
# Ejecutar configuración completa del servidor
sudo bash setup-server.sh
```

Este script va a:
- ✅ Instalar Nginx, Node.js, Python, MongoDB
- ✅ Configurar firewall
- ✅ Obtener certificado SSL automáticamente
- ✅ Instalar PM2

**Tiempo estimado:** 10-15 minutos

---

## **📋 PASO 6: Configurar tu repositorio**

```bash
# Editar la URL de tu repositorio
nano deploy-app.sh

# Buscar esta línea:
REPO_URL="https://github.com/tu-usuario/yuhuhero.git"

# Cambiarla por la URL real de tu repositorio, ejemplo:
REPO_URL="https://github.com/HugoLopez/yuhuhero.git"
# O si es privado:
REPO_URL="git@github.com:HugoLopez/yuhuhero.git"
```

---

## **🚀 PASO 7: Deployar la aplicación**

```bash
# Ejecutar deployment
sudo bash deploy-app.sh
```

Este script va a:
- 📥 Clonar tu repositorio
- 📦 Instalar dependencias de Node.js y Python
- ⚛️ Hacer build del frontend React
- 🔄 Configurar PM2 para los backends
- 🌐 Actualizar configuración de Nginx

---

## **🔒 PASO 8: Configurar secretos de producción**

```bash
# Editar backend Node.js
nano /var/www/game.yuhu.mx/backend/.env

# Cambiar esta línea por algo seguro:
JWT_SECRET=tu_secreto_super_seguro_aleatorio_aqui_123456789

# Editar backend Python
nano /var/www/game.yuhu.mx/yuhuhero/game_back/.env

# Cambiar esta línea:
SECRET_KEY=otro_secreto_diferente_y_seguro_987654321

# Reiniciar aplicaciones
pm2 restart all
```

---

## **🎯 PASO 9: Verificar que todo funciona**

### Verificar servicios:
```bash
# Estado de aplicaciones
pm2 status

# Ver logs si hay problemas
pm2 logs

# Estado de Nginx
systemctl status nginx

# Estado de MongoDB
systemctl status mongod
```

### Probar en el navegador:
- 🌐 **Frontend:** https://game.yuhu.mx
- 🔌 **API Node.js:** https://game.yuhu.mx/api/v1/
- 🐍 **API Python:** https://game.yuhu.mx/api/v2/

---

## **🔧 Comandos útiles para después:**

```bash
# Ver estado de aplicaciones
pm2 status

# Ver logs en tiempo real
pm2 logs

# Reiniciar aplicaciones
pm2 restart all

# Verificar certificado SSL
certbot certificates

# Ver logs de Nginx
tail -f /var/log/nginx/error.log
```

---

## **🚨 Si algo sale mal:**

### DNS no funciona:
1. Verifica el registro DNS en tu proveedor
2. Espera más tiempo (hasta 2 horas)
3. Usa https://dnschecker.org para verificar propagación

### SSL no se obtiene:
1. Verifica que DNS esté funcionando primero
2. Ejecuta: `certbot --nginx -d game.yuhu.mx`

### Aplicación no carga:
1. Verifica PM2: `pm2 status`
2. Ver logs: `pm2 logs`
3. Verificar Nginx: `systemctl status nginx`

---

## **📞 ¿Dudas? Dime en qué paso estás y te ayudo específicamente.**

¡Empezamos con el **PASO 1: Configurar DNS**! 🚀 