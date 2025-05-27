import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionManager from './MissionManager';

interface TilePopupProps {
  type: 'savings' | 'investment' | 'debt' | 'mystery' | 'gift';
  isOpen: boolean;
  onClose: () => void;
}

const TilePopup: React.FC<TilePopupProps> = ({ type, isOpen, onClose }) => {
  const [showMission, setShowMission] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);
  const [missionSuccess, setMissionSuccess] = useState(false);
  const [missionScore, setMissionScore] = useState({ score: 0, total: 0 });

  // Determinar el tipo de misión según el tipo de tile
  const getMissionType = () => {
    switch (type) {
      case 'savings':
        return 'classification';
      case 'debt':
        return 'quiz';
      case 'mystery':
        return 'video';
      case 'gift':
        // Los regalos son premios, no misiones
        return null;
      default:
        return 'quiz';
    }
  };

  // Obtener información del tile según su tipo
  const getTileInfo = () => {
    switch (type) {
      case 'savings':
        return {
          title: 'Misión de Ahorro',
          description: 'Aprende a clasificar diferentes métodos de ahorro y estrategias para alcanzar tus metas financieras.',
          icon: '💰',
          color: 'bg-green-600',
          buttonText: 'Comenzar Misión de Clasificación'
        };
      case 'debt':
        return {
          title: 'Desafío de Deuda',
          description: 'Pon a prueba tus conocimientos sobre deudas, intereses y estrategias para salir de ellas.',
          icon: '💸',
          color: 'bg-purple-600',
          buttonText: 'Comenzar Quiz'
        };
      case 'mystery':
        return {
          title: 'Consejo Financiero',
          description: 'Mira un video corto con consejos financieros y responde preguntas para demostrar tu comprensión.',
          icon: '🎬',
          color: 'bg-blue-600',
          buttonText: 'Ver Video'
        };
      case 'gift':
        return {
          title: '¡Recompensa!',
          description: 'Has ganado una recompensa por tu progreso en el juego.',
          icon: '🎁',
          color: 'bg-yellow-600',
          buttonText: 'Reclamar Recompensa'
        };
      case 'investment':
        return {
          title: 'Desafío de Inversión',
          description: 'Aprende sobre diferentes opciones de inversión y cómo hacer crecer tu dinero.',
          icon: '📈',
          color: 'bg-indigo-600',
          buttonText: 'Comenzar Quiz'
        };
      default:
        return {
          title: 'Misión',
          description: 'Completa esta misión para avanzar en tu viaje financiero.',
          icon: '🔍',
          color: 'bg-gray-600',
          buttonText: 'Comenzar'
        };
    }
  };

  // Obtener información del tile
  const tileInfo = getTileInfo();
  
  // Manejar el inicio de la misión
  const handleStartMission = () => {
    if (type === 'gift') {
      // Lógica para recibir recompensa
      setMissionComplete(true);
      setMissionSuccess(true);
    } else {
      setShowMission(true);
    }
  };
  
  // Manejar la finalización de la misión
  const handleMissionComplete = (success: boolean, score: number, total: number) => {
    setMissionComplete(true);
    setMissionSuccess(success);
    setMissionScore({ score, total });
  };
  
  // Cerrar el popup y resetear estado
  const handleClose = () => {
    onClose();
    // Resetear el estado después de cerrar para futuras interacciones
    setTimeout(() => {
      setShowMission(false);
      setMissionComplete(false);
      setMissionSuccess(false);
      setMissionScore({ score: 0, total: 0 });
    }, 300); // Dar tiempo para que la animación de cierre termine
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/70"
            onClick={handleClose}
          />
          
          {/* Popup content */}
          <motion.div 
            className="relative bg-gray-800 rounded-lg text-white w-full max-w-2xl overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Contenido inicial o resultado de misión */}
            {!showMission ? (
              <div>
                {/* Encabezado */}
                <div className={`${tileInfo.color} p-4 flex justify-between items-center`}>
                  <h2 className="text-2xl font-bold flex items-center">
                    <span className="mr-2 text-3xl">{tileInfo.icon}</span>
                    {tileInfo.title}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-1 rounded-full hover:bg-white/20"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Cuerpo */}
                <div className="p-6">
                  {!missionComplete ? (
                    <>
                      <p className="mb-6">{tileInfo.description}</p>
                      <button
                        onClick={handleStartMission}
                        className={`px-6 py-3 rounded-md ${tileInfo.color} hover:opacity-90 font-medium`}
                      >
                        {tileInfo.buttonText}
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-4">
                        {missionSuccess ? '🎉' : '😕'}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {missionSuccess 
                          ? '¡Misión completada con éxito!' 
                          : 'Misión no completada'}
                      </h3>
                      {type !== 'gift' && (
                        <p className="text-lg mb-4">
                          Tu puntuación: {missionScore.score} de {missionScore.total}
                        </p>
                      )}
                      <p className="mb-6">
                        {missionSuccess 
                          ? 'Has desbloqueado el siguiente nivel y ganado experiencia financiera.' 
                          : 'Sigue intentándolo para mejorar tus conocimientos financieros.'}
                      </p>
                      <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                      >
                        Continuar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Mostrar el componente de misión
              <div className="max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-10 bg-gray-800 p-2 flex justify-end">
                  <button
                    onClick={() => setShowMission(false)}
                    className="p-1 rounded-full hover:bg-white/20"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <MissionManager
                  missionType={getMissionType()}
                  missionId={`${type}-mission-1`}
                  onComplete={handleMissionComplete}
                  onClose={() => setShowMission(false)}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TilePopup; 