import React from 'react';
import { motion } from 'framer-motion';

const Fox: React.FC = () => {
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
      />
    </motion.div>
  );
};

export default Fox; 