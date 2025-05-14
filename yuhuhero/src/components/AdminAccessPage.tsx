import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Código de acceso simple para la página de administración
const ADMIN_ACCESS_CODE = 'yuhu1234';

const AdminAccessPage: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (accessCode === ADMIN_ACCESS_CODE) {
      // Guardar el código de acceso en sessionStorage para mantenerlo durante la sesión
      sessionStorage.setItem('adminAccessCode', accessCode);
      navigate('/admin/panel');
    } else {
      setError('Código de acceso incorrecto');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">Panel de Administración</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="accessCode" className="block text-white text-sm font-medium mb-2">
              Código de Acceso
            </label>
            <input
              id="accessCode"
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white p-3 placeholder-gray-400"
              placeholder="Ingresa el código de acceso"
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 text-white font-medium rounded-lg py-3 px-5 transition-colors"
          >
            Acceder
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-blue-400 hover:text-blue-300 text-sm">
            Volver a la página principal
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminAccessPage; 