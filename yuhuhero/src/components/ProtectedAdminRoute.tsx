import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Código de acceso para la administración
const ADMIN_ACCESS_CODE = 'yuhu1234';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Verifica el código almacenado en sessionStorage
    const storedCode = sessionStorage.getItem('adminAccessCode');
    setIsAuthorized(storedCode === ADMIN_ACCESS_CODE);
  }, []);

  // Muestra un loading mientras se verifica la autorización
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Verificando acceso...</div>
      </div>
    );
  }

  // Redirige a la página de admin si no está autorizado
  if (!isAuthorized) {
    return <Navigate to="/admin" replace />;
  }

  // Si está autorizado, muestra el contenido protegido
  return <>{children}</>;
};

export default ProtectedAdminRoute; 