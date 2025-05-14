import React from 'react';
import { motion } from 'framer-motion';
import FoxSVG from '../assets/images/FoxSVG';

const Astronaut: React.FC = () => {
  return (
    <motion.div 
      className="absolute bottom-20 left-[45%] w-24 h-24 z-10"
      animate={{ y: [0, -8, 0] }}
      transition={{ 
        repeat: Infinity, 
        duration: 3,
        ease: "easeInOut"
      }}
    >
      <FoxSVG />
    </motion.div>
  );
};

export default Astronaut; 