import React from 'react';
import { motion } from 'framer-motion';
// Importar la imagen de la Tierra
import tierraImage from '../assets/images/tierra.png';

const Earth: React.FC = () => {
  return (
    <motion.div 
      className="fixed left-0 right-0" 
      style={{ 
        height: '425px',
        bottom: '-250px',
        backgroundImage: `url(${tierraImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        transform: 'scale(2.5)',
        transformOrigin: 'center center',
        zIndex: 15
      }}
      animate={{ 
        rotate: 360
      }}
      transition={{ 
        duration: 300, 
        repeat: Infinity, 
        ease: "linear"
      }}
    />
  );
};

export default Earth; 