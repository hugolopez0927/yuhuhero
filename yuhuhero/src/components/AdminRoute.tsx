import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AdminPanel from './AdminPanel';

interface AdminRouteProps {
  path: string;
  accessCode?: string;
}

// Código de acceso simple para la página de administración
const ADMIN_ACCESS_CODE = 'yuhu1234';

const AdminRoute: React.FC<AdminRouteProps> = ({ path, accessCode }) => {
  // Verifica si el código de acceso es válido
  const isAuthorized = () => {
    return accessCode === ADMIN_ACCESS_CODE;
  };

  return (
    <Route 
      path={path} 
      element={isAuthorized() ? <AdminPanel /> : <Navigate to="/" replace />} 
    />
  );
};

export default AdminRoute; 