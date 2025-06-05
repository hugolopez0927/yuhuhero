import axios from 'axios';
import { toast } from 'react-toastify';

// URL base del API - usar URL relativa para que funcione con nginx proxy
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001/api'  // Para desarrollo local
  : '/api';  // Para producción (a través de nginx proxy)

// Cliente Axios configurado
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // No necesitamos cookies ya que usamos JWT en Authorization header
  withCredentials: false,
});

// Interceptor para añadir el token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Manejar errores de autenticación
    if (error.response && error.response.status === 401) {
      // Si no estamos en la página de login, redireccionar
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        window.location.href = '/login';
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
      }
    }
    return Promise.reject(error);
  }
);

// URLs de prueba para backend
const TEST_URLS = [
  window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api',
  'http://localhost:5001/api',
  'http://localhost:3001/api',
  'http://localhost:5173/api'
];

// Verificar conexión con el backend
export const testBackendConnection = async (): Promise<string> => {
  for (const url of TEST_URLS) {
    try {
      const response = await fetch(`${url}/auth/login`, {
        method: 'HEAD',
      });
      if (response.status !== 404) {
        return url;
      }
    } catch (error) {
      console.log(`Error conectando a ${url}:`, error);
    }
  }
  throw new Error('No se pudo conectar con el backend');
};

// Tipos de datos
export interface User {
  id: string;
  name: string;
  phone: string;
  token?: string;
  quizCompleted: boolean;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterData {
  name: string;
  phone: string;
  password: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correct_option_id?: string;
  explanation?: string;
}

export interface QuizSubmission {
  quiz_id: string;
  answers: {
    question_id: string;
    selected_option_id: string;
  }[];
}

export interface QuizResult {
  correct_answers: number;
  total_questions: number;
  score: number;
  passed: boolean;
  rewards: number;
}

export interface GameProgress {
  current_level: number;
  coins: number;
  completed_levels: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

// Funciones de API
export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  try {
    console.log("Intentando login con credenciales:", credentials);
    
    // Usar JSON en lugar de FormData para el backend Node.js
    const response = await apiClient.post('/auth/login', {
      phone: credentials.phone,
      password: credentials.password
    });
    
    console.log("Respuesta de login:", response.data);
    
    // Guardar token - puede venir directamente o en un objeto token
    const token = response.data.access_token || response.data.token;
    if (!token) {
      console.error("No se encontró token en la respuesta:", response.data);
      throw new Error("No se recibió un token válido");
    }
    
    localStorage.setItem('token', token);
    
    // Intentar primero con el endpoint alternativo para debug
    try {
      console.log("Intentando obtener perfil con token como parámetro");
      const profileResponse = await apiClient.get(`/users/profile-by-token?token=${token}`);
      const userData = profileResponse.data;
      console.log("Perfil obtenido:", userData);
      return {
        ...userData,
        token
      };
    } catch (profileAltError) {
      console.warn("Error en endpoint alternativo, intentando endpoint estándar");
      
      // Si falla, intentar el endpoint estándar
      try {
        const userResponse = await apiClient.get('/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("Perfil obtenido con endpoint estándar:", userResponse.data);
        return {
          ...userResponse.data,
          token
        };
      } catch (profileError) {
        console.error("Error obteniendo perfil:", profileError);
        
        // Crear usuario básico basado en los datos disponibles
        return {
          id: 'temp-id',
          name: 'Usuario',
          phone: credentials.phone,
          quizCompleted: false,
          token
        };
      }
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const registerUser = async (data: RegisterData): Promise<User> => {
  try {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    throw error;
  }
};

export const updateQuizStatus = async (quizResponses: { 
  questionId: string;
  questionText: string;
  selectedOptionId: string;
  selectedOptionText: string;
}[]) => {
  try {
    const response = await fetch(`${API_URL}/users/quiz-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        completed: true,
        quizResponses
      }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el estado del quiz');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateQuizStatus:', error);
    throw error;
  }
};

export const getFinancialQuiz = async (): Promise<{ id: string, title: string, description: string, questions: QuizQuestion[] }> => {
  try {
    const response = await apiClient.get('/quiz/financial');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo quiz:', error);
    throw error;
  }
};

export const submitQuiz = async (submission: QuizSubmission): Promise<QuizResult> => {
  try {
    const response = await apiClient.post('/quiz/submit', submission);
    return response.data;
  } catch (error) {
    console.error('Error enviando respuestas del quiz:', error);
    throw error;
  }
};

export const getGameProgress = async (): Promise<GameProgress> => {
  try {
    const response = await apiClient.get('/game/progress');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo progreso del juego:', error);
    throw error;
  }
};

export const updateGameProgress = async (data: Partial<GameProgress>): Promise<GameProgress> => {
  try {
    const response = await apiClient.put('/game/progress', data);
    return response.data;
  } catch (error) {
    console.error('Error actualizando progreso del juego:', error);
    throw error;
  }
};

export const getGameMap = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/game/map');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo mapa del juego:', error);
    throw error;
  }
};

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await apiClient.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await apiClient.put(`/notifications/${notificationId}`, { read: true });
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    throw error;
  }
}; 