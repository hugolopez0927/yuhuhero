import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InAppNotificationProps {
  title: string;
  message: string;
  duration?: number;
  type?: 'success' | 'info' | 'warning' | 'error';
  onClose?: () => void;
}

const InAppNotification: React.FC<InAppNotificationProps> = ({
  title,
  message,
  duration = 4000,
  type = 'info',
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const bgColors = {
    success: 'bg-savings',
    info: 'bg-blue-500',
    warning: 'bg-investment',
    error: 'bg-red-500',
  };
  
  const icons = {
    success: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    error: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed bottom-16 left-0 right-0 mx-auto w-11/12 max-w-sm z-50 rounded-lg shadow-lg ${bgColors[type]} text-white`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 flex items-start">
            <div className="flex-shrink-0 mr-3">
              {icons[type]}
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{title}</h3>
              <p className="text-sm mt-1">{message}</p>
            </div>
            <button onClick={handleClose} className="ml-2 flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InAppNotification; 