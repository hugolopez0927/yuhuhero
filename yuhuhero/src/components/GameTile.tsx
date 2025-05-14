import React from 'react';
import { motion } from 'framer-motion';
// Importar las imágenes desde src/assets/images
import tileImage from '../assets/images/tile.png';
import tileMisteryImage from '../assets/images/tile_mistery.png';
import tileGiftImage from '../assets/images/tile_gift.png';
import candadoImage from '../assets/images/candado.png';

interface GameTileProps {
  type: 'savings' | 'investment' | 'debt' | 'mystery' | 'gift';
  onTileClick: () => void;
  isLocked?: boolean; // Indica si el tile está bloqueado
}

const GameTile: React.FC<GameTileProps> = ({ type, onTileClick, isLocked = false }) => {
  // Determinar qué imagen usar según el tipo
  const imageSrc = 
    type === 'mystery' ? tileMisteryImage :
    type === 'gift' ? tileGiftImage :
    tileImage;

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
        alt={`${type} Tile`} 
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