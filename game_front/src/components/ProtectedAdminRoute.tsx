import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('token');
      const isAdminFlag = localStorage.getItem('isAdmin');
      
      // Para fines de este ejemplo, simplificamos la validación de admin
      // En una implementación real, verificaríamos con el backend
      if (!token || isAdminFlag !== 'true') {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Aquí se podría hacer una verificación adicional al backend
        // para validar permisos de administrador
        setIsAdmin(true);
      } catch (error) {
        console.error('Error verificando permisos de administrador:', error);
        setIsAdmin(false);
        toast.error('No tienes permisos de administrador.');
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyAdmin();
  }, []);
  
  // Mientras verificamos, mostrar un loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }
  
  // Si no es admin, redirigir a la página de acceso de admin
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  // Si es admin, mostrar el contenido protegido
  return <>{children}</>;
};

export default ProtectedAdminRoute; 