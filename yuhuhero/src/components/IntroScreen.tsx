import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const IntroScreen: React.FC = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);
  const [optionHovered, setOptionHovered] = useState<number | null>(null);

  const handleStartMission = () => {
    // Efecto visual de feedback
    setClicked(true);
    
    // Pequeño delay para mostrar el efecto antes de navegar
    setTimeout(() => {
      navigate('/quiz');
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1833] text-white p-4">
      {/* Logo */}
      <div className="w-24 h-24 bg-[#8B5CF6] rounded-3xl flex items-center justify-center mb-8">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 10C20 14.4183 16.4183 18 12 18C7.58172 18 4 14.4183 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10Z" stroke="white" strokeWidth="2"/>
          <path d="M15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9Z" fill="white"/>
          <path d="M8 21L10.5 15M16 21L13.5 15" stroke="white" strokeWidth="2"/>
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-2">¡Explora tu Universo Financiero!</h1>
      
      {/* Subtitle */}
      <p className="text-xl text-center mb-6 max-w-md">
        Embárcate en una aventura intergaláctica y descubre tu verdadero potencial en el universo de las finanzas.
      </p>
      
      {/* Rewards Banner - NEW */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-md bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] p-4 rounded-xl mb-8 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">¡Incrementa tus Beneficios!</h2>
        <p className="text-center mb-3">
          Completa misiones y aumenta tu saldo en Yuhudils y puntos para productos mientras exploras y aprendes.
        </p>
        <div className="flex justify-center items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <circle cx="12" cy="12" r="10" fill="#FFC107" stroke="#FFA000" strokeWidth="2"/>
            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#000" fontWeight="bold">Y</text>
          </svg>
          <span className="font-semibold">¡Todo esto mientras aprendes!</span>
        </div>
      </motion.div>

      {/* Options */}
      <div className="w-full max-w-md space-y-4 mb-8">
        <motion.div 
          className="flex items-center bg-opacity-20 bg-[#8B5CF6] p-4 rounded-xl cursor-pointer"
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(139, 92, 246, 0.3)' }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setOptionHovered(0)}
          onHoverEnd={() => setOptionHovered(null)}
        >
          <motion.div 
            className="w-12 h-12 bg-[#8B5CF6] rounded-full flex items-center justify-center mr-4"
            animate={optionHovered === 0 ? { scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="12" r="2" fill="white"/>
            </svg>
          </motion.div>
          <span className="text-xl">Traza tu ruta por las galaxias financieras</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center bg-opacity-20 bg-[#8B5CF6] p-4 rounded-xl cursor-pointer" 
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(139, 92, 246, 0.3)' }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setOptionHovered(1)}
          onHoverEnd={() => setOptionHovered(null)}
        >
          <motion.div 
            className="w-12 h-12 bg-[#8B5CF6] rounded-full flex items-center justify-center mr-4"
            animate={optionHovered === 1 ? { scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17L7 21V4C7 3.44772 7.44772 3 8 3H16C16.5523 3 17 3.44772 17 4V21L12 17Z" stroke="white" strokeWidth="2"/>
            </svg>
          </motion.div>
          <span className="text-xl">Conquista nuevos horizontes financieros</span>
        </motion.div>
      </div>
      
      {/* Button with enhanced feedback */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px 2px rgba(139, 92, 246, 0.6)" }}
        whileTap={{ scale: 0.95 }}
        animate={clicked ? { 
          scale: [1, 1.15, 0.95, 1.05, 1], 
          backgroundColor: ["#8B5CF6", "#6d45c9", "#8B5CF6"] 
        } : {}}
        transition={{ duration: 0.4 }}
        onClick={handleStartMission}
        className="bg-[#8B5CF6] hover:bg-[#7C4DEE] text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg transition-all relative overflow-hidden"
      >
        Iniciar este viaje estelar
        
        {/* Ripple effect on click */}
        {clicked && (
          <motion.span
            className="absolute inset-0 bg-white rounded-xl"
            initial={{ scale: 0, opacity: 0.7 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default IntroScreen; 