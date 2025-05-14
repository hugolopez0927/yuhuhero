import React from 'react';
import { motion } from 'framer-motion';

const TwinklingStars: React.FC = () => {
  // Generar un número aleatorio entre min y max
  const random = (min: number, max: number) => Math.random() * (max - min) + min;
  
  // Crear estrellas pequeñas (más numerosas)
  const smallStars = Array.from({ length: 30 }, (_, i) => ({
    id: `small-${i}`,
    x: `${random(1, 99)}%`,
    y: `${random(1, 99)}%`,
    size: random(1, 2),
    duration: random(2, 5),
    delay: random(0, 4),
  }));
  
  // Crear estrellas medianas (menos numerosas pero más brillantes)
  const mediumStars = Array.from({ length: 15 }, (_, i) => ({
    id: `medium-${i}`,
    x: `${random(1, 99)}%`,
    y: `${random(1, 99)}%`,
    size: random(2, 3.5),
    duration: random(3, 6),
    delay: random(0, 3),
  }));
  
  // Crear estrellas grandes (pocas pero con efecto más notable)
  const largeStars = Array.from({ length: 5 }, (_, i) => ({
    id: `large-${i}`,
    x: `${random(1, 99)}%`,
    y: `${random(1, 99)}%`,
    size: random(3, 4),
    duration: random(4, 7),
    delay: random(0, 2),
  }));
  
  // Combinar todos los tipos de estrellas
  const allStars = [...smallStars, ...mediumStars, ...largeStars];
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {allStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: star.x,
            top: star.y,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: 'white',
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
            boxShadow: [
              `0 0 ${star.size}px rgba(255, 255, 255, 0.3)`,
              `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.8)`,
              `0 0 ${star.size}px rgba(255, 255, 255, 0.3)`,
            ],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default TwinklingStars; 