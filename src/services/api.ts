// src/services/api.ts
import { toast } from 'react-toastify';

// URL fija del API
const API_URL = 'http://localhost:5001/api';
const BASE_URL = 'http://localhost:5001';

// Añadir configuración común para fetch
const commonFetchConfig = {
  mode: 'cors' as RequestMode,
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': window.location.origin
  }
};

// Verifica todos los puertos posibles
const TEST_URLS = [
  'http://localhost:5001/api',
  'http://localhost:3001/api',
  'http://localhost:5173/api'
];

// Función para probar las URLs
export const testBackendConnection = async () => {
  for (const url of TEST_URLS) {
    try {
      const response = await fetch(`${url}/auth/login`, {
        method: 'HEAD'
      });
      console.log(`Probando conexión a: ${url}`, response.status);
      if (response.status !== 404) {
        console.log(`✅ Backend encontrado en: ${url}`);
        return url;
      }
    } catch (error) {
      console.log(`❌ Error conectando a ${url}:`, error);
    }
  }
  console.log('No se pudo conectar a ninguna URL, usando por defecto');
  return API_URL;
};

// Modo simulado para desarrollo local sin backend
const MOCK_MODE = true; // FORZAMOS el modo simulado para no depender del backend
const MOCK_DELAY = 400; // Simular latencia de red en ms

// Variable para cambiar a modo simulado si hay errores de backend
let useMockMode = MOCK_MODE;

// Función para activar el modo simulado si hay problemas con el backend
const activateMockMode = () => {
  console.log('⚠️ Activando modo simulado por problemas de conexión con el backend');
  useMockMode = true;
  // Notificar al usuario
  toast.warning('Usando modo simulado por problemas de conexión con el backend', {
    position: "top-center",
    autoClose: 4000
  });
};

// Clave para almacenar usuarios en localStorage
const LOCAL_STORAGE_USERS_KEY = 'yuhuhero_users';

// Almacenamiento local simulado
let mockUsers: Record<string, User> = {};

// Cargar usuarios guardados en localStorage
const loadUsersFromLocalStorage = () => {
  try {
    const savedUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (savedUsers) {
      mockUsers = JSON.parse(savedUsers);
      console.log('Usuarios cargados desde localStorage:', Object.keys(mockUsers).length);
    }
  } catch (error) {
    console.error('Error cargando usuarios desde localStorage:', error);
  }
};

// Guardar usuarios en localStorage
const saveUsersToLocalStorage = () => {
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(mockUsers));
    console.log('Usuarios guardados en localStorage:', Object.keys(mockUsers).length);
  } catch (error) {
    console.error('Error guardando usuarios en localStorage:', error);
  }
};

// Limpiar usuarios al iniciar
loadUsersFromLocalStorage();

export interface User {
  id: string;
  name: string;
  phone: string;
  token: string;
  quizCompleted: boolean;
}

// Función para generar un token simulado
const generateMockToken = (): string => {
  return `mock-token-${Math.random().toString(36).substring(2, 15)}`;
};

// Función para manejar respuestas de fetch
const handleResponse = async (response: Response) => {
  // Verificar el tipo de contenido
  const contentType = response.headers.get('content-type');
  
  // Si no es JSON, obtener el texto de la respuesta para mejor depuración
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Respuesta no JSON:', text);
    throw new Error(`Respuesta del servidor no es JSON. Status: ${response.status}, Contenido: ${text.substring(0, 100)}...`);
  }
  
  // Si es JSON, procesarlo normalmente
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }
  
  return data;
};

// Función para registrar un nuevo usuario
export const registerUser = async (name: string, phone: string, password: string): Promise<User> => {
  // Si estamos en modo simulado, no llamamos al backend
  if (useMockMode) {
    console.log('⚠️ API en modo simulado - Registro');
    
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    // Verificar si ya existe el usuario
    if (mockUsers[phone]) {
      throw new Error('Usuario ya registrado con este número de teléfono');
    }
    
    // Crear usuario simulado
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      phone,
      token: generateMockToken(),
      quizCompleted: false
    };
    
    // Guardar en almacenamiento local simulado
    mockUsers[phone] = newUser;
    console.log('👤 Usuario registrado (simulado):', newUser);
    
    // Guardar usuarios en localStorage para persistencia
    saveUsersToLocalStorage();
    
    return newUser;
  }
  
  // Código original para backend real
  try {
    console.log('Enviando solicitud a:', `${API_URL}/auth/register`);
    console.log('Datos:', { name, phone, password });
    
    // Verificar si podemos acceder al servidor primero
    try {
      const testResponse = await fetch(BASE_URL, { 
        method: 'GET',
        mode: commonFetchConfig.mode,
        credentials: commonFetchConfig.credentials,
        headers: {
          'Accept': 'text/html,application/json'
        }
      });
      console.log('Test de conectividad al servidor:', testResponse.status, testResponse.statusText);
    } catch (testError) {
      console.error('Error en test de conectividad:', testError);
    }
    
    // Ahora enviamos la petición real
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      ...commonFetchConfig,
      body: JSON.stringify({ name, phone, password }),
    });

    // Si la respuesta no es JSON, obtenemos el texto para depuración
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Respuesta no JSON:', { 
        status: response.status, 
        contentType, 
        text: text.substring(0, 200),
        url: response.url,
        headers: Array.from(response.headers.entries()).reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {} as Record<string, string>),
      });
      throw new Error(`Respuesta del servidor no es JSON. Status: ${response.status}, Contenido: ${text.substring(0, 100)}...`);
    }
    
    // Si es JSON, procesamos la respuesta
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el registro');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error detallado en registro:', error);
    activateMockMode();
    throw new Error(error.message || 'Error al registrar usuario');
  }
};

// Función para iniciar sesión
export const loginUser = async (phone: string, password: string): Promise<User> => {
  // Si estamos en modo simulado, no llamamos al backend
  if (useMockMode) {
    console.log('⚠️ API en modo simulado - Login');
    
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    // Verificar credenciales
    const user = mockUsers[phone];
    if (!user) {
      // Para cualquier otro número que no existe
      throw new Error('Credenciales inválidas. Usuario no encontrado.');
    }
    
    // En un entorno real verificaríamos la contraseña
    console.log('👤 Usuario logueado (simulado):', user);
    
    return user;
  }
  
  // Código original para backend real
  try {
    console.log('Enviando solicitud a:', `${API_URL}/auth/login`);
    console.log('Datos de login:', { phone, passwordLength: password.length });
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      ...commonFetchConfig,
      body: JSON.stringify({ phone, password }),
    });

    // Si la respuesta no es JSON, obtenemos el texto para depuración
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Respuesta no JSON en login:', { 
        status: response.status, 
        contentType, 
        text: text.substring(0, 200),
        url: response.url
      });
      throw new Error(`Respuesta del servidor no es JSON. Status: ${response.status}, Contenido: ${text.substring(0, 100)}...`);
    }
    
    // Si es JSON, procesamos la respuesta
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el inicio de sesión');
    }
    
    const userData = await response.json();
    console.log('Login exitoso, datos recibidos:', userData);
    return userData;
  } catch (error: any) {
    console.error('Error detallado en login:', error);
    activateMockMode();
    throw new Error(error.message || 'Error al iniciar sesión');
  }
};

// Función para verificar el token del usuario
export const checkAuthToken = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }
  
  // En modo simulado, simplemente devolvemos true si existe token
  if (useMockMode) {
    console.log('⚠️ API en modo simulado - Verificación de token');
    return true;
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/check`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error verificando token:', error);
    activateMockMode();
    return false;
  }
};

// Función para obtener el perfil del usuario (incluyendo el estado del quiz)
export const getUserProfile = async (): Promise<User | null> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null;
  }
  
  // En modo simulado
  if (useMockMode) {
    console.log('⚠️ API en modo simulado - Obtención de perfil');
    
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    // Obtener usuario por teléfono (si disponible)
    const phone = localStorage.getItem('userPhone');
    if (phone && mockUsers[phone]) {
      const user = mockUsers[phone];
      console.log('Usuario encontrado por teléfono:', user);
      return user;
    }
    
    // Si no, buscar por token
    const userEntry = Object.entries(mockUsers).find(([_, user]) => user.token === token);
    if (userEntry) {
      console.log('Usuario encontrado por token:', userEntry[1]);
      return userEntry[1];
    }
    
    console.log('No se encontró ningún usuario con el token o teléfono proporcionado');
    return null;
  }
  
  try {
    console.log('Enviando solicitud para obtener perfil con token');
    
    const response = await fetch(`${API_URL}/users/profile`, {
      ...commonFetchConfig,
      headers: {
        ...commonFetchConfig.headers,
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      console.error('Error en la respuesta:', response.status, response.statusText);
      throw new Error('Error al obtener perfil');
    }
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error obteniendo perfil de usuario:', error);
    activateMockMode();
    return null;
  }
};

// Función para actualizar el estado del quiz completado
export const updateQuizStatus = async (completed: boolean): Promise<boolean> => {
  const token = localStorage.getItem('token');
  const phone = localStorage.getItem('userPhone');
  
  if (!token) {
    console.error("No hay token disponible para actualizar estado del quiz");
    return false;
  }
  
  // En modo simulado, actualizamos el estado en nuestro almacenamiento simulado
  if (useMockMode) {
    console.log('⚠️ API en modo simulado - Actualización estado quiz:', completed);
    
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    // Encontrar el usuario por teléfono o por algún identificador en localStorage
    if (phone && mockUsers[phone]) {
      console.log('Actualizando estado del quiz para usuario:', phone);
      mockUsers[phone].quizCompleted = completed;
      
      // También guardar en localStorage para la sesión actual
      localStorage.setItem('quizCompleted', String(completed));
      
      // Guardar usuarios en localStorage para persistencia
      saveUsersToLocalStorage();
      
      console.log('Estado del quiz actualizado en mockUsers:', mockUsers[phone]);
      return true;
    } else {
      console.log('No se pudo encontrar el usuario para actualizar el estado del quiz');
      
      // Buscar si existe algún usuario con el token actual
      const userEntry = Object.entries(mockUsers).find(([_, user]) => user.token === token);
      if (userEntry) {
        const [userPhone, user] = userEntry;
        console.log('Usuario encontrado por token:', userPhone);
        user.quizCompleted = completed;
        
        // Guardar el teléfono para futuras referencias
        localStorage.setItem('userPhone', userPhone);
        localStorage.setItem('quizCompleted', String(completed));
        
        // Guardar usuarios en localStorage para persistencia
        saveUsersToLocalStorage();
        
        console.log('Estado del quiz actualizado en mockUsers:', user);
        return true;
      }
      
      console.log('No se pudo actualizar el estado del quiz, usuario no encontrado');
      return false;
    }
  }
  
  try {
    console.log('Enviando solicitud para actualizar estado del quiz con token');
    console.log('URL completa:', `${API_URL}/users/quiz-status`);
    console.log('Headers de autenticación:', `Bearer ${token.substring(0, 20)}...`);
    console.log('Datos enviados:', { completed });
    
    const response = await fetch(`${API_URL}/users/quiz-status`, {
      method: 'POST',
      ...commonFetchConfig,
      headers: {
        ...commonFetchConfig.headers,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ completed })
    });
    
    if (!response.ok) {
      // Si la respuesta no es JSON, obtenemos el texto para depuración
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Respuesta no JSON en actualización de quiz:', { 
          status: response.status, 
          contentType, 
          text: text.substring(0, 200),
          url: response.url,
          headers: Array.from(response.headers.entries()).reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
          }, {} as Record<string, string>),
        });
        throw new Error(`Error al actualizar estado del quiz: ${response.status}`);
      }
      
      const errorData = await response.json();
      console.error('Error en la respuesta:', errorData);
      throw new Error(errorData.message || 'Error al actualizar estado del quiz');
    }
    
    // Verificar la respuesta
    let responseData;
    try {
      responseData = await response.json();
      console.log('Respuesta de actualización de quiz:', responseData);
    } catch (e) {
      console.log('Respuesta sin contenido JSON, pero estado OK');
    }
    
    // Si llegamos aquí, la operación fue exitosa
    return true;
  } catch (error) {
    console.error('Error actualizando estado del quiz:', error);
    // No activamos el modo simulado automáticamente aquí
    return false;
  }
}; 