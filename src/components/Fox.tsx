import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Fox: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  // Si hay un error con la imagen, mostrar un placeholder
  if (imageError) {
    return (
      <motion.div 
        className="fixed top-[65%] left-[35%] w-28 h-32"
        style={{ zIndex: 30 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-amber-500 rounded-full flex items-center justify-center text-white">
          🦊
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="fixed top-[65%] left-[35%] w-28 h-32"
      style={{ zIndex: 30 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ 
        repeat: Infinity, 
        duration: 3,
        ease: "easeInOut"
      }}
    >
      <img 
        src="/assets/images/zorro.png" 
        alt="Zorro" 
        className="w-full h-full object-contain"
        onError={() => setImageError(true)}
      />
    </motion.div>
  );
};

export default Fox; 