import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DebugPanelProps {
  visible?: boolean;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ visible = true }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [appState, setAppState] = useState<Record<string, string>>({});

  // Actualizar el estado cada vez que se expande el panel
  useEffect(() => {
    if (isExpanded) {
      // Recopilar todo el localStorage
      const state: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          state[key] = localStorage.getItem(key) || '';
        }
      }
      
      // Añadir información de navegación
      state['currentPath'] = window.location.pathname;
      state['timestamp'] = new Date().toISOString();
      
      setAppState(state);
    }
  }, [isExpanded]);

  // Restablecer la aplicación
  const handleReset = () => {
    console.log("Restableciendo aplicación desde DebugPanel");
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  // Ir directamente a una ruta
  const navigateTo = (path: string) => {
    console.log(`Navegando a ${path} desde DebugPanel`);
    navigate(path, { replace: true });
  };

  // Establecer estado de quiz
  const setQuizCompleted = (completed: boolean) => {
    console.log(`Estableciendo quizCompleted=${completed} desde DebugPanel`);
    localStorage.setItem('quizCompleted', String(completed));
    setAppState({...appState, quizCompleted: String(completed)});
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 right-4 z-50">
      <div 
        className={`bg-gray-800 text-white rounded-lg shadow-lg p-2 transition-all duration-300 transform ${
          isExpanded ? 'opacity-95 scale-100' : 'opacity-70 scale-95'
        }`}
      >
        {/* Botón de alternancia */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="w-full text-xs font-bold mb-2 bg-gray-700 p-1 rounded flex items-center justify-between"
        >
          <span>Panel de Depuración</span>
          <span>{isExpanded ? '▼' : '▲'}</span>
        </button>
        
        {/* Contenido del panel - solo visible cuando está expandido */}
        {isExpanded && (
          <div className="space-y-2 max-w-xs">
            {/* Estado actual */}
            <div className="text-xs bg-gray-700 p-2 rounded max-h-32 overflow-y-auto">
              <h4 className="font-bold mb-1">Estado:</h4>
              {Object.entries(appState).map(([key, value]) => (
                <div key={key} className="flex justify-between mb-1">
                  <span className="font-mono">{key}:</span>
                  <span className="font-mono text-green-300 truncate ml-2">{value}</span>
                </div>
              ))}
            </div>
            
            {/* Botones de navegación */}
            <div className="grid grid-cols-2 gap-1">
              <button 
                onClick={() => navigateTo('/login')} 
                className="bg-blue-600 hover:bg-blue-700 p-1 rounded text-xs"
              >
                Ir a Login
              </button>
              <button 
                onClick={() => navigateTo('/quiz')} 
                className="bg-purple-600 hover:bg-purple-700 p-1 rounded text-xs"
              >
                Ir a Quiz
              </button>
              <button 
                onClick={() => navigateTo('/home')} 
                className="bg-green-600 hover:bg-green-700 p-1 rounded text-xs"
              >
                Ir a Home
              </button>
              <button 
                onClick={handleReset} 
                className="bg-red-600 hover:bg-red-700 p-1 rounded text-xs"
              >
                Reiniciar App
              </button>
            </div>
            
            {/* Botones de estado */}
            <div className="grid grid-cols-2 gap-1">
              <button 
                onClick={() => setQuizCompleted(true)} 
                className="bg-green-600 hover:bg-green-700 p-1 rounded text-xs"
              >
                Quiz → Completado
              </button>
              <button 
                onClick={() => setQuizCompleted(false)} 
                className="bg-yellow-600 hover:bg-yellow-700 p-1 rounded text-xs"
              >
                Quiz → Pendiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPanel; 