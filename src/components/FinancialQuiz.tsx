import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { updateQuizStatus } from '../services/api';
import IntroScreen from './IntroScreen';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const FinancialQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showIntro, setShowIntro] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [animateOption, setAnimateOption] = useState<number | null>(null);
  const [mountTime] = useState<string>(new Date().toISOString());
  const [isTestUser, setIsTestUser] = useState(false);

  // Verificación del token y estado del quiz al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const quizCompletedState = localStorage.getItem('quizCompleted') === 'true';
    
    // Verificar si es usuario de prueba
    const userPhone = localStorage.getItem('userPhone');
    const userName = localStorage.getItem('userName');
    const testUser = userName === 'Hugol' || userPhone === '0987654321';
    setIsTestUser(testUser);
    
    console.log("FinancialQuiz - Montaje:", { 
      time: mountTime,
      token: !!token, 
      quizCompleted: quizCompletedState,
      currentPath: window.location.pathname,
      showIntro: showIntro,
      isTestUser: testUser
    });
    
    if (!token) {
      console.log("No hay token, redirigiendo a login");
      navigate('/login', { replace: true });
      return;
    }
    
    if (quizCompletedState) {
      console.log("Quiz ya completado, redirigiendo a home");
      navigate('/home', { replace: true });
    }
  }, [navigate, mountTime]);

  // Efecto para detectar cambios en showIntro
  useEffect(() => {
    console.log("Estado de showIntro cambiado a:", showIntro);
  }, [showIntro]);

  // Efecto para la navegación automática después de completar el quiz
  useEffect(() => {
    if (quizCompleted) {
      console.log("Quiz completado, preparando redirección");
      
      // Actualizar el estado del quiz en el backend primero
      const updateQuizInBackend = async () => {
        try {
          console.log("Actualizando estado del quiz en el backend");
          
          // Llamar al API para actualizar el estado en el backend
          const result = await updateQuizStatus(true);
          console.log("Estado del quiz actualizado correctamente en el backend:", result);
          
          // Solo después de actualizar en el backend, actualizamos localStorage
          localStorage.setItem('quizCompleted', 'true');
          
          console.log("Esperando 2 segundos antes de navegar a home...");
          // Después de actualizar, navegar a home
          setTimeout(() => {
            console.log("Navegando a home después de completar quiz");
            navigate('/home', { replace: true });
          }, 2000);
        } catch (error) {
          console.error('Error al actualizar estado del quiz en el backend:', error);
          // Incluso con error, continuamos con la navegación
          localStorage.setItem('quizCompleted', 'true');
          
          // Forzar navegación a home incluso con error
          setTimeout(() => {
            console.log("Navegando a home a pesar del error");
            navigate('/home', { replace: true });
          }, 2000);
        }
      };
      
      updateQuizInBackend();
    }
  }, [quizCompleted, navigate]);

  const questions: Question[] = [
    {
      id: 1,
      text: "¿Qué porcentaje de tus ingresos recomiendan los expertos ahorrar?",
      options: ["5-10%", "10-20%", "30-50%", "Cualquier cantidad está bien"]
    },
    {
      id: 2,
      text: "¿Cuál es la definición de un fondo de emergencia?",
      options: [
        "Dinero para comprar acciones",
        "Dinero guardado para gastos imprevistos",
        "Un préstamo bancario",
        "Una inversión en bienes raíces"
      ]
    },
    {
      id: 3,
      text: "¿Qué tipo de deuda generalmente tiene las tasas de interés más altas?",
      options: [
        "Préstamos estudiantiles",
        "Hipotecas",
        "Tarjetas de crédito",
        "Préstamos personales"
      ]
    },
    {
      id: 4,
      text: "¿Cuál de estas opciones NO es un vehículo de inversión tradicional?",
      options: [
        "Acciones",
        "Bonos",
        "Préstamos a amigos",
        "Fondos de inversión"
      ]
    },
    {
      id: 5,
      text: "¿Qué es el interés compuesto?",
      options: [
        "Impuestos sobre las ganancias de inversiones",
        "Interés solo sobre el capital inicial",
        "Interés sobre el capital más interés acumulado",
        "Una tasa de interés fija"
      ]
    },
    {
      id: 6,
      text: "¿Cuál es una buena práctica al usar tarjetas de crédito?",
      options: [
        "Pagar solo el mínimo cada mes",
        "Pagar el saldo completo cada mes",
        "Tener varias tarjetas para maximizar deuda",
        "Usar más del 90% del límite"
      ]
    },
    {
      id: 7,
      text: "¿Cuál es una estrategia clave para la jubilación?",
      options: [
        "Comenzar a ahorrar lo más tarde posible",
        "Depender únicamente de programas gubernamentales",
        "Comenzar a ahorrar lo más temprano posible",
        "Evitar todos los instrumentos de inversión"
      ]
    }
  ];

  // Función que se llama cuando el usuario inicia el quiz desde IntroScreen
  const startQuiz = () => {
    console.log("startQuiz llamado - cambiando showIntro a false");
    setShowIntro(false);
  };

  // Función para forzar el inicio del quiz (botón de respaldo)
  const forceStartQuiz = () => {
    console.log("Forzando inicio del quiz");
    setShowIntro(false);
    // Reiniciar cualquier estado relacionado
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
  };

  // Función para navegar directamente a home (botón de respaldo)
  const forceGoToHome = () => {
    console.log("Forzando navegación a home");
    localStorage.setItem('quizCompleted', 'true');
    navigate('/home', { replace: true });
  };

  // Función para completar automáticamente el quiz (solo usuario de prueba)
  const autoCompleteQuiz = async () => {
    console.log("Completando automáticamente el quiz para usuario de prueba");
    toast.success("Quiz completado automáticamente");
    
    // Simular respuestas a todas las preguntas
    const answers: { [key: number]: number } = {};
    questions.forEach((_, idx) => {
      answers[idx] = 1; // Seleccionamos la segunda opción como respuesta para todos
    });
    
    setSelectedAnswers(answers);
    
    try {
      // Actualizar en el backend
      await updateQuizStatus(true);
      localStorage.setItem('quizCompleted', 'true');
      
      // Navegar a home después de un breve retraso
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 1000);
    } catch (error) {
      console.error("Error completando automáticamente:", error);
      // Incluso con error, seguimos
      localStorage.setItem('quizCompleted', 'true');
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 1000);
    }
  };

  // Función que maneja cuando el usuario selecciona una respuesta
  const handleAnswer = (optIdx: number) => {
    console.log(`Seleccionada respuesta ${optIdx} para pregunta ${currentQuestionIndex+1}`);
    
    // Guardar la respuesta seleccionada
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: optIdx }));
    setAnimateOption(optIdx);

    // Esperar a que termine la animación
    setTimeout(() => {
      setAnimateOption(null);
      
      if (currentQuestionIndex < questions.length - 1) {
        // Si hay más preguntas, avanzar a la siguiente
        console.log(`Avanzando a pregunta ${currentQuestionIndex+2}`);
        setCurrentQuestionIndex(i => i + 1);
      } else {
        // Si es la última pregunta, marcar como completado
        console.log("Última pregunta respondida, marcando quiz como completado");
        localStorage.setItem('quizCompleted', 'true');
        setQuizCompleted(true);
        
        // Incluso forzar navegación después de un tiempo por seguridad
        setTimeout(() => {
          if (window.location.pathname === '/quiz') {
            console.log("Forzando navegación a home después de espera");
            navigate('/home', { replace: true });
          }
        }, 3000);
      }
    }, 500);
  };

  // Renderizado condicional para IntroScreen
  if (showIntro || quizCompleted) {
    console.log("Renderizando IntroScreen - showIntro:", showIntro, "quizCompleted:", quizCompleted);
    
    return (
      <div>
        <IntroScreen 
          onStart={showIntro ? startQuiz : undefined}
          showStartButton={showIntro} // No mostrar botón en la pantalla de finalización
        />
        
        {/* Botones de respaldo siempre visibles */}
        <div className="fixed bottom-4 right-4 flex flex-col gap-2">
          {/* Botón especial para auto-completar (solo visible para usuario de prueba) */}
          {isTestUser && showIntro && (
            <button 
              onClick={autoCompleteQuiz}
              className="p-2 bg-purple-600 text-white rounded opacity-90 hover:opacity-100 font-bold"
            >
              AutoCompletar Quiz (Hugol)
            </button>
          )}
          
          <button 
            onClick={forceStartQuiz}
            className="p-2 bg-red-500 text-white rounded opacity-80 hover:opacity-100"
          >
            Forzar Inicio Quiz
          </button>
          
          <button 
            onClick={forceGoToHome}
            className="p-2 bg-green-500 text-white rounded opacity-80 hover:opacity-100"
          >
            Ir a Home
          </button>
        </div>
      </div>
    );
  }

  // Quiz en acción
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  console.log("Renderizando preguntas del quiz - pregunta:", currentQuestionIndex + 1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1833] text-white p-4 overflow-hidden">
      {/* Barra de progreso */}
      <div className="w-full max-w-md h-2 bg-gray-700 rounded-full mb-8">
        <motion.div
          className="h-full bg-[#8B5CF6] rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-4 text-lg font-semibold">
        Pregunta {currentQuestionIndex + 1} de {questions.length}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6">
            {questions[currentQuestionIndex].text}
          </h2>
          <div className="space-y-4">
            {questions[currentQuestionIndex].options.map((opt, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleAnswer(idx)}
                animate={animateOption === idx ? { scale: [1,1.05,1] } : {}}
                transition={{ duration: 0.3 }}
                className={`w-full p-4 rounded-xl text-left transition-colors ${
                  selectedAnswers[currentQuestionIndex] === idx
                    ? 'bg-[#8B5CF6]'
                    : 'bg-[#2D2A46] hover:bg-[#3D3A56]'
                }`}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Botón de respaldo - Si hay problemas con los botones de opción */}
      <div className="mt-8">
        <button 
          onClick={() => handleAnswer(0)} 
          className="p-2 bg-orange-500 text-white rounded"
        >
          Botón de Respaldo (Seleccionar primera opción)
        </button>
      </div>
      
      {/* Botones de respaldo adicionales */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        {/* Botón de auto-completar (solo para usuario de prueba) */}
        {isTestUser && (
          <button 
            onClick={autoCompleteQuiz}
            className="p-2 bg-purple-600 text-white rounded opacity-90 hover:opacity-100 font-bold"
          >
            AutoCompletar Quiz (Hugol)
          </button>
        )}
        <button 
          onClick={forceGoToHome}
          className="p-2 bg-green-500 text-white rounded opacity-80 hover:opacity-100"
        >
          Ir a Home
        </button>
      </div>
    </div>
  );
};

export default FinancialQuiz;

