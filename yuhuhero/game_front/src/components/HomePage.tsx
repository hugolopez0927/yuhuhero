import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import GameMap from './GameMap';
import BottomNav from './BottomNav';
import { getUserProfile } from '../services/api';
import { User } from '../services/api';
import { toast } from 'react-toastify';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  
  const { currentLevel, coins, fetchGameProgress } = useGameStore();
  
  // Lista de consejos financieros
  const financialTips = [
    "Establece un presupuesto mensual y respétalo",
    "Ahorra al menos el 10% de tus ingresos",
    "Paga primero las deudas con tasas de interés más altas",
    "Crea un fondo de emergencia para gastos inesperados",
    "Invierte a largo plazo para aprovechar el interés compuesto"
  ];
  
  // Mostrar un consejo aleatorio
  useEffect(() => {
    const showRandomTip = () => {
      const randomIndex = Math.floor(Math.random() * financialTips.length);
      setTipIndex(randomIndex);
      setShowTip(true);
      
      // Ocultar el consejo después de 5 segundos
      setTimeout(() => {
        setShowTip(false);
      }, 5000);
    };
    
    // Mostrar un consejo inicial después de 2 segundos
    const tipTimer = setTimeout(() => {
      if (!loading) {
        showRandomTip();
      }
    }, 2000);
    
    // Mostrar un nuevo consejo cada 30 segundos
    const tipInterval = setInterval(() => {
      if (!loading) {
        showRandomTip();
      }
    }, 30000);
    
    return () => {
      clearTimeout(tipTimer);
      clearInterval(tipInterval);
    };
  }, [loading, financialTips]);
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        // Cargar perfil de usuario
        const userData = await getUserProfile();
        setUser(userData);
        
        // Verificar si el usuario ha completado el quiz financiero
        if (!userData.quizCompleted) {
          toast.info('¡Completa el quiz financiero básico para comenzar tu aventura!');
          navigate('/quiz'); // Redirigir al quiz si no está completado
          return;
        }
        
        // Cargar progreso del juego desde el servidor
        await fetchGameProgress();
        
        // Mostrar una animación de logro aleatorio después de cargar
        setTimeout(() => {
          setShowAchievement(true);
          setTimeout(() => setShowAchievement(false), 3000);
        }, 1000);
      } catch (error) {
        console.error('Error cargando datos de usuario:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [fetchGameProgress, navigate]);
  
  // Animación de estrellas para el fondo - optimizada para móvil
  const renderStars = () => {
    const stars = [];
    // Menos estrellas en dispositivos móviles para mejor rendimiento
    const starCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < starCount; i++) {
      const size = Math.random() * 3;
      stars.push(
        <motion.div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: Math.random() * 5
          }}
        />
      );
    }
    return stars;
  };
  
  // Elementos decorativos adicionales para el fondo
  const renderDecorations = () => {
    return (
      <>
        {/* Planetas decorativos */}
        <motion.div 
          className="absolute bottom-20 left-5 w-16 h-16 md:w-24 md:h-24 rounded-full bg-purple-500 bg-opacity-20 hidden md:block"
          animate={{ 
            y: [0, -10, 0],
            rotate: 360
          }}
          transition={{ 
            y: { duration: 3, repeat: Infinity },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        />
        
        {/* Cometa animado */}
        <motion.div
          className="absolute top-1/4 right-10 hidden md:block"
          animate={{
            x: [-100, window.innerWidth + 100],
            y: [0, 50, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <div className="w-4 h-4 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50"></div>
          <div className="absolute top-1 right-4 w-12 h-1 bg-gradient-to-l from-transparent to-yellow-300/70 rounded-full"></div>
        </motion.div>
      </>
    );
  };
  
  // Mostrar loading mientras carga los datos
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600 relative overflow-hidden">
        {renderStars()}
        <div className="text-center z-10 bg-blue-900 bg-opacity-40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-700 border-opacity-40">
          <motion.div 
            className="w-20 h-20 border-4 border-blue-300 border-t-blue-500 rounded-full mx-auto"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
          />
          <motion.p 
            className="mt-6 text-xl font-medium text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Preparando tu aventura financiera...
          </motion.p>
          <motion.div
            className="max-w-xs mx-auto mt-4 h-2 bg-blue-800 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5 }}
          >
            <motion.div
              className="h-full bg-blue-300"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
            />
          </motion.div>
          
          {/* Mensaje motivacional */}
          <motion.p
            className="text-blue-200 text-sm mt-6 max-w-xs mx-auto italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            "El camino hacia la libertad financiera comienza con pequeños pasos."
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600 relative overflow-hidden">
      {/* Estrellas en el fondo */}
      {renderStars()}
      {renderDecorations()}
      
      {/* Header con animación */}
      <motion.header 
        className="bg-blue-800 bg-opacity-50 backdrop-blur-sm text-white p-4 shadow-lg border-b border-blue-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-xl md:text-2xl font-bold flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="mr-2 text-yellow-300"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop", repeatDelay: 5 }}
            >
              ✨
            </motion.span>
            YuhuHero
          </motion.h1>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <motion.div 
              className="flex items-center bg-yellow-500 bg-opacity-30 px-2 md:px-3 py-1 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: coins > 0 ? ["0 0 0 rgba(234, 179, 8, 0)", "0 0 8px rgba(234, 179, 8, 0.5)", "0 0 0 rgba(234, 179, 8, 0)"] : "none"
              }}
              transition={{ 
                duration: 2, 
                repeat: coins > 0 ? Infinity : 0, 
                repeatDelay: 2 
              }}
            >
              <motion.span 
                className="text-yellow-300 text-lg md:text-xl mr-1 md:mr-2"
                animate={{ rotate: coins > 10 ? 360 : 0 }}
                transition={{ duration: 2, repeat: coins > 10 ? Infinity : 0, ease: "linear" }}
              >
                ✦
              </motion.span>
              <span className="font-medium text-sm md:text-base">{coins}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center bg-green-500 bg-opacity-30 px-2 md:px-3 py-1 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-green-300 text-lg md:text-xl mr-1 md:mr-2">📊</span>
              <span className="font-medium text-sm md:text-base">Nivel {currentLevel}</span>
            </motion.div>
          </div>
        </div>
      </motion.header>
      
      {/* Bienvenida al usuario con animación */}
      <motion.div 
        className="py-6 md:py-8 px-4 text-center text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          className="inline-block"
          whileHover={{ scale: 1.03 }}
        >
          <motion.h2 
            className="text-2xl md:text-3xl font-bold"
            animate={{ 
              textShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 10px rgba(255,255,255,0.5)", "0 0 0px rgba(255,255,255,0)"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ¡Hola, {user?.name || 'Aventurero'}!
          </motion.h2>
        </motion.div>
        
        <motion.p 
          className="text-blue-100 text-base md:text-lg mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Continúa tu viaje hacia la libertad financiera
        </motion.p>
      </motion.div>
      
      {/* Título del mapa */}
      <motion.h3 
        className="text-lg md:text-xl font-bold text-white text-center mb-4 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.span 
          className="mr-2"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🗺️
        </motion.span>
        Tu camino financiero
      </motion.h3>
      
      {/* Mapa del juego */}
      <motion.div 
        className="px-4 pb-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <GameMap />
      </motion.div>
      
      {/* Animación de logro */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            className="fixed top-24 left-0 right-0 mx-auto w-64 md:w-72 bg-gradient-to-r from-yellow-500 to-amber-600 text-white py-3 px-4 rounded-lg shadow-xl z-50 flex items-center justify-center"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <motion.span 
              className="text-2xl md:text-3xl mr-3"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: 2 }}
            >
              🏆
            </motion.span>
            <div>
              <p className="font-bold">¡Logro desbloqueado!</p>
              <p className="text-sm">Seguir aprendiendo financieramente</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Consejos financieros */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            className="fixed bottom-20 left-0 right-0 mx-auto w-72 md:w-80 bg-blue-900 bg-opacity-80 backdrop-blur-sm text-white py-3 px-4 rounded-lg shadow-lg z-40 border border-blue-700"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <div className="flex items-start">
              <motion.span 
                className="text-xl text-blue-300 mr-3 mt-1 flex-shrink-0"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: 2 }}
              >
                💡
              </motion.span>
              <div>
                <p className="font-medium text-sm text-blue-200 mb-1">Consejo financiero:</p>
                <p className="text-sm">{financialTips[tipIndex]}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Navegación inferior */}
      <BottomNav />
    </div>
  );
};

export default HomePage; 