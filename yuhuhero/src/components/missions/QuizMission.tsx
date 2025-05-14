import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Índice de la opción correcta
  explanation?: string;
  image?: string;
}

interface QuizMissionProps {
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // Tiempo límite en segundos por pregunta (opcional)
  onComplete: (score: number, totalQuestions: number) => void;
}

const QuizMission: React.FC<QuizMissionProps> = ({ 
  title, 
  description, 
  questions, 
  timeLimit,
  onComplete 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0);
  const [results, setResults] = useState<{question: string, wasCorrect: boolean}[]>([]);

  const currentQuestion = questions[currentQuestionIndex];

  // Manejar el temporizador
  useEffect(() => {
    if (!timeLimit || showExplanation || isQuizComplete) return;
    
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Si se acabó el tiempo, pasar a la siguiente pregunta
      handleNextQuestion();
    }
  }, [timeRemaining, showExplanation, isQuizComplete, timeLimit]);

  // Resetear el temporizador al cambiar de pregunta
  useEffect(() => {
    if (timeLimit) {
      setTimeRemaining(timeLimit);
    }
  }, [currentQuestionIndex, timeLimit]);

  // Manejar la selección de una opción
  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null || showExplanation) return;
    
    setSelectedOption(optionIndex);
    
    // Verificar si la respuesta es correcta
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
      setResults(prev => [...prev, { 
        question: currentQuestion.question, 
        wasCorrect: true 
      }]);
    } else {
      setResults(prev => [...prev, { 
        question: currentQuestion.question, 
        wasCorrect: false 
      }]);
    }
    
    // Mostrar explicación si existe
    if (currentQuestion.explanation) {
      setShowExplanation(true);
    } else {
      // Pequeña pausa antes de ir a la siguiente pregunta
      setTimeout(() => {
        handleNextQuestion();
      }, 1000);
    }
  };

  // Pasar a la siguiente pregunta o finalizar el quiz
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Quiz completado
      setIsQuizComplete(true);
      onComplete(score, questions.length);
    }
  };

  // Renderizar los resultados finales
  const renderResults = () => {
    const percentage = Math.round((score / questions.length) * 100);
    
    let feedback = '';
    if (percentage >= 90) {
      feedback = '¡Excelente! Has dominado el tema.';
    } else if (percentage >= 70) {
      feedback = '¡Buen trabajo! Tienes un buen entendimiento del tema.';
    } else if (percentage >= 50) {
      feedback = 'No está mal, pero hay espacio para mejorar.';
    } else {
      feedback = 'Necesitas repasar este tema con más profundidad.';
    }
    
    return (
      <div className="p-6 bg-gray-700 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Resultados Finales</h3>
        <div className="text-3xl font-bold mb-2">
          {score} / {questions.length} ({percentage}%)
        </div>
        <p className="mb-6">{feedback}</p>
        
        <h4 className="text-xl font-semibold mb-3">Resumen:</h4>
        <ul className="space-y-2">
          {results.map((result, index) => (
            <li 
              key={index}
              className={`p-3 rounded-lg ${result.wasCorrect ? 'bg-green-700/30' : 'bg-red-700/30'}`}
            >
              <div className="flex items-start">
                <span className={`mr-2 ${result.wasCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {result.wasCorrect ? '✓' : '✗'}
                </span>
                <span>{result.question}</span>
              </div>
            </li>
          ))}
        </ul>
        
        <button
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg w-full max-w-4xl mx-auto text-white">
      {!isQuizComplete ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="text-sm">
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </div>
          </div>
          
          <p className="mb-4 text-gray-300">{description}</p>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-700 h-2 mb-6 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full"
              style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
            />
          </div>
          
          {/* Temporizador */}
          {timeLimit && (
            <div className="mb-4 flex items-center">
              <div className="mr-2">Tiempo restante:</div>
              <div 
                className={`font-bold ${
                  timeRemaining < timeLimit / 3 ? 'text-red-400' : 'text-blue-400'
                }`}
              >
                {timeRemaining} segundos
              </div>
            </div>
          )}
          
          {/* Pregunta actual */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
            
            {currentQuestion.image && (
              <img 
                src={currentQuestion.image} 
                alt="Imagen de la pregunta" 
                className="mb-4 max-h-64 mx-auto object-contain rounded-lg" 
              />
            )}
            
            {/* Opciones */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`w-full p-4 text-left rounded-lg border-2 ${
                    selectedOption === index 
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-700/30'
                        : 'border-red-500 bg-red-700/30' 
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  onClick={() => handleOptionSelect(index)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={selectedOption !== null}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      selectedOption === index
                        ? index === currentQuestion.correctAnswer 
                          ? 'bg-green-500'
                          : 'bg-red-500'
                        : 'bg-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    {option}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Explicación */}
          {showExplanation && currentQuestion.explanation && (
            <motion.div 
              className="mb-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="font-semibold mb-2">Explicación:</h4>
              <p>{currentQuestion.explanation}</p>
            </motion.div>
          )}
          
          {/* Botón para continuar */}
          {showExplanation && (
            <motion.button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
              onClick={handleNextQuestion}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
            </motion.button>
          )}
        </>
      ) : (
        renderResults()
      )}
    </div>
  );
};

export default QuizMission; 