import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../services/api';
import { motion } from 'framer-motion';
// Usar require para la imagen hasta que la definición de tipos surta efecto
const logoImage = require('../assets/logo.png');

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [bounceAnimation, setBounceAnimation] = useState(false);
  
  // Efecto para iniciar la animación del botón de comenzar
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounceAnimation(true);
      setTimeout(() => {
        setBounceAnimation(false);
      }, 1000);
    }, 5000);
    
    return () => clearInterval(bounceInterval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    
    try {
      setLoading(true);
      await loginUser({ phone, password });
      toast.success('¡Inicio de sesión exitoso!');
      navigate('/home');
    } catch (error: any) {
      console.error('Error en inicio de sesión:', error);
      toast.error(error.response?.data?.detail || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de bienvenida estilo Duolingo mejorada
  if (!showLoginForm) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 overflow-hidden relative">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-blue-400 opacity-20"></div>
          <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-blue-300 opacity-20"></div>
          <div className="absolute bottom-1/3 -left-20 w-72 h-72 rounded-full bg-blue-500 opacity-20"></div>
          <div className="absolute -bottom-20 right-10 w-60 h-60 rounded-full bg-blue-600 opacity-20"></div>
          
          {/* Partículas flotantes - reducidas para móvil */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 md:w-6 md:h-6 rounded-full bg-white opacity-10"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 300), 
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 500) 
              }}
              animate={{ 
                x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 300)],
                y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 500)]
              }}
              transition={{ 
                duration: 10 + Math.random() * 10, 
                repeat: Infinity, 
                repeatType: "reverse"
              }}
            />
          ))}
          
          {/* Iconos de gamificación flotantes - optimizados para móvil */}
          <motion.div 
            className="absolute text-2xl md:text-3xl text-white opacity-20"
            initial={{ x: -20, y: 100, opacity: 0 }}
            animate={{ x: 30, y: 150, opacity: 0.2 }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          >
            🏆
          </motion.div>
          <motion.div 
            className="absolute text-2xl md:text-3xl text-white opacity-20"
            initial={{ 
              x: (typeof window !== 'undefined' ? window.innerWidth : 300) - 50, 
              y: 200, 
              opacity: 0 
            }}
            animate={{ 
              x: (typeof window !== 'undefined' ? window.innerWidth : 300) - 100, 
              y: 250, 
              opacity: 0.2 
            }}
            transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
          >
            💰
          </motion.div>
        </div>
        
        {/* Contenido principal */}
        <motion.div 
          className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 text-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo principal - tamaño adaptado para móvil */}
          <motion.div 
            className="w-28 h-28 md:w-36 md:h-36 bg-white rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-lg overflow-hidden"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src={logoImage} 
              alt="YuhuHero Logo" 
              className="w-20 h-20 md:w-28 md:h-28 object-contain"
            />
          </motion.div>
          
          {/* Título principal con animación */}
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold text-white mb-2 md:mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            YuhuHero
          </motion.h1>
          
          {/* Subtítulo con animación */}
          <motion.h2 
            className="text-xl md:text-2xl font-semibold text-white mb-8 md:mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            La manera divertida de dominar tus finanzas
          </motion.h2>
          
          {/* Características con animación - adaptadas para móvil */}
          <div className="mb-8 md:mb-10 space-y-3 md:space-y-5 w-full max-w-sm">
            {[
              { icon: '🎮', text: 'Aprende jugando y divirtiéndote', delay: 0.7 },
              { icon: '💡', text: 'Adquiere conocimientos financieros útiles', delay: 0.9 },
              { icon: '🏆', text: 'Gana recompensas y mejora tus finanzas', delay: 1.1 }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center text-white bg-blue-800 bg-opacity-30 rounded-lg p-2 md:p-3 shadow-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item.delay, duration: 0.5 }}
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(59, 130, 246, 0.4)' }}
              >
                <span className="mr-3 md:mr-4 text-xl md:text-2xl">{item.icon}</span>
                <span className="text-base md:text-xl">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Botones inferiores */}
        <motion.div 
          className="p-4 md:p-6 space-y-3 md:space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          <motion.button 
            onClick={() => navigate('/register')}
            className={`w-full py-3 md:py-4 bg-green-500 hover:bg-green-600 rounded-xl text-white font-bold text-base md:text-lg shadow-lg transition duration-200 relative overflow-hidden group`}
            animate={{ scale: bounceAnimation ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">COMENZAR AVENTURA</span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </motion.button>
          
          <motion.button 
            onClick={() => setShowLoginForm(true)}
            className="w-full py-3 md:py-4 bg-white hover:bg-gray-100 rounded-xl text-blue-600 font-bold text-base md:text-lg shadow-lg transition duration-200 relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">YA TENGO UNA CUENTA</span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Formulario de login mejorado y adaptado para móvil
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 p-3 md:p-4 overflow-hidden relative">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-blue-400 opacity-20"></div>
        <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-blue-300 opacity-20"></div>
        <div className="absolute bottom-1/3 -left-20 w-72 h-72 rounded-full bg-blue-500 opacity-20"></div>
        <div className="absolute -bottom-20 right-10 w-60 h-60 rounded-full bg-blue-600 opacity-20"></div>
      </div>
      
      <motion.div 
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-5 py-6 md:px-8 md:py-10">
          <motion.button 
            onClick={() => setShowLoginForm(false)}
            className="text-blue-600 mb-4 md:mb-6 flex items-center"
            whileHover={{ x: -5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver
          </motion.button>
          
          <div className="flex justify-center mb-4 md:mb-6">
            <motion.div 
              className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, 0] }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src={logoImage} 
                alt="YuhuHero Logo" 
                className="w-12 h-12 md:w-16 md:h-16 object-contain" 
              />
            </motion.div>
          </div>
          
          <motion.h2 
            className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Continúa tu aventura
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 mb-6 md:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ¡Tu progreso financiero te espera!
          </motion.p>
          
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1 md:mb-2">
                  Teléfono
                </label>
                <motion.input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  placeholder="Ingresa tu número de teléfono"
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1 md:mb-2">
                  Contraseña
                </label>
                <motion.input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  placeholder="Ingresa tu contraseña"
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-2 md:py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition duration-200 disabled:opacity-70 overflow-hidden relative text-base md:text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10">COMENZAR AVENTURA</span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-blue-700 transform scale-x-0 hover:scale-x-100 transition-transform origin-left"></span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
          
          <motion.div 
            className="text-center mt-4 md:mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Regístrate
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 