import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';

interface GameTileProps {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  type: string;
  rewards: number;
  missionId: string;
}

const GameTile: React.FC<GameTileProps> = ({
  id,
  title,
  description,
  x,
  y,
  type,
  rewards,
  missionId
}) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const { completedLevels } = useGameStore();
  
  const isCompleted = completedLevels.includes(missionId);
  const isLocked = !isCompleted && completedLevels.length > 0 && !completedLevels.includes(missionId.split('-')[0] + '-' + (parseInt(missionId.split('-')[1]) - 1));
  
  const handleClick = () => {
    if (isLocked) {
      // Mostrar animación de "bloqueado" sin abrir detalles
      return;
    }
    setShowDetails(!showDetails);
  };
  
  const startMission = () => {
    // Redirigir según el tipo de misión
    switch (type) {
      case 'quiz':
        navigate('/quiz');
        break;
      case 'lesson':
        navigate(`/${missionId.split('-')[1] || 'ahorro'}`);
        break;
      default:
        navigate('/home');
    }
  };
  
  // Colores según el tipo
  const getBackgroundColor = () => {
    if (isLocked) return 'bg-gray-600';
    if (isCompleted) return 'bg-green-500';
    
    switch (type) {
      case 'quiz':
        return 'bg-blue-500';
      case 'lesson':
        return 'bg-purple-500';
      case 'challenge':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getBorderColor = () => {
    if (isLocked) return 'border-gray-400';
    if (isCompleted) return 'border-green-400';
    
    switch (type) {
      case 'quiz':
        return 'border-blue-400';
      case 'lesson':
        return 'border-purple-400';
      case 'challenge':
        return 'border-yellow-400';
      default:
        return 'border-gray-400';
    }
  };
  
  const getIcon = () => {
    if (isLocked) return '🔒';
    if (isCompleted) return '✓';
    
    switch (type) {
      case 'quiz':
        return '❓';
      case 'lesson':
        return '📚';
      case 'challenge':
        return '🏆';
      default:
        return '📍';
    }
  };

  return (
    <>
      <motion.div
        className={`absolute rounded-full w-20 h-20 flex items-center justify-center text-white font-bold cursor-pointer shadow-lg border-4 ${getBackgroundColor()} ${getBorderColor()}`}
        style={{
          left: `${x * 100}px`,
          top: `${y * 100}px`,
          zIndex: showDetails ? 20 : 10,
        }}
        whileHover={{ scale: isLocked ? 1.05 : 1.1, y: isLocked ? 0 : -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0, 1.2, 1],
          rotate: isCompleted ? [0, 10, 0] : 0,
        }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: x * 0.1 + y * 0.1
        }}
      >
        {/* Efecto de resplandor para niveles completados */}
        {isCompleted && (
          <motion.div 
            className="absolute inset-0 rounded-full bg-green-400 -z-10"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.2, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        )}
        
        <span className="text-2xl">{getIcon()}</span>
        
        {/* Número del nivel */}
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-xs font-bold shadow-md"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {parseInt(missionId.split('-')[1]) || 1}
        </motion.div>
      </motion.div>
      
      {/* Detalles de la casilla */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="absolute bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl p-5 shadow-2xl z-30 w-72 border border-blue-100 dark:border-blue-900"
            style={{
              left: `${x * 100 + 50}px`,
              top: `${y * 100 - 30}px`,
            }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {/* Triángulo decorativo que apunta a la casilla */}
            <div className="absolute -left-4 top-10 w-0 h-0 border-t-8 border-r-8 border-b-8 border-l-8 border-transparent border-r-white dark:border-r-gray-800"></div>
            
            <div className="flex justify-between items-start mb-3">
              <motion.h3 
                className="text-xl font-bold"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {title}
              </motion.h3>
              
              <motion.span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  type === 'quiz' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                  type === 'lesson' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                }`}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </motion.span>
            </div>
            
            <motion.p 
              className="text-sm mb-4 text-gray-600 dark:text-gray-300"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {description}
            </motion.p>
            
            <motion.div 
              className="flex items-center space-x-2 mb-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full">
                <span className="mr-1 text-lg">✦</span>
                <span className="font-medium">{rewards}</span>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Recompensa
              </div>
            </motion.div>
            
            <motion.div
              className="relative overflow-hidden"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={startMission}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium relative overflow-hidden ${
                  isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {isCompleted ? (
                  <span className="flex items-center justify-center">
                    <motion.span 
                      className="mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      ✓
                    </motion.span>
                    Completado
                  </span>
                ) : (
                  <span>Comenzar Aventura</span>
                )}
                
                {/* Efecto de partículas para botón completado */}
                {isCompleted && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{ 
                          x: '50%', 
                          y: '50%',
                          opacity: 0 
                        }}
                        animate={{ 
                          x: [null, `${Math.random() * 100}%`],
                          y: [null, `${Math.random() * 100}%`],
                          opacity: [0, 1, 0] 
                        }}
                        transition={{ 
                          duration: 1 + Math.random(),
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Efecto de misión bloqueada */}
      {isLocked && (
        <motion.div
          className="absolute rounded-full w-10 h-10 bg-red-500 flex items-center justify-center text-white font-bold shadow-lg border-2 border-red-400"
          style={{
            left: `${x * 100 + 15}px`,
            top: `${y * 100 - 15}px`,
            zIndex: 5,
          }}
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            y: [0, -5, 0],
          }}
          transition={{ 
            duration: 1,
            repeat: 3,
            repeatType: "reverse",
            delay: 0.5
          }}
        >
          <span className="text-lg">🔒</span>
        </motion.div>
      )}
    </>
  );
};

export default GameTile; 