import React, { useState } from 'react';
import Planet from './Planet';
import { useGameStore } from '../store/useGameStore';
import Earth from './Earth';
import GameTile from './GameTile';
import TilePopup from './TilePopup';
import TwinklingStars from './TwinklingStars';
import ShootingStar from './ShootingStar';
import Fox from './Fox';
import { motion, AnimatePresence } from 'framer-motion';

const GameMap: React.FC = () => {
  const { currentLevel, completedLevels } = useGameStore();
  
  // Estado del popup centralizado
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<'savings' | 'investment' | 'debt' | 'mystery' | 'gift'>('savings');
  
  // Estado para controlar el zoom en planetas
  const [zoomedPlanet, setZoomedPlanet] = useState<'savings' | 'debt' | null>(null);
  
  // Funciones para controlar el popup
  const openPopup = (type: 'savings' | 'investment' | 'debt' | 'mystery' | 'gift') => {
    setPopupType(type);
    setPopupOpen(true);
  };
  
  const closePopup = () => {
    setPopupOpen(false);
  };
  
  // Funciones para controlar el zoom
  const zoomToPlanet = (type: 'savings' | 'debt') => {
    setZoomedPlanet(type);
  };
  
  const resetZoom = () => {
    setZoomedPlanet(null);
  };
  
  // Define the paths for each financial journey with mayor separación y más arriba
  const savingsPath = [
    { x: 35, y: 65 },
    { x: 37, y: 55 },
    { x: 32, y: 45 },
    { x: 27, y: 35 },
    { x: 30, y: 25 },
  ];
  
  const debtPath = [
    { x: 65, y: 65 },
    { x: 63, y: 55 },
    { x: 68, y: 45 },
    { x: 73, y: 35 },
    { x: 70, y: 25 },
  ];
  
  // Determinar transformaciones según el planeta con zoom
  let mapTransform = {};
  if (zoomedPlanet === 'savings') {
    mapTransform = {
      scale: 1.5,
      x: '25%', // Mover hacia la derecha para centrar el planeta izquierdo
    };
  } else if (zoomedPlanet === 'debt') {
    mapTransform = {
      scale: 1.5,
      x: '-25%', // Mover hacia la izquierda para centrar el planeta derecho
    };
  }
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Sky Background as image */}
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{
          backgroundImage: "url('/assets/images/sky.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}
      />
      
      {/* Twinkling Stars effect overlay */}
      <TwinklingStars />
      
      {/* Estrella fugaz aleatoria */}
      <ShootingStar />
      
      {/* Earth at the bottom */}
      <Earth />
      
      {/* Wrapper for all game elements to be above Earth */}
      <motion.div 
        className="relative w-full h-full" 
        style={{ zIndex: 20 }}
        animate={mapTransform}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      >
        {/* Planets - sin etiquetas, con oscilación */}
        <div 
          onClick={() => zoomToPlanet('savings')}
          className="cursor-pointer"
        >
          <Planet 
            type="savings" 
            size={80} 
            x={35} 
            y={10} 
            label="" 
            shouldRotate={false} 
            oscillate={true}
          />
        </div>
        
        <div 
          onClick={() => zoomToPlanet('debt')}
          className="cursor-pointer"
        >
          <Planet 
            type="debt" 
            size={80} 
            x={65} 
            y={10} 
            label="" 
            shouldRotate={false} 
            oscillate={true}
          />
        </div>
        
        {/* Path Tiles - Savings */}
        {savingsPath.map((pos, index) => {
          // Determinar el tipo de tile según su posición
          let tileType: 'savings' | 'mystery' | 'gift';
          
          if (index === savingsPath.length - 1) {
            // Último tile del camino es gift
            tileType = 'gift';
          } else if (index === 2) {
            // Tercer tile (índice 2) es mystery
            tileType = 'mystery';
          } else {
            // El resto son savings
            tileType = 'savings';
          }
          
          // Determinar si el tile está bloqueado (todos excepto el primero)
          const isLocked = index > 0;
          
          // No mostrar los tiles de deuda si estamos en zoom de ahorro
          if (zoomedPlanet === 'debt' && tileType === 'savings') {
            return null;
          }
          
          return (
            <div 
              key={`savings-${index}`}
              className="absolute"
              style={{ 
                left: `${pos.x}%`, 
                top: `${pos.y}%`, 
                transform: 'translate(-50%, -50%)',
                zIndex: 20
              }}
            >
              <GameTile 
                type={tileType} 
                onTileClick={() => openPopup(tileType)}
                isLocked={isLocked}
              />
            </div>
          );
        })}
        
        {/* Path Tiles - Debt */}
        {debtPath.map((pos, index) => {
          // Determinar el tipo de tile según su posición
          let tileType: 'debt' | 'mystery' | 'gift';
          
          if (index === debtPath.length - 1) {
            // Último tile del camino es gift
            tileType = 'gift';
          } else if (index === 2) {
            // Tercer tile (índice 2) es mystery
            tileType = 'mystery';
          } else {
            // El resto son debt
            tileType = 'debt';
          }
          
          // Determinar si el tile está bloqueado (todos excepto el primero)
          const isLocked = index > 0;
          
          // No mostrar los tiles de ahorro si estamos en zoom de deuda
          if (zoomedPlanet === 'savings' && tileType === 'debt') {
            return null;
          }
          
          return (
            <div 
              key={`debt-${index}`}
              className="absolute"
              style={{ 
                left: `${pos.x}%`, 
                top: `${pos.y}%`, 
                transform: 'translate(-50%, -50%)',
                zIndex: 20
              }}
            >
              <GameTile 
                type={tileType} 
                onTileClick={() => openPopup(tileType)}
                isLocked={isLocked}
              />
            </div>
          );
        })}
        
        {/* Dotted Path Lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 19 }}>
          {/* Savings Path - solo visible si no hay zoom o si el zoom es en savings */}
          {(!zoomedPlanet || zoomedPlanet === 'savings') && (
            <path 
              d={`M ${savingsPath[0].x}% ${savingsPath[0].y}% ${savingsPath.slice(1).map(p => `L ${p.x}% ${p.y}%`).join(' ')} L 35% 10%`} 
              stroke="#4ADE80" 
              strokeWidth="3" 
              strokeDasharray="5,5" 
              fill="none" 
            />
          )}
          
          {/* Debt Path - solo visible si no hay zoom o si el zoom es en debt */}
          {(!zoomedPlanet || zoomedPlanet === 'debt') && (
            <path 
              d={`M ${debtPath[0].x}% ${debtPath[0].y}% ${debtPath.slice(1).map(p => `L ${p.x}% ${p.y}%`).join(' ')} L 65% 10%`} 
              stroke="#8B5CF6" 
              strokeWidth="3" 
              strokeDasharray="5,5" 
              fill="none" 
            />
          )}
        </svg>
      </motion.div>
      
      {/* Zorro - fuera del div con zoom para moverse independientemente */}
      <div className="absolute left-0 right-0 z-50" style={{ top: '65%', height: '120px' }}>
        <div
          className="relative mx-auto"
          style={{ width: '120px', height: '120px' }}
        >
          <Fox />
        </div>
      </div>
      
      {/* Botón para restablecer zoom */}
      <AnimatePresence>
        {zoomedPlanet && (
          <motion.button
            className="absolute bottom-24 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 z-50"
            onClick={resetZoom}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Popup centralizado para todos los tiles */}
      <TilePopup
        type={popupType}
        isOpen={popupOpen}
        onClose={closePopup}
      />
    </div>
  );
};

export default GameMap; 