# 📋 Comandos Específicos para Hugo - game.yuhu.mx

## 🚀 PASO A PASO SIMPLIFICADO

### ✅ DNS ya está funcionando (confirmado con nslookup)

---

## **PASO 1: Ejecutar desde PowerShell**

Abre PowerShell como **Administrador** y ejecuta:

```powershell
# Ir al directorio correcto
cd C:\Users\HugoLópez\yuhuhero

# Ejecutar script de configuración
.\setup-manual.ps1
```

**Cuando te pida la contraseña SSH, ingresa:** `Lopezh092701`

---

## **PASO 2: Conectarse al servidor**

```powershell
ssh -i "C:\Users\HugoLópez\.ssh\id_rsa" root@198.211.97.86
```

**Contraseña:** `Lopezh092701`

---

## **PASO 3: En el servidor, ejecutar estos comandos:**

```bash
# 1. Ir al directorio de configuración
cd /tmp/yuhuhero-config

# 2. Verificar que DNS funciona
./verificar-dns.sh

# 3. Si DNS está OK, configurar el servidor
sudo bash setup-server.sh
```

⏱️ **Este paso toma 10-15 minutos** (instala todo: Nginx, Node.js, Python, MongoDB, SSL)

---

## **PASO 4: Configurar tu repositorio**

```bash
# Editar URL del repositorio
nano deploy-app.sh

# Cambiar esta línea:
REPO_URL="https://github.com/tu-usuario/yuhuhero.git"

# Por tu repositorio real, ejemplo:
REPO_URL="https://github.com/HugoLopez/yuhuhero.git"
```

**Guardar:** `Ctrl+X`, luego `Y`, luego `Enter`

---

## **PASO 5: Deployar la aplicación**

```bash
sudo bash deploy-app.sh
```

⏱️ **Este paso toma 5-10 minutos** (clona repo, instala dependencias, hace build)

---

## **PASO 6: Configurar secretos (IMPORTANTE)**

```bash
# 1. Editar backend Node.js
nano /var/www/game.yuhu.mx/backend/.env

# Cambiar esta línea por algo seguro:
JWT_SECRET=mi_secreto_super_seguro_123456789

# Guardar: Ctrl+X, Y, Enter

# 2. Editar backend Python  
nano /var/www/game.yuhu.mx/yuhuhero/game_back/.env

# Cambiar esta línea:
SECRET_KEY=otro_secreto_diferente_987654321

# Guardar: Ctrl+X, Y, Enter

# 3. Reiniciar aplicaciones
pm2 restart all
```

---

## **PASO 7: Verificar que funciona**

```bash
# Ver estado de aplicaciones
pm2 status

# Ver logs si hay problemas
pm2 logs

# Estado de servicios
systemctl status nginx
systemctl status mongod
```

### Probar en el navegador:
- 🌐 **https://game.yuhu.mx** (Frontend)
- 🔌 **https://game.yuhu.mx/api/v1/** (API Node.js)
- 🐍 **https://game.yuhu.mx/api/v2/** (API Python)

---

## **🚨 Si algo sale mal:**

### SSL no se obtiene:
```bash
certbot --nginx -d game.yuhu.mx -d www.game.yuhu.mx
```

### Aplicación no responde:
```bash
pm2 restart all
systemctl restart nginx
```

### Ver logs de errores:
```bash
pm2 logs
tail -f /var/log/nginx/error.log
```

---

## **📞 Dime en qué paso estás y te ayudo específicamente**

**¿Cuál es la URL de tu repositorio en GitHub?** (para el Paso 4) 