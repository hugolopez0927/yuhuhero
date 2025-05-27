import React, { useState } from 'react';
import ClassificationMission from './missions/ClassificationMission';
import QuizMission from './missions/QuizMission';
import VideoMission from './missions/VideoMission';

type MissionType = 'classification' | 'quiz' | 'video' | null;

interface MissionManagerProps {
  missionType: MissionType;
  missionId: string;
  onComplete: (success: boolean, score: number, totalPossible: number) => void;
  onClose: () => void;
}

const MissionManager: React.FC<MissionManagerProps> = ({
  missionType,
  missionId,
  onComplete,
  onClose
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // En una aplicación real, aquí cargaríamos los datos de la misión desde una API o base de datos
  // Para este ejemplo, vamos a simular misiones de ejemplo según el tipo
  
  // Ejemplo de misión de clasificación (conceptos financieros)
  const classificationMissionExample = {
    title: "Clasificación de Conceptos Financieros",
    description: "Arrastra cada concepto a la categoría a la que pertenece: Ahorro, Deuda o Inversión.",
    items: [
      { id: "item1", text: "Cuenta de ahorro", category: "savings", image: "/assets/images/savings-icon.png" },
      { id: "item2", text: "Tarjeta de crédito", category: "debt", image: "/assets/images/credit-card-icon.png" },
      { id: "item3", text: "Acciones", category: "investment", image: "/assets/images/stocks-icon.png" },
      { id: "item4", text: "Préstamo estudiantil", category: "debt", image: "/assets/images/loan-icon.png" },
      { id: "item5", text: "Fondo de emergencia", category: "savings", image: "/assets/images/emergency-fund-icon.png" },
      { id: "item6", text: "Bonos", category: "investment", image: "/assets/images/bonds-icon.png" }
    ],
    categories: [
      { id: "savings", name: "Ahorro", image: "/assets/images/savings-category.png" },
      { id: "debt", name: "Deuda", image: "/assets/images/debt-category.png" },
      { id: "investment", name: "Inversión", image: "/assets/images/investment-category.png" }
    ]
  };
  
  // Ejemplo de misión de quiz (conocimientos financieros)
  const quizMissionExample = {
    title: "Quiz de Conocimientos Financieros",
    description: "Responde las siguientes preguntas para poner a prueba tus conocimientos sobre finanzas personales.",
    questions: [
      {
        id: "q1",
        question: "¿Qué es un presupuesto?",
        options: [
          "Una lista de gastos mensuales",
          "Un plan para tus ingresos y gastos",
          "Una forma de obtener préstamos",
          "Una herramienta sólo para empresas"
        ],
        correctAnswer: 1,
        explanation: "Un presupuesto es un plan financiero que asigna tus ingresos a gastos, ahorros y otras necesidades financieras durante un período de tiempo determinado."
      },
      {
        id: "q2",
        question: "¿Cuál de estos es un ejemplo de gasto fijo?",
        options: [
          "Comidas en restaurantes",
          "Compras de ropa",
          "Alquiler o hipoteca",
          "Regalos de cumpleaños"
        ],
        correctAnswer: 2,
        explanation: "Los gastos fijos son aquellos que permanecen constantes cada mes, como el alquiler o la hipoteca, mientras que los variables fluctúan, como las comidas fuera o la ropa."
      },
      {
        id: "q3",
        question: "¿Qué es el interés compuesto?",
        options: [
          "Un tipo de préstamo bancario",
          "Interés que se calcula sobre el capital original solamente",
          "Interés que se calcula sobre el capital más los intereses acumulados",
          "Una tarifa que cobran los bancos anualmente"
        ],
        correctAnswer: 2,
        image: "/assets/images/compound-interest.png"
      }
    ],
    timeLimit: 30 // 30 segundos por pregunta
  };
  
  // Ejemplo de misión de video (educación financiera)
  const videoMissionExample = {
    title: "Video: Fundamentos del Ahorro",
    description: "Mira este breve video y luego responde las preguntas relacionadas con su contenido.",
    videoUrl: "https://example.com/sample-financial-video.mp4", // Deberías usar una URL real
    questions: [
      {
        id: "vq1",
        question: "Según el video, ¿cuál es el primer paso para empezar a ahorrar?",
        options: [
          "Abrir una cuenta de ahorro con alto interés",
          "Establecer un presupuesto",
          "Reducir todos los gastos",
          "Buscar un trabajo mejor pagado"
        ],
        correctAnswer: 1
      },
      {
        id: "vq2",
        question: "¿Qué porcentaje de ingresos recomienda el video apartar para ahorros?",
        options: [
          "10-15%",
          "25-30%",
          "5-10%",
          "50% o más"
        ],
        correctAnswer: 0
      },
      {
        id: "vq3",
        question: "¿Cuál fue el ejemplo que dio el video sobre el fondo de emergencia ideal?",
        options: [
          "1 mes de gastos",
          "3-6 meses de gastos",
          "1 año de salario",
          "10% de tus ingresos anuales"
        ],
        correctAnswer: 1
      }
    ]
  };

  // Función para simular carga de datos (en una app real, aquí harías fetch a una API)
  React.useEffect(() => {
    // Simular tiempo de carga
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(loadingTimer);
  }, []);

  // Manejar la finalización de la misión
  const handleMissionComplete = (score: number, total: number) => {
    // Calcular si la misión se completó con éxito (ej: más del 70% correcto)
    const percentage = (score / total) * 100;
    const success = percentage >= 70;
    
    // Notificar al componente padre
    onComplete(success, score, total);
  };

  // Renderizar pantalla de carga
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-800 rounded-lg text-white">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg">Cargando misión...</p>
      </div>
    );
  }

  // Renderizar pantalla de error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-800 rounded-lg text-white">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold mb-2">Error al cargar la misión</h3>
        <p className="mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
          onClick={onClose}
        >
          Volver
        </button>
      </div>
    );
  }

  // Renderizar la misión según su tipo
  switch (missionType) {
    case 'classification':
      return (
        <ClassificationMission
          title={classificationMissionExample.title}
          description={classificationMissionExample.description}
          items={classificationMissionExample.items}
          categories={classificationMissionExample.categories}
          onComplete={handleMissionComplete}
        />
      );
      
    case 'quiz':
      return (
        <QuizMission
          title={quizMissionExample.title}
          description={quizMissionExample.description}
          questions={quizMissionExample.questions}
          timeLimit={quizMissionExample.timeLimit}
          onComplete={handleMissionComplete}
        />
      );
      
    case 'video':
      return (
        <VideoMission
          title={videoMissionExample.title}
          description={videoMissionExample.description}
          videoUrl={videoMissionExample.videoUrl}
          questions={videoMissionExample.questions}
          onComplete={handleMissionComplete}
        />
      );
      
    default:
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-800 rounded-lg text-white">
          <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Tipo de misión no reconocido</h3>
          <p className="mb-4">No se pudo determinar el tipo de misión a mostrar.</p>
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
            onClick={onClose}
          >
            Volver
          </button>
        </div>
      );
  }
};

export default MissionManager; 