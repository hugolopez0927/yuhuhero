import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// Importación no tipada para evitar errores
import { useNavigate } from 'react-router-dom';
import { loginUser, User, getUserProfile } from '../services/api';

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Añadir log de depuración
  console.log("Login component renderizado");

  useEffect(() => {
    // Si ya hay token, redirige a /home o /quiz según corresponda
    const token = localStorage.getItem('token');
    
    if (token) {
      console.log("Token existente, verificando estado del quiz desde el backend");
      
      // En lugar de confiar en localStorage, verificamos el estado del quiz desde el backend
      const checkQuizStatus = async () => {
        try {
          // Obtenemos el perfil del usuario desde el backend
          const userProfile = await getUserProfile();
          
          if (userProfile) {
            console.log("Perfil obtenido del backend:", userProfile);
            
            // Actualizamos el localStorage con la información más reciente
            localStorage.setItem('quizCompleted', String(userProfile.quizCompleted));
            
            // Navegamos según el estado del quiz en el backend
            navigate(userProfile.quizCompleted ? '/home' : '/quiz', { replace: true });
          } else {
            // Si no se pudo obtener el perfil, intentamos con localStorage
            console.warn("No se pudo obtener el perfil del usuario, usando localStorage");
            const quizCompleted = localStorage.getItem('quizCompleted') === 'true';
            navigate(quizCompleted ? '/home' : '/quiz', { replace: true });
          }
        } catch (error) {
          console.error("Error verificando estado del usuario:", error);
          // Si hay algún error, intentamos con localStorage
          const quizCompleted = localStorage.getItem('quizCompleted') === 'true';
          navigate(quizCompleted ? '/home' : '/quiz', { replace: true });
        }
      };
      
      checkQuizStatus();
    }
  }, [navigate]);

  const handleLogin = async () => {
    // Evitar múltiples envíos
    if (isProcessing) return;
    
    // Validaciones
    if (!phone.trim() || !password.trim()) {
      toast.error('Teléfono y contraseña son obligatorios');
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error('El número debe tener 10 dígitos');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Mostrar estado de carga
      toast.info("Verificando credenciales...");
      
      // Llamada al backend
      console.log("Enviando solicitud login:", { phone });
      const user: User = await loginUser(phone, password);
      console.log("Respuesta login exitosa:", user);

      // Guardar token y metadatos en localStorage
      localStorage.setItem('token', String(user.token));
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userPhone', phone);
      localStorage.setItem('quizCompleted', String(user.quizCompleted));

      toast.success(`¡Hola de nuevo, ${user.name}!`);
      
      // Determinar la ruta de redirección
      const redirectTo = user.quizCompleted ? '/home' : '/quiz';
      console.log(`Login exitoso, navegando a: ${redirectTo}`);
      
      // Navegación con replace para evitar volver atrás
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      console.error("Error en login:", err);
      
      // Mostrar un mensaje de error más descriptivo
      if (err.message.includes('inválidas')) {
        toast.error('Teléfono o contraseña incorrectos');
      } else if (err.message.includes('no es JSON')) {
        toast.error('Error de conexión con el servidor. Verifica tu conexión a internet.');
      } else {
        toast.error(err.message || 'Error de autenticación');
      }
      
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{
        backgroundImage: 'url("/images/Login.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-80 bg-opacity-90">
        <h1 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h1>

        <input
          type="text"
          placeholder="WhatsApp (10 dígitos)"
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
          onKeyPress={handleKeyPress}
          className="p-2 border mb-2 w-full"
          disabled={isProcessing}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="p-2 border mb-4 w-full"
          disabled={isProcessing}
        />

        <button
          onClick={handleLogin}
          disabled={isProcessing}
          className={`${
            isProcessing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white px-4 py-2 rounded w-full transition-colors mb-3`}
        >
          {isProcessing ? 'Procesando...' : 'Entrar'}
        </button>

        <p className="mt-4 text-center">
          ¿No tienes cuenta?{' '}
          <span
            onClick={() => !isProcessing && navigate('/register')}
            className="text-green-500 cursor-pointer"
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login; 