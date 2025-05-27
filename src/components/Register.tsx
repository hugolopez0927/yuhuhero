// src/components/Register.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { registerUser, User } from '../services/api';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Añadir log de depuración
  console.log("Register component renderizado");

  // Verificar si ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem('token');
    const quizCompleted = localStorage.getItem('quizCompleted') === 'true';
    
    console.log("Register check - token:", !!token, "quizCompleted:", quizCompleted);
    
    if (token) {
      navigate(quizCompleted ? '/home' : '/quiz');
    }
  }, [navigate]);

  const handleRegister = async () => {
    // Prevenir múltiples envíos
    if (isLoading) {
      console.log("Ya hay una solicitud en proceso");
      return;
    }
    
    // Validaciones básicas
    if (!name.trim() || !phone.trim() || !password.trim()) {
      toast.error('Todos los campos son obligatorios');
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error('El número debe tener 10 dígitos');
      return;
    }

    try {
      // Activar estado de carga inmediatamente
      setIsLoading(true);
      
      // Mostrar estado de carga
      toast.info("Enviando datos de registro...");
      
      // Llamada al backend
      console.log("Enviando solicitud registro:", { name, phone });
      const user: User = await registerUser(name, phone, password);
      console.log("Respuesta registro:", user);

      // Guardar token y metadatos en localStorage
      localStorage.setItem('token', String(user.token));
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userPhone', phone);
      localStorage.setItem('quizCompleted', String(user.quizCompleted));

      toast.success(`¡Bienvenido, ${user.name}!`);
      console.log("Navegando a:", user.quizCompleted ? '/home' : '/quiz');
      
      // Navegar a la siguiente página (el estado isLoading permanece activo)
      navigate(user.quizCompleted ? '/home' : '/quiz');
    } catch (err: any) {
      console.error("Error en registro:", err);
      // Mostrar un mensaje de error más descriptivo
      if (err.message.includes('ya registrado')) {
        toast.error('Este número ya está registrado. Intenta iniciar sesión.');
      } else if (err.message.includes('no es JSON')) {
        toast.error('Error de conexión con el servidor. Verifica tu conexión a internet.');
      } else {
        toast.error(err.message || 'Error al registrarse');
      }
      // Desactivar estado de carga en caso de error
      setIsLoading(false);
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
        <h1 className="text-2xl font-bold mb-4 text-center">Registro</h1>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          className="p-2 border mb-2 w-full"
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder="WhatsApp (10 dígitos)"
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
          className="p-2 border mb-2 w-full"
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-2 border mb-4 w-full"
          disabled={isLoading}
        />

        <button
          onClick={handleRegister}
          className={`${
            isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          } text-white px-4 py-2 rounded w-full transition-colors`}
          disabled={isLoading}
        >
          {isLoading ? 'Registrando...' : 'Registrarme'}
        </button>

        <p className="mt-4 text-center">
          ¿Ya tienes cuenta?{' '}
          <span
            onClick={() => !isLoading && navigate('/login')}
            className={`${
              isLoading ? 'text-gray-400' : 'text-blue-500 cursor-pointer'
            }`}
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;

