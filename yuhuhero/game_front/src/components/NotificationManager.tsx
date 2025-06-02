import React, { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';

const NotificationManager: React.FC = () => {
  const { fetchNotifications } = useNotificationStore();
  
  // Cargar notificaciones cuando el componente se monte
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        await fetchNotifications();
        
        // Configurar un intervalo para refrescar las notificaciones
        const intervalId = setInterval(() => {
          fetchNotifications();
        }, 30000); // Cada 30 segundos
        
        return () => clearInterval(intervalId);
      } catch (error) {
        console.error('Error cargando notificaciones:', error);
      }
    };
    
    const token = localStorage.getItem('token');
    if (token) {
      loadNotifications();
    }
  }, [fetchNotifications]);
  
  // Este componente no renderiza nada, solo gestiona las notificaciones
  return null;
};

export default NotificationManager; 