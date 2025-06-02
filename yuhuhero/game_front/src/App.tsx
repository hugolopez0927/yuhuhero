import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import HomePage from './components/HomePage';
import FinancialQuiz from './components/FinancialQuiz';
import NotificationManager from './components/NotificationManager';
import NotificationContainer from './components/NotificationContainer';
import AdminAccessPage from './components/AdminAccessPage';
import AdminPanel from './components/AdminPanel';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Register from './components/Register';
import DebugPanel from './components/DebugPanel';
import { testBackendConnection } from './services/api';
import './App.css';

// Componente principal
function App() {
  const [appInitialized, setAppInitialized] = useState(false);
  // Habilitar modo depuración (true en desarrollo, false en producción)
  const isDevelopment = process.env.NODE_ENV === 'development';
  const [debugMode] = useState(isDevelopment || true);
  
  // Al cargar la aplicación por primera vez
  useEffect(() => {
    console.log("App montada - Verificando estado inicial");
    
    // Probar conexión con el backend
    const checkBackendConnection = async () => {
      try {
        const workingUrl = await testBackendConnection();
        console.log(`Conexión al backend establecida en: ${workingUrl}`);
        toast.success("Conectado al backend", { autoClose: 2000 });
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        toast.error("No se pudo conectar al backend", { autoClose: 3000 });
      }
    };
    
    checkBackendConnection();
    
    // Verificar si ya hay un token válido antes de limpiar
    const existingToken = localStorage.getItem('token');
    
    // Si hay un token pero es inválido, necesitamos limpiarlo
    if (existingToken) {
      console.log("Token existente, manteniendo estado de localStorage");
      setAppInitialized(true);
    } else {
      // Solo limpiamos si no hay sesión activa
      console.log("No hay token, limpiando localStorage para reiniciar estado");
      localStorage.clear();
      console.log("localStorage completamente limpiado");
      setAppInitialized(true);
    }
    
    // Registramos la URL actual e información de la app
    console.log("Información de inicio:", {
      url: window.location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      debugMode
    });
  }, [debugMode]);

  // Si la app aún no está inicializada, mostramos un loader simple
  if (!appInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando YuhuHero...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <NotificationManager />
      <NotificationContainer />
      <ToastContainer position="bottom-right" autoClose={3000} />

      <Routes>
        {/* Públicas */}
        <Route path="/register" element={<Register />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/admin"    element={<AdminAccessPage />} />
        <Route
          path="/admin/panel"
          element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          }
        />

        {/* Privadas */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <FinancialQuiz />
            </PrivateRoute>
          }
        />
        <Route path="/ahorro"   element={<PrivateRoute><div className="p-4"><h1>Ahorro - Próximamente</h1></div></PrivateRoute>} />
        <Route path="/inversion" element={<PrivateRoute><div className="p-4"><h1>Inversión - Próximamente</h1></div></PrivateRoute>} />
        <Route path="/deudas"    element={<PrivateRoute><div className="p-4"><h1>Deudas - Próximamente</h1></div></PrivateRoute>} />

        {/* Redirects */}
        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Botón de emergencia - siempre visible para resetear la aplicación */}
      <div className="fixed bottom-4 left-4">
        <button
          onClick={() => {
            console.log("Reseteo de emergencia activado");
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="p-2 bg-red-500 text-white text-xs rounded-full w-8 h-8 flex items-center justify-center opacity-50 hover:opacity-100"
          title="Resetear aplicación"
        >
          R
        </button>
      </div>
      
      {/* Panel de depuración */}
      {debugMode && <DebugPanel />}
    </Router>
  );
}

export default App; 