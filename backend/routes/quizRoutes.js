const express = require('express');
const router = express.Router();

// Quiz financiero de ejemplo
const FINANCIAL_QUIZ = {
  id: "quiz-finance-basics",
  title: "Quiz Financiero Básico",
  description: "Evalúa tus conocimientos financieros básicos",
  questions: [
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
      correct_option_id: "q1_c",
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
      correct_option_id: "q2_f",
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
      correct_option_id: "q3_a",
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
      correct_option_id: "q4_a",
      explanation: "Gracias. El número de personas en tu hogar afecta tu presupuesto y planificación financiera."
    },
    {
      id: "q5",
      question: "¿Te gustaría que te recordemos que continúes y sigas mejorando?",
      options: [
        { id: "q5_a", text: "Sí, quiero recibir recordatorios" },
        { id: "q5_b", text: "No, prefiero no recibir notificaciones" }
      ],
      correct_option_id: "q5_a",
      explanation: "¡Perfecto! Tu preferencia ha sido registrada."
    },
    {
      id: "q6",
      question: "¿Te gustaría instalar la app en tu teléfono? Es totalmente seguro.",
      options: [
        { id: "q6_a", text: "Sí, quiero instalar la app" },
        { id: "q6_b", text: "No, prefiero usar la versión web" }
      ],
      correct_option_id: "q6_a",
      explanation: "¡Gracias por tu respuesta! Personalizaremos tu experiencia según tu preferencia."
    }
  ]
};

// @desc    Obtener quiz financiero
// @route   GET /api/quiz/financial
// @access  Público (para simplificar)
router.get('/financial', (req, res) => {
  res.json(FINANCIAL_QUIZ);
});

// @desc    Enviar respuestas del quiz
// @route   POST /api/quiz/submit
// @access  Público (para simplificar)
router.post('/submit', async (req, res) => {
  const { quiz_id, answers } = req.body;
  
  try {
    // Simular evaluación del quiz
    const totalQuestions = FINANCIAL_QUIZ.questions.length;
    const correctAnswers = Math.floor(totalQuestions * 0.8); // Simular 80% de aciertos
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    const result = {
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      score: score,
      passed: score >= 60,
      rewards: score >= 60 ? 100 : 0
    };
    
    console.log('Quiz enviado:', { quiz_id, answersCount: answers.length, result });
    
    // Siempre marcar el quiz como completado (es más un cuestionario que un examen)
    if (result.passed) {
      // Aquí podrías actualizar el estado del usuario si tuvieras autenticación
      console.log('Quiz pasado, usuario debería ser marcado como quiz completado');
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error procesando quiz:', error);
    res.status(500).json({ error: 'Error al procesar el quiz' });
  }
});

module.exports = router; 