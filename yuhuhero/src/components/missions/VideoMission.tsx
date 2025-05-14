import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VideoQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface VideoMissionProps {
  title: string;
  description: string;
  videoUrl: string;
  questions: VideoQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
}

const VideoMission: React.FC<VideoMissionProps> = ({ 
  title, 
  description, 
  videoUrl, 
  questions,
  onComplete 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  // Verificar si el video se ha reproducido completamente
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setVideoEnded(true);
      setVideoPlayed(true);
    };

    video.addEventListener('ended', handleVideoEnd);
    return () => video.removeEventListener('ended', handleVideoEnd);
  }, []);

  // Mostrar las preguntas una vez el video ha sido visto
  useEffect(() => {
    if (videoPlayed && !showQuiz) {
      setShowQuiz(true);
    }
  }, [videoPlayed, showQuiz]);

  // Manejar la selección de respuesta
  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    setAnswers(prev => [...prev, optionIndex]);
    
    // Verificar si la respuesta es correcta
    if (optionIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    // Preparar para ir a la siguiente pregunta después de una breve pausa
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setIsQuizComplete(true);
        onComplete(score + (optionIndex === questions[currentQuestionIndex].correctAnswer ? 1 : 0), questions.length);
      }
    }, 1000);
  };

  // Reproducir el video desde el principio
  const replayVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play();
      setVideoEnded(false);
    }
  };

  // Renderizar los resultados finales
  const renderResults = () => {
    const percentage = Math.round((score / questions.length) * 100);
    
    let feedback = '';
    if (percentage >= 80) {
      feedback = '¡Excelente! Has prestado mucha atención al video.';
    } else if (percentage >= 60) {
      feedback = '¡Buen trabajo! Has entendido la mayoría de los conceptos del video.';
    } else {
      feedback = 'Intenta ver el video de nuevo y presta más atención a los detalles.';
    }
    
    return (
      <div className="p-6 bg-gray-700 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Resultados</h3>
        <div className="text-3xl font-bold mb-2">
          {score} / {questions.length} ({percentage}%)
        </div>
        <p className="mb-6">{feedback}</p>
        
        <h4 className="text-xl font-semibold mb-3">Tus respuestas:</h4>
        <ul className="space-y-3">
          {questions.map((q, index) => (
            <li key={q.id} className="p-4 bg-gray-800 rounded-lg">
              <div className="font-semibold mb-2">{q.question}</div>
              <div className="grid grid-cols-1 gap-2">
                {q.options.map((option, optIndex) => (
                  <div 
                    key={optIndex}
                    className={`p-2 rounded ${
                      answers[index] === optIndex
                        ? answers[index] === q.correctAnswer
                          ? 'bg-green-700/30 border border-green-500'
                          : 'bg-red-700/30 border border-red-500'
                        : optIndex === q.correctAnswer
                          ? 'bg-green-700/30 border border-green-500'
                          : 'bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-gray-600">
                        {String.fromCharCode(65 + optIndex)}
                      </div>
                      <span>{option}</span>
                      {answers[index] === optIndex && answers[index] !== q.correctAnswer && (
                        <span className="ml-auto text-red-500">✗</span>
                      )}
                      {optIndex === q.correctAnswer && (
                        <span className="ml-auto text-green-500">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
        
        <div className="mt-6 flex space-x-4">
          <button
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
            onClick={() => {
              setVideoPlayed(false);
              setShowQuiz(false);
              setIsQuizComplete(false);
              setCurrentQuestionIndex(0);
              setSelectedOption(null);
              setScore(0);
              setAnswers([]);
              replayVideo();
            }}
          >
            Ver el video de nuevo
          </button>
          
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
            onClick={() => window.location.reload()}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  };

  // Renderizar el componente de video estilo TikTok
  const renderVideo = () => {
    return (
      <div className="relative aspect-[9/16] max-w-lg mx-auto bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          controls
          autoPlay
          playsInline
        />
        
        {/* Overlay para video pausado/terminado */}
        {videoEnded && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4">
            <p className="text-white text-lg mb-4 text-center">
              Video completado. ¡Ahora responde las preguntas!
            </p>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-white text-black rounded-full font-medium"
                onClick={replayVideo}
              >
                Ver de nuevo
              </button>
              
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium"
                onClick={() => setShowQuiz(true)}
              >
                Responder preguntas
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderizar las preguntas
  const renderQuestions = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Pregunta {currentQuestionIndex + 1}/{questions.length}</h3>
          <button
            className="text-sm text-blue-400 hover:text-blue-300"
            onClick={replayVideo}
          >
            Ver video de nuevo
          </button>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4">{currentQuestion.question}</h4>
          
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
        
        {/* Barra de progreso */}
        <div className="w-full bg-gray-700 h-2 mt-6 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full"
            style={{ width: `${((currentQuestionIndex + (selectedOption !== null ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg w-full max-w-4xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="mb-6 text-gray-300">{description}</p>
      
      <div className="space-y-6">
        {!videoPlayed && renderVideo()}
        
        {showQuiz && !isQuizComplete && renderQuestions()}
        
        {isQuizComplete && renderResults()}
      </div>
    </div>
  );
};

export default VideoMission; 