import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

const DebugPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  
  const { currentLevel, coins, completedLevels } = useGameStore();
  
  useEffect(() => {
    // Cargar información del usuario desde localStorage
    const token = localStorage.getItem('token');
    
    // Información básica para depuración
    const debugInfo = {
      token: token ? `${token.substring(0, 15)}...` : 'No hay token',
      localStorage: Object.keys(localStorage),
      url: window.location.href,
      userAgent: navigator.userAgent,
      time: new Date().toISOString()
    };
    
    setUserInfo(debugInfo);
  }, []);

  return (
    <div className={`fixed bottom-16 right-4 bg-gray-800 text-white rounded-lg shadow-lg z-40 transition-all duration-300 ${isExpanded ? 'w-96' : 'w-12'}`}>
      <button
        className="absolute top-2 right-2 text-white hover:text-gray-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '✕' : '⚙️'}
      </button>
      
      {isExpanded && (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Panel de Depuración</h3>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-300">Estado del Juego:</h4>
            <ul className="text-sm ml-2">
              <li>Nivel: {currentLevel}</li>
              <li>Monedas: {coins}</li>
              <li>Niveles completados: {completedLevels.length}</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-300">Información de Usuario:</h4>
            <ul className="text-sm ml-2">
              {userInfo && Object.entries(userInfo).map(([key, value]) => (
                <li key={key} className="break-all">
                  <span className="text-gray-400">{key}:</span>{' '}
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
            >
              Limpiar Storage
            </button>
            <button
              onClick={() => {
                console.log('Estado actual:', {
                  game: { currentLevel, coins, completedLevels },
                  user: userInfo
                });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
            >
              Log Estado
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel; 