import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameTile from './GameTile';

interface TileData {
  id: string;
  x: number;
  y: number;
  type: 'savings' | 'debt' | 'mystery' | 'gift';
  isLocked: boolean;
}

interface PlanetData {
  id: string;
  x: number;
  y: number;
  type: 'savings' | 'debt';
}

interface TilePositionEditorProps {
  savingsTiles: TileData[];
  debtTiles: TileData[];
  planets: PlanetData[];
  onSavingsTileMove: (id: string, x: number, y: number) => void;
  onDebtTileMove: (id: string, x: number, y: number) => void;
  onPlanetMove: (id: string, x: number, y: number) => void;
}

const TilePositionEditor: React.FC<TilePositionEditorProps> = ({
  savingsTiles,
  debtTiles,
  planets,
  onSavingsTileMove,
  onDebtTileMove,
  onPlanetMove
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);
  const [symmetryMode, setSymmetryMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showGuidelines, setShowGuidelines] = useState(true);
  
  // Actualizar dimensiones del contenedor al iniciar
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setContainerSize({ width, height });
        }
      });
      
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);
  
  // Convertir posición de píxeles a porcentaje
  const pixelToPercent = (pixelX: number, pixelY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const { width, height } = containerSize;
    const percentX = (pixelX / width) * 100;
    const percentY = (pixelY / height) * 100;
    
    return { x: percentX, y: percentY };
  };
  
  // Función para manejar el arrastre de elementos
  const handleDrag = (
    id: string, 
    type: 'savings' | 'debt' | 'planet', 
    x: number, 
    y: number
  ) => {
    // Evitar actualizaciones mientras se arrastra
    if (!dragging) setDragging(true);
    
    const pos = pixelToPercent(x, y);
    
    // Actualizar la posición según el tipo de elemento
    if (type === 'savings') {
      onSavingsTileMove(id, pos.x, pos.y);
    } else if (type === 'debt') {
      onDebtTileMove(id, pos.x, pos.y);
    } else if (type === 'planet') {
      onPlanetMove(id, pos.x, pos.y);
    }
  };
  
  // Convertir porcentaje a píxeles para posicionamiento inicial
  const percentToPixel = (percentX: number, percentY: number) => {
    const { width, height } = containerSize;
    return {
      x: (percentX / 100) * width,
      y: (percentY / 100) * height
    };
  };
  
  // Función para alinear simétricamente tiles cuando se habilita el modo de simetría
  const handleSymmetricDrag = (
    id: string,
    type: 'savings' | 'debt' | 'planet',
    x: number,
    y: number
  ) => {
    const pos = pixelToPercent(x, y);
    
    // Al mover en modo simetría, calculamos la posición correspondiente en el otro lado
    if (symmetryMode) {
      if (type === 'savings') {
        // Actualizar el tile original
        onSavingsTileMove(id, pos.x, pos.y);
        
        // Buscar el tile correspondiente en la otra ruta (misma posición en el array)
        const tileIndex = savingsTiles.findIndex(tile => tile.id === id);
        if (tileIndex >= 0 && tileIndex < debtTiles.length) {
          // Calcular la posición simétrica (centrada en 50%)
          const symmetricX = 100 - pos.x;
          onDebtTileMove(debtTiles[tileIndex].id, symmetricX, pos.y);
        }
      } else if (type === 'debt') {
        // Actualizar el tile original
        onDebtTileMove(id, pos.x, pos.y);
        
        // Buscar el tile correspondiente en la otra ruta
        const tileIndex = debtTiles.findIndex(tile => tile.id === id);
        if (tileIndex >= 0 && tileIndex < savingsTiles.length) {
          // Calcular la posición simétrica (centrada en 50%)
          const symmetricX = 100 - pos.x;
          onSavingsTileMove(savingsTiles[tileIndex].id, symmetricX, pos.y);
        }
      } else if (type === 'planet') {
        // Para planetas, movemos el otro planeta simétricamente
        onPlanetMove(id, pos.x, pos.y);
        
        const otherPlanetId = id === 'savings' ? 'debt' : 'savings';
        const otherPlanet = planets.find(p => p.id === otherPlanetId);
        
        if (otherPlanet) {
          const symmetricX = 100 - pos.x;
          onPlanetMove(otherPlanetId, symmetricX, pos.y);
        }
      }
    } else {
      // Comportamiento normal sin simetría
      handleDrag(id, type, x, y);
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-blue-900 overflow-auto rounded"
      style={{ height: '500px' }}
    >
      {/* Panel de controles */}
      <div className="absolute top-2 left-2 z-50 bg-black/50 p-2 rounded flex flex-col gap-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="symmetryMode"
            checked={symmetryMode}
            onChange={() => setSymmetryMode(!symmetryMode)}
            className="mr-2"
          />
          <label htmlFor="symmetryMode" className="text-white text-xs">Modo Simetría</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showGrid"
            checked={showGrid}
            onChange={() => setShowGrid(!showGrid)}
            className="mr-2"
          />
          <label htmlFor="showGrid" className="text-white text-xs">Mostrar Cuadrícula</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showGuidelines"
            checked={showGuidelines}
            onChange={() => setShowGuidelines(!showGuidelines)}
            className="mr-2"
          />
          <label htmlFor="showGuidelines" className="text-white text-xs">Mostrar Guías</label>
        </div>
      </div>
      
      {/* Fondo del espacio */}
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{
          backgroundImage: "url('/assets/images/sky.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Cuadrícula de ayuda */}
      {showGrid && (
        <div className="absolute inset-0 w-full h-full z-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {/* Líneas verticales */}
            {Array.from({ length: 11 }).map((_, i) => (
              <line 
                key={`vline-${i}`} 
                x1={`${i * 10}%`} 
                y1="0" 
                x2={`${i * 10}%`} 
                y2="100%" 
                stroke="rgba(255, 255, 255, 0.1)" 
                strokeWidth="1"
                strokeDasharray={i === 5 ? "" : "5,5"}
              />
            ))}
            
            {/* Líneas horizontales */}
            {Array.from({ length: 11 }).map((_, i) => (
              <line 
                key={`hline-${i}`} 
                x1="0" 
                y1={`${i * 10}%`} 
                x2="100%" 
                y2={`${i * 10}%`} 
                stroke="rgba(255, 255, 255, 0.1)" 
                strokeWidth="1"
                strokeDasharray={i === 5 ? "" : "5,5"}
              />
            ))}
          </svg>
        </div>
      )}
      
      {/* Línea central vertical */}
      {showGuidelines && (
        <div className="absolute inset-0 w-full h-full z-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <line 
              x1="50%" 
              y1="0" 
              x2="50%" 
              y2="100%" 
              stroke="rgba(255, 255, 0, 0.3)" 
              strokeWidth="2"
            />
          </svg>
        </div>
      )}
      
      {/* Galaxias de ahorro y deuda */}
      {planets.map(planet => {
        const initialPosition = percentToPixel(planet.x, planet.y);
        
        return (
          <motion.div
            key={planet.id}
            drag
            dragMomentum={false}
            onDrag={(_, info) => {
              handleSymmetricDrag(planet.id, 'planet', info.point.x, info.point.y);
            }}
            initial={{ x: initialPosition.x, y: initialPosition.y }}
            className="absolute cursor-move z-30"
            style={{ 
              x: initialPosition.x, 
              y: initialPosition.y, 
              width: '80px',
              height: '80px'
            }}
          >
            <div 
              className={`w-full h-full rounded-full flex items-center justify-center
                ${planet.type === 'savings' ? 'bg-green-500' : 'bg-purple-500'}`}
            >
              <span className="text-white font-bold text-sm">
                {planet.type === 'savings' ? 'Ahorro' : 'Deudas'}
              </span>
            </div>
          </motion.div>
        );
      })}
      
      {/* Tiles de ahorro */}
      {savingsTiles.map(tile => {
        const initialPosition = percentToPixel(tile.x, tile.y);
        
        return (
          <motion.div
            key={tile.id}
            drag
            dragMomentum={false}
            onDrag={(_, info) => {
              handleSymmetricDrag(tile.id, 'savings', info.point.x, info.point.y);
            }}
            initial={{ x: initialPosition.x, y: initialPosition.y }}
            className="absolute cursor-move z-20"
            style={{ 
              x: initialPosition.x, 
              y: initialPosition.y 
            }}
          >
            <GameTile 
              type={tile.type} 
              onTileClick={() => {}} 
              isLocked={tile.isLocked}
            />
          </motion.div>
        );
      })}
      
      {/* Tiles de deuda */}
      {debtTiles.map(tile => {
        const initialPosition = percentToPixel(tile.x, tile.y);
        
        return (
          <motion.div
            key={tile.id}
            drag
            dragMomentum={false}
            onDrag={(_, info) => {
              handleSymmetricDrag(tile.id, 'debt', info.point.x, info.point.y);
            }}
            initial={{ x: initialPosition.x, y: initialPosition.y }}
            className="absolute cursor-move z-20"
            style={{ 
              x: initialPosition.x, 
              y: initialPosition.y 
            }}
          >
            <GameTile 
              type={tile.type} 
              onTileClick={() => {}} 
              isLocked={tile.isLocked}
            />
          </motion.div>
        );
      })}
      
      {/* Líneas de camino */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
        {/* Savings Path */}
        <path 
          d={`M ${savingsTiles[0].x}% ${savingsTiles[0].y}% ${savingsTiles.slice(1).map(p => `L ${p.x}% ${p.y}%`).join(' ')} L ${planets.find(p => p.id === 'savings')?.x || 0}% ${planets.find(p => p.id === 'savings')?.y || 0}%`} 
          stroke="#4ADE80" 
          strokeWidth="3" 
          strokeDasharray="5,5" 
          fill="none" 
        />
        
        {/* Debt Path */}
        <path 
          d={`M ${debtTiles[0].x}% ${debtTiles[0].y}% ${debtTiles.slice(1).map(p => `L ${p.x}% ${p.y}%`).join(' ')} L ${planets.find(p => p.id === 'debt')?.x || 0}% ${planets.find(p => p.id === 'debt')?.y || 0}%`} 
          stroke="#8B5CF6" 
          strokeWidth="3" 
          strokeDasharray="5,5" 
          fill="none" 
        />
      </svg>
      
      {/* Modo simétrico indicador */}
      {symmetryMode && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
          Modo Simetría Activo
        </div>
      )}
      
      {/* Información de ayuda */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs p-2 rounded">
        Arrastra los elementos para ajustar sus posiciones
        {symmetryMode && <div className="mt-1">El modo simetría está activado</div>}
      </div>
    </div>
  );
};

export default TilePositionEditor; 