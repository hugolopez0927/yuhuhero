import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getGameMap } from '../services/api';
import GameTile from './GameTile';
import { useGameStore } from '../store/useGameStore';
import { useNavigate } from 'react-router-dom';

interface Tile {
  id: string;
  title: string;
  description: string;
  position_x: number;
  position_y: number;
  type: string;
  rewards: number;
  mission_id: string;
}

const GameMap: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLevel, coins, completedLevels } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameMap = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getGameMap();
        setTiles(response.tiles);
      } catch (error) {
        console.error('Error al cargar el mapa:', error);
        setError('No se pudo cargar el mapa del juego');
      } finally {
        setLoading(false);
      }
    };

    fetchGameMap();
  }, []);

  // Calcular el progreso del nivel (porcentaje)
  const calculateProgress = () => {
    // Si hay 5 niveles por mundo, por ejemplo
    const levelsPerWorld = 5;
    const levelsInCurrentWorld = completedLevels.filter(level => 
      level.startsWith(`world-${Math.floor((currentLevel-1) / levelsPerWorld) + 1}`)
    ).length;
    
    // Devuelve un porcentaje del 0-100
    return Math.min(Math.round((levelsInCurrentWorld / levelsPerWorld) * 100), 100);
  };

  const progress = calculateProgress();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <>
      {/* Tarjeta de Tu Avance */}
      <motion.div 
        className="mb-6 mx-auto bg-blue-800 bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-blue-700 border-opacity-40 shadow-lg max-w-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
      >
        <h3 className="text-lg font-medium mb-4 flex items-center justify-center text-white">
          <motion.span 
            className="mr-2 text-yellow-300"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          >
            📊
          </motion.span>
          Tu Avance
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            className="bg-blue-900 bg-opacity-50 rounded-lg p-3 text-center border border-blue-700 border-opacity-30"
            whileHover={{ y: -5, boxShadow: "0 5px 10px rgba(30, 64, 175, 0.3)" }}
          >
            <motion.span 
              className="block text-2xl mb-1 text-white"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              🏆
            </motion.span>
            <span className="text-xs md:text-sm text-blue-100">Nivel actual</span>
            <motion.span 
              className="block text-xl font-bold text-white"
              animate={{ 
                scale: currentLevel > 1 ? [1, 1.2, 1] : 1,
                color: currentLevel > 1 ? ["#fff", "#fef08a", "#fff"] : "#fff"
              }}
              transition={{ duration: 1, repeat: currentLevel > 1 ? 3 : 0, repeatDelay: 5 }}
            >
              {currentLevel}
            </motion.span>
          </motion.div>
          
          <motion.div 
            className="bg-blue-900 bg-opacity-50 rounded-lg p-3 text-center border border-blue-700 border-opacity-30"
            whileHover={{ y: -5, boxShadow: "0 5px 10px rgba(30, 64, 175, 0.3)" }}
          >
            <motion.span 
              className="block text-2xl mb-1 text-white"
              animate={{ scale: coins > 0 ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5, repeat: coins > 0 ? Infinity : 0, repeatDelay: 2 }}
            >
              💰
            </motion.span>
            <span className="text-xs md:text-sm text-blue-100">Monedas</span>
            <motion.span 
              className="block text-xl font-bold text-white"
              animate={{ 
                color: coins > 10 ? ["#fff", "#fef08a", "#fff"] : "#fff"
              }}
              transition={{ duration: 1, repeat: coins > 10 ? 3 : 0, repeatDelay: 5 }}
            >
              {coins}
            </motion.span>
          </motion.div>
        </div>
        
        {/* Barra de progreso del nivel */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-blue-200 mb-1">
            <span>Nivel {currentLevel}</span>
            <span>Nivel {currentLevel + 1}</span>
          </div>
          <div className="w-full h-2 bg-blue-900 rounded-full">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="text-xs text-center text-blue-200 mt-1">
            {progress}% completado
          </div>
        </div>
        
        {/* Botón de incentivo */}
        <motion.button
          className="w-full mt-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white text-sm font-medium shadow-md flex items-center justify-center"
          whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/quiz')}
        >
          <span className="mr-2">🧠</span>
          Completa más desafíos
        </motion.button>
      </motion.div>

      <motion.div 
        className="bg-blue-700 bg-opacity-30 rounded-xl p-4 overflow-auto"
        style={{ minHeight: '400px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative" style={{ width: '600px', height: '400px' }}>
          {/* Líneas conectoras entre casillas */}
          <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="0"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#fff" />
              </marker>
            </defs>
            {tiles.map((tile, index) => {
              if (index === 0) return null;
              const prevTile = tiles[index - 1];
              return (
                <line
                  key={`line-${tile.id}`}
                  x1={prevTile.position_x * 100 + 50}
                  y1={prevTile.position_y * 100 + 50}
                  x2={tile.position_x * 100 + 50}
                  y2={tile.position_y * 100 + 50}
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
          </svg>

          {/* Casillas del juego */}
          {tiles.map((tile) => (
            <GameTile
              key={tile.id}
              id={tile.id}
              title={tile.title}
              description={tile.description}
              x={tile.position_x}
              y={tile.position_y}
              type={tile.type}
              rewards={tile.rewards}
              missionId={tile.mission_id}
            />
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default GameMap; 