import React from 'react';
import { motion } from 'framer-motion';
// Importar las imágenes de planetas desde assets
import planetaImage from '../assets/images/planeta.png';
import planeta2Image from '../assets/images/planeta2.png';

export interface PlanetProps {
  type: 'savings' | 'investment' | 'debt';
  size: number;
  x: number;
  y: number;
  label?: string;
  shouldRotate?: boolean;
  oscillate?: boolean;
}

const Planet: React.FC<PlanetProps> = ({
  type,
  size,
  x,
  y,
  label = '',
  shouldRotate = true,
  oscillate = false,
}) => {
  // Determinar la imagen a usar en función del tipo
  const imageSrc = 
    type === 'debt' ? planeta2Image : 
    planetaImage;
  
  // Definir animación basada en las props shouldRotate y oscillate
  let animationProps = {};
  let transitionProps = {};
  
  if (shouldRotate) {
    // Rotación completa
    animationProps = {
      rotate: 360,
    };
    transitionProps = {
      repeat: Infinity,
      duration: 40,
      ease: "linear",
    };
  } else if (oscillate) {
    // Movimiento oscilatorio (de ida y vuelta)
    animationProps = {
      rotate: [0, 15, 0, -15, 0],
    };
    transitionProps = {
      repeat: Infinity,
      duration: 4,
      ease: "easeInOut",
    };
  }
  
  return (
    <div 
      className="absolute"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`, 
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
      }}
    >
      <motion.div 
        animate={animationProps}
        transition={transitionProps}
        className="relative"
      >
        <img 
          src={imageSrc} 
          alt={`${type} planet`} 
          className="block" 
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            filter: type === 'investment' ? 'hue-rotate(200deg) brightness(1.2)' : 'none'
          }} 
        />
        
        {/* Mostrar etiqueta si existe */}
        {label && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-white text-lg font-bold">
            {label}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Planet;