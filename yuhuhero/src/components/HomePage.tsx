import React, { useEffect } from 'react';
import Header from './Header';
import GameMap from './GameMap';
import BottomNav from './BottomNav';
import { sendNotification } from '../services/notificationService';
import { useNotificationStore } from '../store/notificationStore';

const HomePage: React.FC = () => {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    // Notificación de bienvenida después de completar el cuestionario
    addNotification({
      title: '¡Has completado el cuestionario inicial!',
      message: 'Ahora puedes explorar el universo financiero y completar misiones.',
      type: 'success',
      duration: 6000
    });

    // Ejemplo de notificación programada después de 10 segundos
    const timer = setTimeout(async () => {
      if (Notification.permission === 'granted') {
        await sendNotification(
          '¡Nueva misión financiera!',
          'Has desbloqueado nuevas misiones de ahorro. ¡Complétala para ganar recompensas!',
          '/ahorro'
        );
      } else {
        // Si no hay permiso, usamos la notificación in-app
        addNotification({
          title: '¡Nueva misión financiera!',
          message: 'Has desbloqueado nuevas misiones de ahorro. ¡Complétala para ganar recompensas!',
          type: 'info',
          duration: 5000
        });
      }
    }, 10000); // 10 segundos para demostración

    return () => clearTimeout(timer);
  }, [addNotification]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <main className="flex-1 relative min-h-[600px]">
        <GameMap />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default HomePage; 