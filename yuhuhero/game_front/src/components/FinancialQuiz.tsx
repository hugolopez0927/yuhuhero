import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { toast } from 'react-toastify';
import { getFinancialQuiz, submitQuiz, QuizQuestion, getUserProfile, updateQuizStatus } from '../services/api';
import { useGameStore } from '../store/useGameStore';

const FinancialQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { addCoins } = useGameStore();
  
  const [quizData, setQuizData] = useState<{
    id: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
  } | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    correct_answers: number;
    total_questions: number;
    score: number;
    passed: boolean;
    rewards: number;
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<{ [key: string]: boolean }>({});
  const [showHint, setShowHint] = useState(false);
  
  // Nuevos estados para la pantalla de introducción
  const [showIntro, setShowIntro] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(true);
  
  // Nuevo estado para la pantalla de preparación del plan personalizado
  const [showPlanPreparation, setShowPlanPreparation] = useState(false);
  const [planProgress, setPlanProgress] = useState(0);
  const [planReady, setPlanReady] = useState(false);
  
  // Añadir estado para identificar si es el quiz inicial
  const [isInitialQuiz, setIsInitialQuiz] = useState(true);
  
  // Estado para el prompt de instalación de PWA
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Capturar el evento beforeinstallprompt para usarlo más tarde
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que Chrome muestre el prompt automáticamente
      e.preventDefault();
      // Guardar el evento para usarlo más tarde
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Obtener el quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        
        // Verificar si el usuario ha completado el quiz
        const user = await getUserProfile();
        setQuizCompleted(user.quizCompleted);
        
        // Si no ha completado el quiz, mostrar la introducción
        if (!user.quizCompleted) {
          setShowIntro(true);
          setIsInitialQuiz(true); // Marcar como quiz inicial
          
          // Simular carga para la barra de progreso
          const interval = setInterval(() => {
            setLoadingProgress(prev => {
              if (prev >= 100) {
                clearInterval(interval);
                setIntroDone(true);
                return 100;
              }
              return prev + 1;
            });
          }, 30);
          
          // No cargar los datos del quiz todavía, esperaremos el clic en el botón
          setLoading(false);
          return;
        } else {
          // Si el usuario ya completó el quiz anteriormente, cargar los datos inmediatamente
          const data = await getFinancialQuiz();
          
          // Sobrescribir con nuestras preguntas personalizadas si el backend no las proporciona
          if (data && data.questions) {
            // Verificar si debemos modificar las preguntas
            const customQuestions = [
              {
                id: "q1",
                question: "¿Para qué te gustaría usar la aplicación?",
                options: [
                  { id: "q1_a", text: "Que me alcance mi sueldo" },
                  { id: "q1_b", text: "Ahorrar algo, aunque sea poco" },
                  { id: "q1_c", text: "Pagar mis deudas" },
                  { id: "q1_d", text: "Entenderle mejor a mis gastos" },
                  { id: "q1_e", text: "No lo tengo claro aún" }
                ],
                correct_option_id: "q1_c", // En este caso todas son válidas, pero ponemos una por defecto
                explanation: "¡Excelente! Todas son metas válidas. Nosotros te ayudaremos a lograr tu objetivo."
              },
              {
                id: "q2",
                question: "¿Qué tanto sabes de finanzas personales?",
                options: [
                  { id: "q2_a", text: "No sé nada de finanzas" },
                  { id: "q2_b", text: "Sé que los intereses altos me hacen pagar más" },
                  { id: "q2_c", text: "Conozco el detalle de mis deudas" },
                  { id: "q2_d", text: "Tengo controladas mis deudas" },
                  { id: "q2_e", text: "Tengo un presupuesto" },
                  { id: "q2_f", text: "Tengo un fondo de dinero para una emergencia" }
                ],
                correct_option_id: "q2_f", // La opción más avanzada, pero todas son válidas
                explanation: "Perfecto. Identificar tu nivel de conocimiento nos ayuda a personalizarte mejor la experiencia."
              },
              {
                id: "q3",
                question: "¿Estado civil?",
                options: [
                  { id: "q3_a", text: "Casado" },
                  { id: "q3_b", text: "Soltero" },
                  { id: "q3_c", text: "Vivo con mi pareja" }
                ],
                correct_option_id: "q3_a", // Cualquiera es válida
                explanation: "Gracias. Esto nos ayuda a entender mejor tu situación financiera."
              },
              {
                id: "q4",
                question: "¿Cuántas personas viven en tu casa?",
                options: [
                  { id: "q4_a", text: "1" },
                  { id: "q4_b", text: "2" },
                  { id: "q4_c", text: "3" },
                  { id: "q4_d", text: "5" },
                  { id: "q4_e", text: "+5" }
                ],
                correct_option_id: "q4_a", // Cualquiera es válida
                explanation: "Gracias. El número de personas en tu hogar afecta tu presupuesto y planificación financiera."
              },
              {
                id: "q5",
                question: "¿Te gustaría que te recordemos que continúes y sigas mejorando?",
                options: [
                  { id: "q5_a", text: "Sí, quiero recibir recordatorios" },
                  { id: "q5_b", text: "No, prefiero no recibir notificaciones" }
                ],
                correct_option_id: "q5_a", // Ambas son válidas
                explanation: "¡Perfecto! Tu preferencia ha sido registrada."
              },
              {
                id: "q6",
                question: "¿Te gustaría instalar la app en tu teléfono? Es totalmente seguro.",
                options: [
                  { id: "q6_a", text: "Sí, quiero instalar la app" },
                  { id: "q6_b", text: "No, prefiero usar la versión web" }
                ],
                correct_option_id: "q6_a", // Ambas son válidas
                explanation: "¡Gracias por tu respuesta! Personalizaremos tu experiencia según tu preferencia."
              }
            ];
            
            // Reemplazar las preguntas del backend con las nuestras
            data.questions = customQuestions;
          }
          
          setQuizData(data);
          
          // Mostrar mensaje de bienvenida para usuarios que ya completaron el quiz
          toast.info('¡Bienvenido de nuevo! Sigue mejorando tus conocimientos financieros', {
            autoClose: 5000,
            position: "top-center"
          });
        }
      } catch (error) {
        console.error('Error cargando quiz:', error);
        toast.error('No se pudo cargar el quiz. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, []);
  
  // Manejar selección de opción y verificar si es correcta
  const handleSelectOption = (questionId: string, optionId: string) => {
    // Si ya verificó la respuesta, no permitir cambiarla
    if (answeredQuestions[questionId]) return;

    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
    
    // Verificar automáticamente la respuesta cuando se selecciona una opción
    checkAnswer(questionId, optionId);
  };

  // Verificar si la respuesta seleccionada es correcta
  const checkAnswer = (questionId: string, optionId: string) => {
    if (!quizData) return;

    // Marcar pregunta como respondida
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  // Verificar si una opción es correcta
  const isCorrectOption = (questionId: string, optionId: string) => {
    if (!quizData || !answeredQuestions[questionId]) return false;
    
    const question = quizData.questions.find(q => q.id === questionId);
    
    // Para nuestras preguntas personalizadas, todas las respuestas son válidas
    if (question && (question.id.startsWith('q1') || question.id.startsWith('q2') || 
        question.id.startsWith('q3') || question.id.startsWith('q4') || question.id.startsWith('q5') ||
        question.id.startsWith('q6'))) {
      return selectedOptions[questionId] === optionId;
    }
    
    // Para otras preguntas, verificar la respuesta correcta normalmente
    return question?.correct_option_id === optionId;
  };

  // Verificar si una opción es incorrecta
  const isIncorrectOption = (questionId: string, optionId: string) => {
    if (!quizData || !answeredQuestions[questionId]) return false;
    
    const question = quizData.questions.find(q => q.id === questionId);
    
    // Para nuestras preguntas personalizadas, ninguna respuesta es incorrecta
    if (question && (question.id.startsWith('q1') || question.id.startsWith('q2') || 
        question.id.startsWith('q3') || question.id.startsWith('q4'))) {
      return false;
    }
    
    return selectedOptions[questionId] === optionId && !isCorrectOption(questionId, optionId);
  };

  // Obtener la explicación de la respuesta - restaurar la versión original
  const getExplanation = (questionId: string) => {
    if (!quizData || !answeredQuestions[questionId]) return null;
    
    const question = quizData.questions.find(q => q.id === questionId);
    
    // Para preguntas personalizadas, proporcionar feedback específico basado en la respuesta
    if (question) {
      if (question.id.startsWith('q1')) {
        const selectedOption = question.options.find(o => o.id === selectedOptions[questionId]);
        if (selectedOption) {
          if (selectedOption.id === 'q1_a') {
            return "Te ayudaremos a que tu sueldo te rinda más.";
          } else if (selectedOption.id === 'q1_b') {
            return "Te ayudaremos a crear un plan de ahorro efectivo.";
          } else if (selectedOption.id === 'q1_c') {
            return "Te guiaremos para salir de deudas eficientemente.";
          } else if (selectedOption.id === 'q1_d') {
            return "Entender tus gastos es el primer paso para controlar tus finanzas.";
          } else {
            return "Juntos descubriremos el mejor camino para mejorar tus finanzas.";
          }
        }
      } else if (question.id.startsWith('q2')) {
        const selectedOption = question.options.find(o => o.id === selectedOptions[questionId]);
        if (selectedOption) {
          if (selectedOption.id === 'q2_a') {
            return "Te acompañaremos en este proceso de aprendizaje.";
          } else if (selectedOption.id === 'q2_b') {
            return "Construiremos sobre esta base.";
          } else if (selectedOption.id === 'q2_c') {
            return "Te ayudaremos a optimizar el pago de tus deudas.";
          } else if (selectedOption.id === 'q2_d') {
            return "Te mostraremos cómo optimizar aún más tu situación.";
          } else if (selectedOption.id === 'q2_e') {
            return "Vamos a perfeccionar tu presupuesto.";
          } else {
            return "Seguiremos construyendo sobre tu disciplina financiera.";
          }
        }
      } else if (question.id.startsWith('q3')) {
        return "Esta información nos ayuda a personalizar tu experiencia.";
      } else if (question.id.startsWith('q4')) {
        return "Lo tendremos en cuenta para tu plan financiero.";
      } else if (question.id.startsWith('q5')) {
        const selectedOption = question.options.find(o => o.id === selectedOptions[questionId]);
        if (selectedOption) {
          if (selectedOption.id === 'q5_a') {
            // Si el usuario eligió recibir notificaciones, solicitar permiso
            setTimeout(() => {
              requestNotificationPermission();
            }, 1000);
            return "Te enviaremos recordatorios para mejorar tus finanzas.";
          } else {
            return "Puedes cambiar esta preferencia más adelante en tu perfil.";
          }
        }
      } else if (question.id.startsWith('q6')) {
        const selectedOption = question.options.find(o => o.id === selectedOptions[questionId]);
        if (selectedOption) {
          if (selectedOption.id === 'q6_a') {
            // Si el usuario eligió instalar la app, mostrar el prompt de instalación
            setTimeout(() => {
              promptInstallPWA();
            }, 1000);
            return "Te mostraremos cómo instalar nuestra app.";
          } else {
            return "La opción de instalar estará disponible en el menú cuando lo desees.";
          }
        }
      }
    }
    
    return question?.explanation || "No hay explicación disponible.";
  };

  // Función para solicitar permiso de notificaciones
  const requestNotificationPermission = async () => {
    try {
      // Verificar si el navegador soporta notificaciones
      if (!("Notification" in window)) {
        toast.info("Tu navegador no soporta notificaciones push", {
          position: "top-center"
        });
        return;
      }
      
      // Verificar si ya se tiene permiso
      if (Notification.permission === "granted") {
        toast.success("¡Ya tienes notificaciones activadas!", {
          position: "top-center"
        });
        return;
      }
      
      // Si no se ha denegado permiso, solicitarlo
      if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        
        if (permission === "granted") {
          // Enviar una notificación de prueba
          const notification = new Notification("¡YuhuHero te saluda!", {
            body: "Te enviaremos recordatorios para mejorar tus finanzas personales.",
            icon: "/favicon.ico" // Asegúrate de que este archivo exista
          });
          
          toast.success("¡Notificaciones activadas correctamente!", {
            position: "top-center"
          });
        } else {
          toast.info("Notificaciones rechazadas. Puedes activarlas más tarde desde tu perfil.", {
            position: "top-center"
          });
        }
      }
    } catch (error) {
      console.error("Error al solicitar permisos de notificación:", error);
      toast.error("Ocurrió un error al activar las notificaciones", {
        position: "top-center"
      });
    }
  };

  // Función para mostrar el prompt de instalación de PWA
  const promptInstallPWA = async () => {
    try {
      // Verificar si tenemos el prompt guardado
      if (!deferredPrompt) {
        toast.info("Tu dispositivo ya tiene la app instalada o no es compatible con la instalación", {
          position: "top-center"
        });
        return;
      }
      
      // Mostrar el prompt
      deferredPrompt.prompt();
      
      // Esperar a que el usuario responda al prompt
      const choiceResult = await deferredPrompt.userChoice;
      
      // Limpiar el prompt guardado
      setDeferredPrompt(null);
      
      if (choiceResult.outcome === 'accepted') {
        toast.success("¡Genial! La app se está instalando en tu dispositivo", {
          position: "top-center"
        });
      } else {
        toast.info("Puedes instalar la app más tarde desde el menú de tu navegador", {
          position: "top-center"
        });
      }
    } catch (error) {
      console.error("Error al mostrar el prompt de instalación:", error);
      toast.error("Ocurrió un error al intentar instalar la app", {
        position: "top-center"
      });
    }
  };

  // Pasar a la siguiente pregunta
  const goToNextQuestion = () => {
    if (currentQuestionIndex < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowHint(false);
    } else if (Object.keys(answeredQuestions).length === quizData?.questions.length) {
      // Si todas las preguntas están respondidas y estamos en la última, enviar automáticamente
      handleSubmitQuiz();
    }
  };

  // Pasar a la pregunta anterior
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowHint(false);
    }
  };

  // Mostrar pista para la pregunta actual
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  // Enviar respuestas
  const handleSubmitQuiz = async () => {
    if (!quizData) return;
    
    // Verificar si todas las preguntas están respondidas
    const answeredCount = Object.keys(selectedOptions).length;
    if (answeredCount < quizData.questions.length) {
      toast.warn(`Has respondido ${answeredCount} de ${quizData.questions.length} preguntas. Por favor, responde todas.`);
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Formatear respuestas para enviar
      const answers = quizData.questions.map((question) => ({
        question_id: question.id,
        selected_option_id: selectedOptions[question.id]
      }));
      
      // Enviar respuestas
      const quizResult = await submitQuiz({
        quiz_id: quizData.id,
        answers
      });
      
      // Mostrar pantalla de preparación del plan en lugar de mostrar resultados directamente
      setShowPlanPreparation(true);
      
      // Simular el progreso de la preparación del plan durante 9 segundos
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        setPlanProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setPlanReady(true);
        }
      }, 90); // 9 segundos en total (90ms * 100 steps)
      
      // Guardar el resultado para mostrarlo después
      setResult(quizResult);
      
      // Si pasó el quiz, preparar el confetti para cuando se muestre el resultado
      if (quizResult.passed) {
        // El confetti se mostrará cuando se muestre el resultado
        
        // Si hay recompensas, añadirlas
        if (quizResult.rewards > 0) {
          addCoins(quizResult.rewards);
        }
      }
    } catch (error) {
      console.error('Error enviando respuestas:', error);
      toast.error('Error al enviar tus respuestas. Intenta de nuevo.');
      setSubmitting(false);
    }
  };

  // Reiniciar quiz
  const handleReset = () => {
    setSelectedOptions({});
    setCurrentQuestionIndex(0);
    setResult(null);
    setShowConfetti(false);
    setAnsweredQuestions({});
    setShowHint(false);
  };
  
  // Pantalla de introducción para nuevos usuarios
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center px-4">
        <motion.div 
          className="max-w-md w-full bg-blue-800 bg-opacity-20 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-blue-700 border-opacity-30 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          {/* Icono o logo */}
          <div className="flex justify-center mb-6">
            <motion.div 
              className="w-20 h-20 bg-blue-700 bg-opacity-50 rounded-full flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <span className="text-4xl">💰</span>
            </motion.div>
          </div>
          
          {/* Título */}
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-6">
            Bienvenido a tu viaje financiero
          </h2>
          
          {/* Mensajes */}
          <div className="space-y-4 mb-8">
            <motion.p 
              className="text-blue-100 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Este juego es para ayudarte a tener tu lana más ordenada. Sin enredos. Sin juicio. Tú mandas.
            </motion.p>
            
            <motion.p 
              className="text-blue-100 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Todo lo que pongas, se queda entre nosotros.
            </motion.p>
          </div>
          
          {/* Barra de progreso */}
          <div className="mb-6">
            <div className="h-2 w-full bg-blue-900 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${introDone ? 'bg-green-500' : 'bg-blue-400'}`}
                initial={{ width: "0%" }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-blue-200 text-center mt-2">
              {introDone ? 'Listo para comenzar' : 'Preparando todo...'}
            </p>
          </div>
          
          {/* Botón para continuar */}
          {introDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.button
                onClick={async (e: React.MouseEvent) => {
                  // Efecto de pulsación
                  const button = e.currentTarget;
                  
                  // Crear efecto de flash
                  const container = document.querySelector('.min-h-screen');
                  if (container) {
                    const flash = document.createElement('div');
                    flash.style.position = 'fixed';
                    flash.style.top = '0';
                    flash.style.left = '0';
                    flash.style.width = '100%';
                    flash.style.height = '100%';
                    flash.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    flash.style.zIndex = '9999';
                    flash.style.pointerEvents = 'none';
                    container.appendChild(flash);
                    
                    // Desvanecer
                    setTimeout(() => {
                      flash.style.transition = 'opacity 0.4s ease';
                      flash.style.opacity = '0';
                      setTimeout(() => {
                        if (flash.parentNode) {
                          container.removeChild(flash);
                        }
                      }, 400);
                    }, 50);
                  }
                  
                  // Cargar datos
                  setLoading(true);
                  try {
                    // Cargar los datos del quiz solo cuando el usuario da clic en continuar
                    const data = await getFinancialQuiz();
                    
                    // Sobrescribir con nuestras preguntas personalizadas
                    if (data && data.questions) {
                      // Verificar si debemos modificar las preguntas
                      const customQuestions = [
                        {
                          id: "q1",
                          question: "¿Para qué te gustaría usar la aplicación?",
                          options: [
                            { id: "q1_a", text: "Que me alcance mi sueldo" },
                            { id: "q1_b", text: "Ahorrar algo, aunque sea poco" },
                            { id: "q1_c", text: "Pagar mis deudas" },
                            { id: "q1_d", text: "Entenderle mejor a mis gastos" },
                            { id: "q1_e", text: "No lo tengo claro aún" }
                          ],
                          correct_option_id: "q1_c", // En este caso todas son válidas, pero ponemos una por defecto
                          explanation: "¡Excelente! Todas son metas válidas. Nosotros te ayudaremos a lograr tu objetivo."
                        },
                        {
                          id: "q2",
                          question: "¿Qué tanto sabes de finanzas personales?",
                          options: [
                            { id: "q2_a", text: "No sé nada de finanzas" },
                            { id: "q2_b", text: "Sé que los intereses altos me hacen pagar más" },
                            { id: "q2_c", text: "Conozco el detalle de mis deudas" },
                            { id: "q2_d", text: "Tengo controladas mis deudas" },
                            { id: "q2_e", text: "Tengo un presupuesto" },
                            { id: "q2_f", text: "Tengo un fondo de dinero para una emergencia" }
                          ],
                          correct_option_id: "q2_f", // La opción más avanzada, pero todas son válidas
                          explanation: "Perfecto. Identificar tu nivel de conocimiento nos ayuda a personalizarte mejor la experiencia."
                        },
                        {
                          id: "q3",
                          question: "¿Estado civil?",
                          options: [
                            { id: "q3_a", text: "Casado" },
                            { id: "q3_b", text: "Soltero" },
                            { id: "q3_c", text: "Vivo con mi pareja" }
                          ],
                          correct_option_id: "q3_a", // Cualquiera es válida
                          explanation: "Gracias. Esto nos ayuda a entender mejor tu situación financiera."
                        },
                        {
                          id: "q4",
                          question: "¿Cuántas personas viven en tu casa?",
                          options: [
                            { id: "q4_a", text: "1" },
                            { id: "q4_b", text: "2" },
                            { id: "q4_c", text: "3" },
                            { id: "q4_d", text: "5" },
                            { id: "q4_e", text: "+5" }
                          ],
                          correct_option_id: "q4_a", // Cualquiera es válida
                          explanation: "Gracias. El número de personas en tu hogar afecta tu presupuesto y planificación financiera."
                        },
                        {
                          id: "q5",
                          question: "¿Te gustaría que te recordemos que continúes y sigas mejorando?",
                          options: [
                            { id: "q5_a", text: "Sí, quiero recibir recordatorios" },
                            { id: "q5_b", text: "No, prefiero no recibir notificaciones" }
                          ],
                          correct_option_id: "q5_a", // Ambas son válidas
                          explanation: "¡Perfecto! Tu preferencia ha sido registrada."
                        },
                        {
                          id: "q6",
                          question: "¿Te gustaría instalar la app en tu teléfono? Es totalmente seguro.",
                          options: [
                            { id: "q6_a", text: "Sí, quiero instalar la app" },
                            { id: "q6_b", text: "No, prefiero usar la versión web" }
                          ],
                          correct_option_id: "q6_a", // Ambas son válidas
                          explanation: "¡Gracias por tu respuesta! Personalizaremos tu experiencia según tu preferencia."
                        }
                      ];
                      
                      // Reemplazar las preguntas del backend con las nuestras
                      data.questions = customQuestions;
                    }
                    
                    setQuizData(data);
                    setShowIntro(false);
                  } catch (error) {
                    console.error('Error cargando quiz:', error);
                    toast.error('No se pudo cargar el quiz. Por favor, intenta de nuevo.');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium shadow-md flex items-center justify-center relative overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97, backgroundColor: "#22c55e" }}
                transition={{ duration: 0.2 }}
              >
                <span className="mr-2">✓</span>
                <span className="relative z-10">Presionar para continuar</span>
                
                {/* Efecto de brillo al presionar */}
                <motion.span 
                  className="absolute w-full h-full top-0 left-0 bg-white opacity-0 pointer-events-none"
                  whileTap={{ 
                    opacity: [0, 0.2, 0],
                    transition: { duration: 0.3 }
                  }}
                />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // Mostrar loader animado mientras carga
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500"
      >
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
            }}
            className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full mx-auto"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-xl font-medium text-blue-800"
          >
            Preparando tu quiz financiero...
          </motion.p>
          <motion.div
            className="max-w-xs mx-auto mt-4 h-2 bg-blue-100 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-blue-400"
              initial={{ width: "0%" }}
              animate={{ 
                width: "100%", 
                transition: { duration: 2, repeat: Infinity }
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Si no hay datos del quiz
  if (!quizData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-6"
          >
            😔
          </motion.div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            No se pudo cargar el quiz
          </h2>
          <p className="text-gray-700 mb-6">
            Hubo un problema al cargar las preguntas. Por favor, intenta más tarde.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition duration-200"
          >
            Volver al inicio
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Pantalla de preparación del plan financiero personalizado
  if (showPlanPreparation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { repeat: Infinity, duration: 2, ease: "linear" },
              scale: { repeat: Infinity, duration: 1.5, repeatType: "reverse" }
            }}
            className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
          >
            <span className="text-4xl">🧮</span>
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Estamos preparando un plan diseñado para ti
          </h2>
          
          <p className="text-gray-600 mb-8">
            Analizando tus respuestas para crear una estrategia personalizada...
          </p>
          
          {/* Barra de progreso */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${planProgress}%` }}
              className={`h-full ${planProgress < 30 ? 'bg-blue-500' : planProgress < 60 ? 'bg-blue-400' : planProgress < 90 ? 'bg-green-400' : 'bg-green-500'}`}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <p className="text-sm text-gray-500 mb-8">
            {planProgress < 100 ? `${planProgress}% completado` : 'Plan listo'}
          </p>
          
          {planReady && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={async () => {
                try {
                  // Preparar las respuestas del usuario para guardarlas
                  const userResponses = Object.entries(selectedOptions).map(([questionId, optionId]) => {
                    // Buscar la pregunta y la opción seleccionada
                    const question = quizData?.questions.find(q => q.id === questionId);
                    const option = question?.options.find(o => o.id === optionId);
                    
                    return {
                      questionId,
                      questionText: question?.question || '',
                      selectedOptionId: optionId,
                      selectedOptionText: option?.text || '',
                    };
                  });
                  
                  // Actualizar el estado del quiz y guardar las respuestas
                  await updateQuizStatus(userResponses);
                  
                  // Mostrar mensaje de éxito
                  toast.success('¡Tus respuestas han sido guardadas!', {
                    position: "top-center",
                    autoClose: 2000
                  });
                  
                  // Si hay recompensas, añadirlas antes de redirigir
                  if (result && result.rewards && result.rewards > 0) {
                    addCoins(result.rewards);
                  }
                  
                  // Ir directamente a home
                  navigate('/home');
                } catch (error) {
                  console.error('Error al guardar las respuestas:', error);
                  toast.error('Hubo un problema al guardar tus respuestas');
                  
                  // Aún así, redirigir al home
                  navigate('/home');
                }
              }}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="mr-2">🚀</span>
              Inicia tu camino a la libertad de deudas
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  // Mostrar resultados
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 py-8 px-4 flex items-center justify-center">
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, 0] }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-6"
            >
              <span className="text-4xl">{result.passed ? '🏆' : '📚'}</span>
            </motion.div>
            
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Resultados del Quiz
            </h2>
            
            <div className="text-center mb-8">
              <motion.div 
                animate={{ 
                  scale: result.passed ? [1, 1.2, 1] : 1, 
                  rotate: result.passed ? [0, 5, -5, 0] : 0 
                }}
                transition={{ duration: 1, repeat: result.passed ? 3 : 0 }}
                className={`text-5xl mb-4 ${result.passed ? 'text-green-500' : 'text-blue-500'}`}
              >
                {result.passed ? '🎉' : '🔍'}
              </motion.div>
              
              <h3 className={`text-xl font-bold ${result.passed ? 'text-green-600' : 'text-blue-600'}`}>
                {result.passed 
                  ? '¡Felicidades, has aprobado!' 
                  : 'Sigue aprendiendo'}
              </h3>
              
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  Respondiste correctamente 
                  <span className="font-bold text-blue-600"> {result.correct_answers} </span> 
                  de 
                  <span className="font-bold"> {result.total_questions} </span> 
                  preguntas
                </p>
              </div>
              
              <div className="my-6">
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  Tu puntuación: {result.score.toFixed(0)}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-3 rounded-full ${
                      result.score >= 80 ? 'bg-green-500' : 
                      result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
              
              {result.rewards > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 bg-yellow-100 text-yellow-800 p-4 rounded-lg flex items-center justify-center space-x-2"
                >
                  <motion.span 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-xl"
                  >
                    ✨
                  </motion.span>
                  <span className="font-medium">Has ganado {result.rewards} monedas</span>
                </motion.div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleReset}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-200 flex items-center justify-center"
              >
                <span className="mr-2">🔄</span>
                Intentar de nuevo
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/home')}
                className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition duration-200 flex items-center justify-center"
              >
                <span className="mr-2">🗺️</span>
                Volver al mapa
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Pregunta actual
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isCurrentQuestionAnswered = currentQuestion ? answeredQuestions[currentQuestion.id] : false;
  const totalQuestions = quizData.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 py-8 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Tarjeta del quiz */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Encabezado */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative">
            <div className="absolute top-2 right-2 text-xs bg-white bg-opacity-20 rounded-lg px-2 py-1">
              {currentQuestionIndex + 1} / {totalQuestions}
            </div>
            
            <h2 className="text-xl font-bold">{quizData.title}</h2>
            <p className="text-blue-100 text-sm mt-1">{quizData.description}</p>
            
            {/* Progreso - más visual y animado */}
            <div className="mt-6 relative h-3 bg-blue-800 bg-opacity-40 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full"
              />
              
              {/* Puntos de progreso para cada pregunta */}
              <div className="absolute top-0 left-0 h-full w-full flex justify-between px-1">
                {[...Array(totalQuestions)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-3 w-3 rounded-full -mt-0.5 ${
                      i < currentQuestionIndex
                        ? 'bg-green-500'
                        : i === currentQuestionIndex
                        ? 'bg-white'
                        : 'bg-blue-300 bg-opacity-40'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Contenido de la pregunta */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">
                    {currentQuestionIndex + 1}
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {currentQuestion.question}
                  </h3>
                </div>
                
                {/* Opciones - nuevo diseño más claro y visualmente atractivo */}
                <div className="space-y-3 mt-6">
                  {currentQuestion.options.map((option) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: option.id.split('_')[1] === 'a' ? 0.1 : option.id.split('_')[1] === 'b' ? 0.2 : option.id.split('_')[1] === 'c' ? 0.3 : 0.4 }}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                        selectedOptions[currentQuestion.id] === option.id && !isCurrentQuestionAnswered
                          ? 'bg-blue-50 border-blue-500 shadow-md'
                          : isCorrectOption(currentQuestion.id, option.id)
                          ? 'bg-green-50 border-green-500 shadow-md'
                          : isIncorrectOption(currentQuestion.id, option.id)
                          ? 'bg-red-50 border-red-500 shadow-md'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                      whileHover={{ scale: isCurrentQuestionAnswered ? 1 : 1.02 }}
                      whileTap={{ scale: isCurrentQuestionAnswered ? 1 : 0.98 }}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-3 ${
                          selectedOptions[currentQuestion.id] === option.id && !isCurrentQuestionAnswered
                            ? 'bg-blue-100 text-blue-600'
                            : isCorrectOption(currentQuestion.id, option.id)
                            ? 'bg-green-100 text-green-600'
                            : isIncorrectOption(currentQuestion.id, option.id)
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {option.id.includes('_') ? option.id.split('_')[1].toUpperCase() : 
                            (typeof option.id === 'string' ? option.id.charAt(0).toUpperCase() : 'A')}
                        </div>
                        <span className={`text-base ${
                          isCorrectOption(currentQuestion.id, option.id)
                            ? 'text-green-700 font-medium'
                            : isIncorrectOption(currentQuestion.id, option.id)
                            ? 'text-red-700'
                            : 'text-gray-700'
                        }`}>
                          {option.text}
                        </span>
                        
                        {/* Iconos de feedback */}
                        {isCorrectOption(currentQuestion.id, option.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto text-green-500 text-xl"
                          >
                            ✓
                          </motion.div>
                        )}
                        
                        {isIncorrectOption(currentQuestion.id, option.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto text-red-500 text-xl"
                          >
                            ✗
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {isCurrentQuestionAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 overflow-hidden"
                >
                  {/* Para el quiz inicial, no mostrar el contenedor de explicación pero ejecutar getExplanation para mantener la funcionalidad */}
                  {!isInitialQuiz && (
                    <div className={`p-4 rounded-xl ${
                      currentQuestion.id.startsWith('q') ? 'bg-green-50 border-2 border-green-200' :
                      isCorrectOption(currentQuestion.id, selectedOptions[currentQuestion.id])
                        ? 'bg-green-50 border-2 border-green-200'
                        : 'bg-blue-50 border-2 border-blue-200'
                    }`}>
                      <div className="flex items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3 ${
                          currentQuestion.id.startsWith('q') ? 'bg-green-100 text-green-600' :
                          isCorrectOption(currentQuestion.id, selectedOptions[currentQuestion.id])
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {currentQuestion.id.startsWith('q') || isCorrectOption(currentQuestion.id, selectedOptions[currentQuestion.id]) ? '✓' : 'ℹ️'}
                        </div>
                        <div>
                          <h4 className={`font-medium mb-1 ${
                            currentQuestion.id.startsWith('q') ? 'text-green-700' :
                            isCorrectOption(currentQuestion.id, selectedOptions[currentQuestion.id])
                              ? 'text-green-700'
                              : 'text-blue-700'
                          }`}>
                            {currentQuestion.id.startsWith('q') ? '' :
                             isCorrectOption(currentQuestion.id, selectedOptions[currentQuestion.id])
                              ? '¡Correcto!'
                              : 'Aprendamos más'}
                          </h4>
                          <p className="text-gray-700">{getExplanation(currentQuestion.id)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Si es el quiz inicial, ejecutar getExplanation para activar las funcionalidades pero sin mostrar UI */}
                  {isInitialQuiz && getExplanation(currentQuestion.id)}
                  
                  {/* Botón para continuar a la siguiente pregunta */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    onClick={goToNextQuestion}
                    className={`w-full mt-4 py-3 rounded-lg font-medium shadow-md flex items-center justify-center ${
                      currentQuestionIndex === quizData.questions.length - 1
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {currentQuestionIndex === quizData.questions.length - 1 ? (
                      <>
                        Finalizar quiz <span className="ml-2">✓</span>
                      </>
                    ) : (
                      <>
                        Continuar <span className="ml-2">→</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialQuiz;