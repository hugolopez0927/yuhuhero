# Configuración DNS para game.yuhu.mx

## 📋 Registros DNS necesarios

### En tu panel de control de dominio (donde compraste yuhu.mx):

1. **Registro A principal:**
   ```
   Nombre: game
   Tipo: A
   Valor: [IP_DE_TU_SERVIDOR]
   TTL: 300 (5 minutos)
   ```

2. **Registro CNAME para www:**
   ```
   Nombre: www.game
   Tipo: CNAME
   Valor: game.yuhu.mx
   TTL: 300
   ```

## 🔍 Verificar configuración DNS

### Desde tu computadora local:
```bash
# Verificar que el dominio apunte a tu servidor
nslookup game.yuhu.mx

# Verificar www
nslookup www.game.yuhu.mx

# Usar dig para más detalles
dig game.yuhu.mx +short
dig www.game.yuhu.mx +short
```

### Desde el servidor:
```bash
# Verificar conectividad
ping game.yuhu.mx
curl -I http://game.yuhu.mx
```

## ⏱️ Tiempo de propagación

- **TTL bajo (300s)**: Los cambios se verán en 5-30 minutos
- **Propagación completa**: Puede tomar hasta 24-48 horas globalmente
- **Verificar propagación**: https://dnschecker.org

## 🚨 Importante antes de ejecutar los scripts

1. **Reemplaza `[IP_DE_TU_SERVIDOR]`** con la IP real de tu servidor
2. **Espera a que el DNS se propague** antes de obtener el certificado SSL
3. **Verifica** que `game.yuhu.mx` resuelva correctamente antes de continuar

## 🔧 Ejemplo de configuración en proveedores comunes

### Cloudflare:
- Dominio: `game`
- Tipo: `A`
- IPv4: `[TU_IP_SERVIDOR]`
- Proxy: ❌ (Deshabilitado para SSL inicial)

### Namecheap/GoDaddy:
- Host: `game`
- Tipo: `A Record`
- Valor: `[TU_IP_SERVIDOR]`
- TTL: `Automatic` o `300` 