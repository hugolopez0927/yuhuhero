import React, { useEffect, useState } from 'react';
import { isPushNotificationSupported, askUserPermission, registerServiceWorker, sendNotification } from '../services/notificationService';

const NotificationManager: React.FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState(Notification.permission);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSupport = async () => {
      const supported = isPushNotificationSupported();
      setIsSupported(supported);
      
      if (supported) {
        await registerServiceWorker();
      }
    };
    
    checkSupport();
  }, []);
  
  const handleRequestPermission = async () => {
    try {
      const result = await askUserPermission();
      setPermission(result);
    } catch (err) {
      setError('Error al solicitar permisos');
      console.error(err);
    }
  };
  
  const handleSendTestNotification = async () => {
    try {
      await sendNotification(
        '¡Misión Financiera!', 
        '¡Es hora de completar tu misión de ahorro diaria!',
        '/ahorro'
      );
    } catch (err) {
      setError('Error al enviar notificación');
      console.error(err);
    }
  };
  
  if (!isSupported) {
    return null;
  }
  
  return (
    <div className="fixed top-2 right-2 z-50">
      {permission !== 'granted' && (
        <button 
          onClick={handleRequestPermission}
          className="bg-savings text-white p-2 rounded-full shadow-md"
          aria-label="Activar notificaciones"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
          </svg>
        </button>
      )}
      
      {permission === 'granted' && (
        <button 
          onClick={handleSendTestNotification}
          className="bg-investment text-white p-2 rounded-full shadow-md flex items-center justify-center"
          aria-label="Enviar notificación de prueba"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
            <circle cx="18" cy="6" r="5" fill="#F59E0B" stroke="white" strokeWidth="1.5"/>
          </svg>
        </button>
      )}
      
      {error && (
        <div className="mt-2 bg-red-500 text-white p-2 rounded text-xs">
          {error}
        </div>
      )}
    </div>
  );
};

export default NotificationManager; 