import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserProfile } from '../services/api';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      
      // Si no hay token, no estamos autenticados
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Verificar si el token es válido
        const user = await getUserProfile();
        setIsAuthenticated(true);
        
        // Si la ruta no es /quiz y el usuario no ha completado el quiz, redirigir
        if (location.pathname !== '/quiz' && !user.quizCompleted) {
          toast.info('Primero debes completar el quiz financiero básico');
          // No hacemos nada más, el componente HomePage redirigirá al quiz
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyAuth();
  }, [location.pathname]);
  
  // Mientras verificamos, mostrar un loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
};

export default PrivateRoute; 