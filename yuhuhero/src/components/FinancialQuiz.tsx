import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [animateOption, setAnimateOption] = useState<number | null>(null);
  
  // Referencias para los reproductores de audio
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const option1SoundRef = useRef<HTMLAudioElement | null>(null);
  const option2SoundRef = useRef<HTMLAudioElement | null>(null);
  const option3SoundRef = useRef<HTMLAudioElement | null>(null);
  const option4SoundRef = useRef<HTMLAudioElement | null>(null);
  const finishSoundRef = useRef<HTMLAudioElement | null>(null);
  const countdownSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Controla la reproducción del audio de fondo
  useEffect(() => {
    if (backgroundMusicRef.current) {
      if (!showIntro) {
        // Iniciar música cuando comienza el quiz
        backgroundMusicRef.current.volume = 0.3;
        backgroundMusicRef.current.loop = true;
        backgroundMusicRef.current.play().catch(error => {
          // Manejar error si el navegador bloquea la reproducción automática
          console.log("Error al reproducir audio:", error);
        });
        
        // Reproducir sonido de cuenta regresiva al iniciar
        if (countdownSoundRef.current) {
          countdownSoundRef.current.play().catch(error => {
            console.log("Error al reproducir audio:", error);
          });
        }
      } else {
        // Pausar música en la pantalla de introducción
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
    }
    
    // Limpieza al desmontar el componente
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
      }
    };
  }, [showIntro]);

  // Preguntas iniciales actualizadas
  const questions: Question[] = [
    {
      id: 1,
      text: "Selecciona la opción que mejor describa tus hábitos de ahorro:",
      options: [
        "No guardo dinero, gasto todo lo que gano", 
        "Ahorro solo cuando me sobra dinero", 
        "Ahorro una cantidad fija cada mes", 
        "Tengo un plan de ahorro y lo cumplo regularmente"
      ]
    },
    {
      id: 2,
      text: "¿Cómo describirías tu conocimiento sobre finanzas personales?",
      options: [
        "No tengo ningún conocimiento sobre finanzas", 
        "Tengo conocimientos básicos", 
        "Entiendo conceptos como interés compuesto y diversificación", 
        "Tengo conocimientos avanzados y aplico estrategias financieras"
      ]
    },
    {
      id: 3,
      text: "¿Tienes un presupuesto mensual?",
      options: [
        "No llevo ningún control de mis gastos", 
        "Tengo una idea aproximada de mis gastos principales", 
        "Tengo un presupuesto básico que a veces sigo", 
        "Sigo un presupuesto detallado y lo reviso regularmente"
      ]
    },
    {
      id: 4,
      text: "¿Cómo manejas tus deudas?",
      options: [
        "Tengo varias deudas y a veces no puedo pagarlas a tiempo", 
        "Pago el mínimo de mis deudas cada mes", 
        "Trato de pagar más del mínimo cuando puedo", 
        "Tengo pocas o ninguna deuda y las pago completamente cada mes"
      ]
    },
    {
      id: 5,
      text: "¿Tienes un fondo de emergencia?",
      options: [
        "No tengo ahorros para emergencias", 
        "Tengo algunos ahorros pero no suficientes para una emergencia real", 
        "Tengo ahorros que cubrirían 1-2 meses de gastos", 
        "Tengo un fondo que cubre 3-6 meses o más de gastos"
      ]
    },
    {
      id: 6,
      text: "¿Cómo planificas para tu futuro financiero?",
      options: [
        "No pienso en mi futuro financiero", 
        "Sé que debería planificar pero no he comenzado", 
        "Tengo algunos planes básicos para mi jubilación", 
        "Tengo un plan claro con metas a corto, mediano y largo plazo"
      ]
    },
    {
      id: 7,
      text: "¿Cómo reaccionas ante gastos inesperados?",
      options: [
        "Uso tarjetas de crédito o pido prestado", 
        "Uso mis ahorros regulares y luego me cuesta recuperarme", 
        "Tengo un pequeño fondo para imprevistos", 
        "Estoy bien preparado con un fondo específico para emergencias"
      ]
    }
  ];

  // Reproducir sonido según la opción seleccionada
  const playOptionSound = (optionIndex: number) => {
    const soundRefs = [option1SoundRef, option2SoundRef, option3SoundRef, option4SoundRef];
    const selectedSound = soundRefs[optionIndex % soundRefs.length];
    
    if (selectedSound.current) {
      selectedSound.current.currentTime = 0;
      selectedSound.current.play().catch(error => {
        console.log("Error al reproducir audio:", error);
      });
    }
  };

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex
    });
    
    // Activar animación para la opción seleccionada
    setAnimateOption(optionIndex);
    
    // Reproducir sonido según la opción seleccionada
    playOptionSound(optionIndex);
    
    // Esperar un momento antes de pasar a la siguiente pregunta
    setTimeout(() => {
      // Resetear la animación
      setAnimateOption(null);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        
        // Reproducir sonido de clic al cambiar de pregunta
        if (clickSoundRef.current) {
          clickSoundRef.current.currentTime = 0;
          clickSoundRef.current.play().catch(error => {
            console.log("Error al reproducir audio:", error);
          });
        }
      } else {
        // Reproducir sonido de finalización
        if (finishSoundRef.current) {
          finishSoundRef.current.play().catch(error => {
            console.log("Error al reproducir audio:", error);
          });
          
          // Pausar música de fondo
          if (backgroundMusicRef.current) {
            backgroundMusicRef.current.pause();
          }
        }
        
        // Cuando se completan todas las preguntas, navegar a la página principal después de escuchar el sonido
        setTimeout(() => {
          navigate('/home');
        }, 2000); // Tiempo suficiente para escuchar el sonido completo
      }
    }, 800); // Tiempo aumentado para disfrutar la animación y el sonido
  };

  // Iniciar el quiz
  const startQuiz = () => {
    // Reproducir sonido al iniciar
    if (clickSoundRef.current) {
      clickSoundRef.current.play().catch(error => {
        console.log("Error al reproducir audio:", error);
      });
    }
    
    setShowIntro(false);
  };

  // Calcular el progreso
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1833] text-white p-4 relative overflow-hidden">
      {/* Archivos de audio */}
      <audio 
        ref={backgroundMusicRef} 
        src="/audio/background-music.mp4" 
        preload="auto"
      />
      <audio 
        ref={clickSoundRef} 
        src="/audio/click.mp3" 
        preload="auto"
      />
      <audio 
        ref={option1SoundRef} 
        src="/audio/option1.mp3" 
        preload="auto"
      />
      <audio 
        ref={option2SoundRef} 
        src="/audio/option2.mp3" 
        preload="auto"
      />
      <audio 
        ref={option3SoundRef} 
        src="/audio/option3.mp3" 
        preload="auto"
      />
      <audio 
        ref={option4SoundRef} 
        src="/audio/option4.mp3" 
        preload="auto"
      />
      <audio 
        ref={finishSoundRef} 
        src="/audio/quiz-complete.mp3" 
        preload="auto"
      />
      <audio 
        ref={countdownSoundRef} 
        src="/audio/countdown.mp3" 
        preload="auto"
      />
      
      {showIntro ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md text-center"
        >
          <h1 className="text-3xl font-bold mb-6">¡Bienvenido al Quiz Financiero!</h1>
          
          <div className="bg-[#2D2A46] p-6 rounded-xl mb-8">
            <p className="text-xl mb-4">
              Aquí lograrás incrementar tu saldo en Yuhudils y ganar recompensas en Productos.
            </p>
            <p className="text-lg mb-4">
              Y todo esto mientras aprendes conceptos financieros importantes para tu futuro.
            </p>
          </div>
          
          <motion.button 
            onClick={startQuiz}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#8B5CF6] hover:bg-[#7C4DEE] text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
          >
            Iniciar este viaje
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Barra de progreso */}
          <div className="w-full max-w-md h-2 bg-gray-700 rounded-full mb-8 z-10">
            <motion.div 
              className="h-full bg-[#8B5CF6] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Contador de preguntas */}
          <div className="mb-4 text-lg font-semibold z-10">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md z-10"
            >
              {/* Pregunta actual */}
              <h2 className="text-2xl font-bold mb-6">
                {questions[currentQuestionIndex].text}
              </h2>
              
              {/* Opciones */}
              <div className="space-y-4">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    initial={{ opacity: 1 }}
                    animate={animateOption === index ? {
                      scale: [1, 1.05, 1],
                      backgroundColor: ['#2D2A46', '#8B5CF6', '#2D2A46'],
                      boxShadow: [
                        '0 0 0 rgba(139, 92, 246, 0)',
                        '0 0 20px rgba(139, 92, 246, 0.8)',
                        '0 0 0 rgba(139, 92, 246, 0)'
                      ]
                    } : {}}
                    transition={{ duration: 0.5 }}
                    className={`w-full p-4 rounded-xl text-left transition-colors relative ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? "bg-[#8B5CF6]"
                        : "bg-[#2D2A46] hover:bg-[#3D3A56]"
                    }`}
                  >
                    {option}
                    
                    {/* Efecto de ondas cuando se selecciona una opción */}
                    {animateOption === index && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ 
                          opacity: [1, 0],
                          scale: [1, 1.5],
                          borderWidth: [3, 0]
                        }}
                        transition={{ duration: 0.8 }}
                        style={{ 
                          border: '3px solid #8B5CF6', 
                          zIndex: -1 
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default FinancialQuiz; 