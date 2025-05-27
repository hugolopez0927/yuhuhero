import React from 'react';
import { motion } from 'framer-motion';
// Importar las nuevas imágenes numeradas (se referencian dinámicamente)
import candadoImage from '../assets/images/candado.png';

interface GameTileProps {
  type: 'savings' | 'investment' | 'debt' | 'mystery' | 'gift';
  onTileClick: () => void;
  isLocked?: boolean; // Indica si el tile está bloqueado
  tileImage?: number; // Número de imagen específico (1-10)
  pathSide?: 'left' | 'right'; // Lado del camino (izquierdo o derecho)
}

const GameTile: React.FC<GameTileProps> = ({ 
  type, 
  onTileClick, 
  isLocked = false,
  tileImage,
  pathSide
}) => {
  // Usar el número de imagen pasado como prop, o calcular uno predeterminado
  let imageNumber = tileImage || 1;
  
  // Si no se proporciona un número de imagen específico, usar valores predeterminados
  if (!tileImage) {
    // Lado izquierdo (camino de ahorro)
    if (pathSide === 'left') {
      if (type === 'savings') {
        imageNumber = 1; // Imagen predeterminada para savings
      } else if (type === 'mystery') {
        imageNumber = 3; // Imagen predeterminada para mystery en lado izquierdo
      } else if (type === 'gift') {
        imageNumber = 5; // Imagen predeterminada para gift en lado izquierdo
      }
    }
    // Lado derecho (camino de deuda)
    else if (pathSide === 'right') {
      if (type === 'debt') {
        imageNumber = 6; // Imagen predeterminada para debt
      } else if (type === 'mystery') {
        imageNumber = 8; // Imagen predeterminada para mystery en lado derecho
      } else if (type === 'gift') {
        imageNumber = 10; // Imagen predeterminada para gift en lado derecho
      }
    }
  }
  
  // Construir la ruta de la imagen dinámicamente
  const imageSrc = `/images/${imageNumber}.png`;

  return (
    <motion.div 
      style={{ width: '70px', height: '70px' }}
      onClick={onTileClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="cursor-pointer relative"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ 
        repeat: Infinity, 
        duration: 2,
        ease: "easeInOut"
      }}
    >
      <img 
        src={imageSrc}
        alt={`${type} Tile (${imageNumber})`} 
        className="w-full h-full object-contain"
      />
      
      {/* Icono de candado para niveles bloqueados */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={candadoImage} 
            alt="Nivel bloqueado" 
            className="w-8 h-8 object-contain"
            style={{ filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))' }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default GameTile; 