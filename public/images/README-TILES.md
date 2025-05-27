# Instrucciones para las imágenes de Tiles (Casillas)

## Nuevas imágenes numeradas

Se han configurado las casillas (tiles) para utilizar imágenes numeradas del 1 al 12. Debes colocar estas imágenes en la carpeta `public/images/` siguiendo esta estructura:

1. **1.png, 2.png, 3.png, 4.png** - Imágenes para las casillas de ahorro (savings)
2. **5.png, 6.png, 7.png, 8.png** - Imágenes para las casillas de deuda (debt)
3. **9.png, 10.png** - Imágenes para las casillas de misterio (mystery)
4. **11.png, 12.png** - Imágenes para las casillas de regalo (gift)

## Instrucciones para colocar las imágenes

1. Asegúrate de que los nombres de archivo sean exactamente como se especifica (sólo números)
2. Coloca las imágenes directamente en la carpeta `public/images/`
3. Las imágenes deben estar en formato PNG

## Cómo funciona

El código seleccionará automáticamente las imágenes apropiadas basándose en el tipo de casilla:
- Para casillas de ahorro (savings): seleccionará aleatoriamente una imagen entre 1.png y 4.png
- Para casillas de deuda (debt): seleccionará aleatoriamente una imagen entre 5.png y 8.png
- Para casillas de misterio (mystery): seleccionará aleatoriamente una imagen entre 9.png y 10.png
- Para casillas de regalo (gift): seleccionará aleatoriamente una imagen entre 11.png y 12.png

Esto proporciona variedad visual a las casillas del mismo tipo en el mapa del juego. 