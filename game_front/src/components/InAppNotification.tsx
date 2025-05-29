import React, { useEffect, useState } from 'react';

interface InAppNotificationProps {
  id: string;
  title: string;
  message: string;
  type: string;
  onClose: () => void;
}

const InAppNotification: React.FC<InAppNotificationProps> = ({
  id,
  title,
  message,
  type,
  onClose
}) => {
  const [timeLeft, setTimeLeft] = useState(5);
  
  // Auto-cerrar después de 5 segundos
  useEffect(() => {
    if (timeLeft <= 0) {
      onClose();
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, onClose]);
  
  // Diferentes estilos según el tipo de notificación
  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };
  
  // Diferentes iconos según el tipo de notificación
  const getNotificationIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };
  
  return (
    <div 
      className={`rounded-lg border-l-4 p-4 shadow-md ${getNotificationStyles()}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <span className="text-lg">{getNotificationIcon()}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <p className="font-bold">{title}</p>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>
          <p className="text-sm">{message}</p>
        </div>
      </div>
      
      {/* Barra de progreso */}
      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
        <div 
          className="h-1 rounded-full bg-current transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default InAppNotification; 