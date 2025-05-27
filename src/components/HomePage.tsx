import React, { useEffect, useState } from 'react';
import Header from './Header';
import GameMap from './GameMap';
import BottomNav from './BottomNav';
import { sendNotification } from '../services/notificationService';
import { useNotificationStore } from '../store/notificationStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const HomePage: React.FC = () => {
  const { addNotification } = useNotificationStore();
  const [userName, setUserName] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar nombre del usuario y validar token
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    
    if (!token) {
      // Si no hay token, redirigir al login
      navigate('/login');
      return;
    }
    
    if (storedUserName) {
      setUserName(storedUserName);
    }

    // Verificar si el quiz ha sido completado
    const isQuizCompleted = localStorage.getItem('quizCompleted') === 'true';
    setQuizCompleted(isQuizCompleted);

    // Mostrar notificación solo si se completó el cuestionario
    if (isQuizCompleted) {
      // Notificación de bienvenida después de completar el cuestionario
      addNotification({
        title: '¡Has completado el cuestionario inicial!',
        message: 'Ahora puedes explorar el universo financiero y completar misiones.',
        type: 'success',
        duration: 6000
      });
    }

    // Notificación programada
    const timer = setTimeout(async () => {
      if (Notification.permission === 'granted') {
        await sendNotification(
          '¡Nueva misión financiera!',
          'Has desbloqueado nuevas misiones de ahorro. ¡Complétala para ganar recompensas!',
          '/ahorro'
        );
      } else {
        addNotification({
          title: '¡Nueva misión financiera!',
          message: 'Has desbloqueado nuevas misiones de ahorro. ¡Complétala para ganar recompensas!',
          type: 'info',
          duration: 5000
        });
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [addNotification, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('quizCompleted'); // También limpiar el estado del quiz
    toast.info('Sesión cerrada');
    navigate('/login');
  };

  // Redirigir al quiz si no lo ha completado
  useEffect(() => {
    if (userName && !quizCompleted) {
      navigate('/quiz');
    }
  }, [quizCompleted, userName, navigate]);

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden"
      style={{
        /* Usando un color de fondo agradable mientras se coloca la imagen */
        backgroundColor: '#3b82f6', /* Un azul bonito */
        backgroundImage: 'url("/images/HomeFondo.png")', /* Se usará cuando la imagen esté disponible */
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Header />

      <main className="flex-1 relative min-h-[600px]">
        <div className="absolute top-4 right-4 text-right z-50">
          {userName && (
            <div className="bg-white bg-opacity-80 p-3 rounded-lg shadow-md">
              <p className="font-semibold">Hola, {userName} 👋</p>
              <button
                onClick={handleLogout}
                className="mt-2 px-3 py-1.5 text-red-600 bg-white bg-opacity-80 rounded-lg shadow-sm hover:bg-opacity-100 transition-all"
                style={{ zIndex: 999 }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        <GameMap />
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePage;
