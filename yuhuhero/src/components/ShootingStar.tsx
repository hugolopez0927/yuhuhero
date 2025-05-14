import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ShootingStar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0);

  // Función para generar posición y ángulo aleatorios
  const generateRandomStar = () => {
    // Generar posición inicial aleatoria en la parte superior de la pantalla
    const newX = Math.random() * 80 + 10; // Entre 10% y 90% del ancho
    const newY = Math.random() * 30 + 5;  // Entre 5% y 35% de la altura
    
    // Ángulo aleatorio entre 30 y 60 grados
    const newAngle = Math.random() * 30 + 30;
    
    setPosition({ x: newX, y: newY });
    setAngle(newAngle);
    setVisible(true);
    
    // Ocultar después de la animación
    setTimeout(() => {
      setVisible(false);
    }, 1000); // Duración de la animación
  };

  useEffect(() => {
    // Iniciar temporizador para mostrar estrellas fugaces aleatorias
    const showRandomly = () => {
      // Probabilidad del 30% de mostrar una estrella fugaz en cada intervalo
      if (Math.random() < 0.3) {
        generateRandomStar();
      }
      
      // Programar el próximo intento entre 2 y 10 segundos
      const nextTime = Math.random() * 8000 + 2000;
      setTimeout(showRandomly, nextTime);
    };
    
    // Primer intervalo entre 1 y 5 segundos
    const initialDelay = Math.random() * 4000 + 1000;
    const timerId = setTimeout(showRandomly, initialDelay);
    
    return () => clearTimeout(timerId);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute"
          style={{ 
            left: `${position.x}%`, 
            top: `${position.y}%`, 
            zIndex: 10
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative"
            animate={{
              x: `calc(300px * tan(${angle}deg))`,
              y: '300px',
            }}
            transition={{
              duration: 1,
              ease: 'easeOut'
            }}
          >
            {/* Estrella fugaz con una estela */}
            <div className="relative">
              {/* Estela luminosa */}
              <motion.div
                className="absolute h-1.5 origin-left rounded-full bg-gradient-to-r from-white via-blue-200 to-transparent"
                style={{ width: '50px', transform: `rotate(${angle}deg)` }}
                animate={{ width: ['0px', '50px', '20px'] }}
                transition={{ duration: 1, times: [0, 0.7, 1] }}
              />
              
              {/* Punto brillante (la estrella) */}
              <motion.div
                className="absolute w-2 h-2 rounded-full bg-white"
                style={{ boxShadow: '0 0 8px 1px rgba(255, 255, 255, 0.9)' }}
                animate={{ scale: [1, 1.5, 0.8] }}
                transition={{ duration: 1, times: [0, 0.7, 1] }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShootingStar; 