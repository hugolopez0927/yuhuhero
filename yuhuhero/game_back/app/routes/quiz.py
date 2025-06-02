from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import uuid

from app.models.user import User
from app.models.quiz import FinancialQuiz, QuizQuestion, QuizOption, QuizSubmission, QuizResult
from app.dependencies import get_current_active_user
from app.config.database import update_quiz_status, update_game_progress, get_game_progress

router = APIRouter()

# Quiz financiero de ejemplo
SAMPLE_QUIZ = FinancialQuiz(
    id="quiz-finance-basics",
    title="Conceptos Básicos de Finanzas",
    description="Pon a prueba tus conocimientos sobre finanzas personales",
    questions=[
        QuizQuestion(
            id="q1",
            question="¿Qué es un presupuesto?",
            options=[
                QuizOption(id="q1_a", text="Una lista de compras"),
                QuizOption(id="q1_b", text="Un plan para administrar el dinero"),
                QuizOption(id="q1_c", text="Un tipo de inversión"),
                QuizOption(id="q1_d", text="Una forma de préstamo")
            ],
            correct_option_id="q1_b",
            explanation="Un presupuesto es un plan que ayuda a administrar tus ingresos y gastos."
        ),
        QuizQuestion(
            id="q2",
            question="¿Qué es el interés compuesto?",
            options=[
                QuizOption(id="q2_a", text="Un impuesto sobre las ganancias"),
                QuizOption(id="q2_b", text="El interés que se gana sobre el capital inicial solamente"),
                QuizOption(id="q2_c", text="El interés que se gana sobre el capital inicial más los intereses acumulados"),
                QuizOption(id="q2_d", text="Una tarifa bancaria mensual")
            ],
            correct_option_id="q2_c",
            explanation="El interés compuesto es el que se gana no solo sobre el capital inicial, sino también sobre los intereses acumulados previamente."
        ),
        QuizQuestion(
            id="q3",
            question="¿Qué es más recomendable financieramente?",
            options=[
                QuizOption(id="q3_a", text="Gastar todo lo que ganas"),
                QuizOption(id="q3_b", text="Ahorrar al menos el 10% de tus ingresos"),
                QuizOption(id="q3_c", text="Usar múltiples tarjetas de crédito para todo"),
                QuizOption(id="q3_d", text="Invertir todo tu dinero en una sola empresa")
            ],
            correct_option_id="q3_b",
            explanation="Es recomendable ahorrar al menos el 10% de tus ingresos para emergencias y metas futuras."
        ),
        QuizQuestion(
            id="q4",
            question="¿Qué es un fondo de emergencia?",
            options=[
                QuizOption(id="q4_a", text="Dinero guardado para gastos imprevistos"),
                QuizOption(id="q4_b", text="Un préstamo de emergencia"),
                QuizOption(id="q4_c", text="Un seguro médico"),
                QuizOption(id="q4_d", text="Una tarjeta de crédito especial")
            ],
            correct_option_id="q4_a",
            explanation="Un fondo de emergencia es dinero ahorrado específicamente para cubrir gastos imprevistos o pérdida de ingresos."
        ),
        QuizQuestion(
            id="q5",
            question="¿Cuál es una buena práctica para manejar deudas?",
            options=[
                QuizOption(id="q5_a", text="Ignorarlas hasta que desaparezcan"),
                QuizOption(id="q5_b", text="Pagar solo el mínimo en tarjetas de crédito"),
                QuizOption(id="q5_c", text="Pagar primero las deudas con mayor interés"),
                QuizOption(id="q5_d", text="Obtener más préstamos para pagar deudas existentes")
            ],
            correct_option_id="q5_c",
            explanation="Es más eficiente pagar primero las deudas con tasas de interés más altas para reducir el costo total."
        )
    ]
)

@router.get("/financial", response_model=FinancialQuiz)
async def get_financial_quiz(current_user: User = Depends(get_current_active_user)):
    """Obtener el quiz financiero"""
    return SAMPLE_QUIZ

@router.post("/submit", response_model=QuizResult)
async def submit_quiz(
    submission: QuizSubmission,
    current_user: User = Depends(get_current_active_user)
):
    """Enviar respuestas del quiz y obtener resultados"""
    # Verificar que el quiz existe
    if submission.quiz_id != SAMPLE_QUIZ.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz no encontrado"
        )
    
    # Verificar respuestas
    correct_answers = 0
    total_questions = len(SAMPLE_QUIZ.questions)
    
    # Mapeo de id de pregunta a opción correcta
    correct_options = {q.id: q.correct_option_id for q in SAMPLE_QUIZ.questions}
    
    for answer in submission.answers:
        if answer.question_id in correct_options:
            if answer.selected_option_id == correct_options[answer.question_id]:
                correct_answers += 1
    
    # Calcular puntuación
    score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
    passed = score >= 60  # Aprobar con 60% o más
    
    # Recompensas por completar el quiz
    rewards = 0
    if passed:
        rewards = 50  # Recompensa base por aprobar
        
        # Bonus por puntuación alta
        if score >= 80:
            rewards += 30
        elif score >= 70:
            rewards += 20
        
        # Actualizar estado del quiz en el perfil del usuario
        await update_quiz_status(current_user.id, True)
        
        # Actualizar monedas del usuario
        game_progress = await get_game_progress(current_user.id)
        current_coins = game_progress.get("coins", 0) if game_progress else 0
        
        await update_game_progress(
            current_user.id,
            {"coins": current_coins + rewards}
        )
    
    return QuizResult(
        quiz_id=submission.quiz_id,
        correct_answers=correct_answers,
        total_questions=total_questions,
        score=score,
        passed=passed,
        rewards=rewards
    ) 