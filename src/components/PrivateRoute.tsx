import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUserProfile } from '../services/api';
import { toast } from 'react-toastify';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // Para evitar bucles infinitos
  const currentPath = location.pathname;

  // Verificar autenticación principalmente desde localStorage
  useEffect(() => {
    // Si ya verificamos, no lo hacemos de nuevo
    if (authChecked) return;
    
    const verifyAuth = async () => {
      // Verificar token almacenado localmente
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log("No se encontró token en localStorage");
        setIsAuthenticated(false);
        setIsLoading(false);
        setAuthChecked(true);
        return;
      }
      
      // Verificar si es usuario de prueba (Hugol)
      const userName = localStorage.getItem('userName');
      const userPhone = localStorage.getItem('userPhone');
      const isTestUser = userName === 'Hugol' || userPhone === '0987654321';
      
      if (isTestUser) {
        console.log("Usuario de prueba detectado. Configurando acceso completo.");
        // Para usuarios de prueba, establecer como autenticado y quiz completado
        setIsAuthenticated(true);
        setQuizCompleted(true);
        // Asegurar que quizCompleted se establezca a true para evitar redirecciones
        localStorage.setItem('quizCompleted', 'true');
        setIsLoading(false);
        setAuthChecked(true);
        return;
      }
      
      // Para todos los demás usuarios, confiar en localStorage primero
      const storedQuizStatus = localStorage.getItem('quizCompleted') === 'true';
      
      // Solo como respaldo, intentar obtener el perfil desde el servicio
      try {
        // Opcional: obtener perfil del usuario desde simulación o backend
        const userProfile = await getUserProfile();
        
        if (userProfile) {
          console.log("Perfil obtenido correctamente:", userProfile);
          setIsAuthenticated(true);
          
          // Usamos la propiedad quizCompleted del perfil o localStorage, priorizando el valor más favorable
          // Esto asegura que una vez completado, no se "pierde" el estado de completado
          const isQuizCompletedFromProfile = userProfile.quizCompleted;
          const finalQuizStatus = isQuizCompletedFromProfile || storedQuizStatus;
          
          setQuizCompleted(finalQuizStatus);
          
          // Solo actualizamos localStorage si el estado es más favorable (completado)
          if (finalQuizStatus) {
            localStorage.setItem('quizCompleted', 'true');
          }
        } else {
          // Si no se puede obtener el perfil, usar datos de localStorage
          console.log("No se pudo obtener el perfil del usuario, usando localStorage");
          setIsAuthenticated(true);
          setQuizCompleted(storedQuizStatus);
        }
      } catch (error) {
        // En caso de error, usar datos de localStorage
        console.error('Error verificando autenticación:', error);
        setIsAuthenticated(true);
        setQuizCompleted(storedQuizStatus);
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };
    
    verifyAuth();
  }, [currentPath, authChecked]);

  // Registrar cada verificación de ruta privada
  useEffect(() => {
    console.log("PrivateRoute - Verificación:", { 
      path: currentPath,
      isAuthenticated, 
      quizCompleted,
      isLoading,
      authChecked,
      timestamp: new Date().toISOString()
    });
  }, [currentPath, isAuthenticated, quizCompleted, isLoading, authChecked]);

  // Mostrar indicador de carga mientras verificamos la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está logueado → a Login
  if (!isAuthenticated) {
    console.log("No autenticado, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  // Verificar si es usuario de prueba para permitir el acceso a Home sin importar el estado del quiz
  const userName = localStorage.getItem('userName');
  const userPhone = localStorage.getItem('userPhone');
  const isTestUser = userName === 'Hugol' || userPhone === '0987654321';

  // Si intenta acceder a /home sin completar el quiz → a Quiz (excepto usuario de prueba)
  if (currentPath === '/home' && !quizCompleted && !isTestUser) {
    console.log("Intento de acceso a /home sin completar quiz, redirigiendo a /quiz");
    return <Navigate to="/quiz" replace />;
  }

  // Si intenta acceder al quiz pero ya lo completó → a Home (excepto usuario de prueba)
  if (currentPath === '/quiz' && quizCompleted) {
    console.log("Quiz ya completado, redirigiendo a /home");
    return <Navigate to="/home" replace />;
  }

  // Si está autenticado y cumple los requisitos, mostrar el componente hijo
  return <>{children}</>;
};

export default PrivateRoute;

