import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/home', label: 'Inicio', icon: '🏠', color: 'from-blue-500 to-blue-600' },
    { path: '/quiz', label: 'Quiz', icon: '❓', color: 'from-purple-500 to-purple-600' },
    { path: '/ahorro', label: 'Ahorro', icon: '💰', color: 'from-green-500 to-green-600' },
    { path: '/inversion', label: 'Inversión', icon: '📈', color: 'from-yellow-500 to-yellow-600' }
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-2"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="bg-blue-900 bg-opacity-90 backdrop-blur-md border border-blue-800 rounded-2xl shadow-xl p-2 max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-xl ${
                isActive(item.path) ? 'text-white' : 'text-blue-200'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive(item.path) && (
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-xl opacity-80`}
                  layoutId="navBackground"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              <span className={`text-2xl relative z-10 ${isActive(item.path) ? 'text-white' : ''}`}>
                {item.icon}
              </span>
              
              <span className={`text-xs mt-1 font-medium relative z-10 ${isActive(item.path) ? 'text-white' : ''}`}>
                {item.label}
              </span>
              
              {isActive(item.path) && (
                <motion.span
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BottomNav; 