import React, { useState, useEffect } from 'react';
import Planet from './Planet';
import { useGameStore } from '../store/useGameStore';
import Earth from './Earth';
import GameTile from './GameTile';
import TilePopup from './TilePopup';
import TwinklingStars from './TwinklingStars';
import ShootingStar from './ShootingStar';
import { motion, AnimatePresence } from 'framer-motion';

const GameMap: React.FC = () => {
  const { currentLevel, completedLevels } = useGameStore();
  
  // Estado del popup centralizado
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<'savings' | 'investment' | 'debt' | 'mystery' | 'gift'>('savings');
  
  // Estado para controlar el zoom en planetas
  const [zoomedPlanet, setZoomedPlanet] = useState<'savings' | 'debt' | null>(null);
  
  // Estados para manejar la carga y los errores
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Efecto para simular carga de recursos
  useEffect(() => {
    // Fingimos una carga para asegurarnos de que todo se inicializa correctamente
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(loadingTimer);
  }, []);
  
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
  
  // Si estamos cargando, mostrar un indicador de carga
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Cargando universo financiero...</p>
        </div>
      </div>
    );
  }
  
  // Si hay un error, mostrar un mensaje amigable
  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">¡Ops! Ha ocurrido un error</h2>
        <p className="mb-6">No pudimos cargar el mapa del universo financiero.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }
  
  // Manejo de errores con try/catch
  try {
    return (
      <div className="relative w-full h-full overflow-hidden">
        {/* Sky Background as image - Eliminamos este div para que se vea la imagen de fondo de HomePage */}
        {/* <div 
          className="absolute inset-0 w-full h-full" 
          style={{
            backgroundColor: "#05071F", // Color de respaldo si la imagen falla
            backgroundImage: "url('/assets/images/sky.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }}
        /> */}
        
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
            
            // Asignar imagen específica (1-5) para el lado izquierdo
            const tileImage = index + 1; // 1, 2, 3, 4, 5
            
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
                  tileImage={tileImage} // Pasamos el número de imagen explícitamente
                  pathSide="left" // Indicamos que está en el camino izquierdo
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
            
            // Asignar imagen específica para el lado derecho en orden secuencial (6-10)
            let imageNumber;
            
            // Asignación directa y secuencial para el camino derecho
            if (index === 0) { 
              // Primer tile (más abajo)
              imageNumber = 8;
            } else if (index === 1) {
              // Segundo tile
              imageNumber = 7;
            } else if (index === 2) {
              // Tercer tile (mystery)
              imageNumber = 6;
            } else if (index === 3) {
              // Cuarto tile
              imageNumber = 9;
            } else if (index === 4) {
              // Último tile (gift)
              imageNumber = 10;
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
                data-tile-index={index}
                data-tile-path="debt"
                data-tile-image={imageNumber}
              >
                <GameTile 
                  type={tileType} 
                  onTileClick={() => openPopup(tileType)}
                  isLocked={isLocked}
                  tileImage={imageNumber}
                  pathSide="right"
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
  } catch (error) {
    console.error("Error en GameMap:", error);
    // Si hay un error durante el renderizado, establecemos el estado de error
    // En el siguiente render se mostrará el mensaje de error
    setHasError(true);
    
    // Retornar un placeholder simple para este render
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }
};

export default GameMap; 