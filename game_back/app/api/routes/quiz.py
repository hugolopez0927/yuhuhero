from fastapi import APIRouter, Depends, HTTPException, status
from bson.objectid import ObjectId

from app.api.dependencies import get_current_user
from app.db.database import get_database
from app.models.quiz import QuizResponse, QuizSubmission, QuizResult

router = APIRouter()

@router.get("/financial", response_model=QuizResponse)
async def get_financial_quiz(current_user = Depends(get_current_user)):
    """Obtener el quiz financiero"""
    db = get_database()
    
    # Buscar el quiz financiero (en una implementación real habría más tipos)
    quiz = await db.quizzes.find_one({"title": "Quiz Financiero Básico"})
    
    if not quiz:
        # Si no existe el quiz, crear uno de ejemplo
        quiz_data = {
            "title": "Quiz Financiero Básico",
            "description": "Evalúa tus conocimientos financieros básicos",
            "questions": [
                {
                    "id": "q1",
                    "question": "¿Qué es un presupuesto?",
                    "options": [
                        {"id": "q1a1", "text": "Una lista de deseos"},
                        {"id": "q1a2", "text": "Un plan para gastar e ingresos"},
                        {"id": "q1a3", "text": "Una tarjeta de crédito"},
                        {"id": "q1a4", "text": "Un tipo de inversión"}
                    ],
                    "correct_option_id": "q1a2",
                    "explanation": "Un presupuesto es un plan financiero que asigna ingresos a gastos y ahorros."
                },
                {
                    "id": "q2",
                    "question": "¿Qué es una tasa de interés?",
                    "options": [
                        {"id": "q2a1", "text": "El costo por pedir dinero prestado"},
                        {"id": "q2a2", "text": "La cantidad que pagas por un producto"},
                        {"id": "q2a3", "text": "Un impuesto del gobierno"},
                        {"id": "q2a4", "text": "El salario de un trabajador"}
                    ],
                    "correct_option_id": "q2a1",
                    "explanation": "La tasa de interés es el costo de pedir prestado dinero, o la ganancia por prestarlo."
                },
                {
                    "id": "q3",
                    "question": "¿Qué es el ahorro?",
                    "options": [
                        {"id": "q3a1", "text": "Gastar todo el dinero rápidamente"},
                        {"id": "q3a2", "text": "Pedir dinero prestado"},
                        {"id": "q3a3", "text": "Guardar dinero para el futuro"},
                        {"id": "q3a4", "text": "Invertir solo en la bolsa"}
                    ],
                    "correct_option_id": "q3a3",
                    "explanation": "El ahorro es apartar una parte de tus ingresos para uso futuro."
                }
            ]
        }
        
        result = await db.quizzes.insert_one(quiz_data)
        quiz = await db.quizzes.find_one({"_id": result.inserted_id})
    
    # Mantener el campo correct_option_id que es requerido por el modelo QuizResponse
    quiz_without_answers = {
        "id": str(quiz["_id"]),
        "title": quiz["title"],
        "description": quiz["description"],
        "questions": [
            {
                "id": q["id"],
                "question": q["question"],
                "options": q["options"],
                "correct_option_id": q["correct_option_id"],  # Incluir este campo que es requerido
                "explanation": q.get("explanation", "")  # También incluir la explicación si está disponible
            }
            for q in quiz["questions"]
        ]
    }
    
    return quiz_without_answers

@router.post("/submit", response_model=QuizResult)
async def submit_quiz(submission: QuizSubmission, current_user = Depends(get_current_user)):
    """Enviar respuestas del quiz y obtener resultados"""
    db = get_database()
    
    # Obtener el quiz
    quiz = await db.quizzes.find_one({"_id": ObjectId(submission.quiz_id)})
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz no encontrado"
        )
    
    # Verificar respuestas
    correct_answers = 0
    total_questions = len(quiz["questions"])
    
    for answer in submission.answers:
        for question in quiz["questions"]:
            if question["id"] == answer.question_id:
                if question["correct_option_id"] == answer.selected_option_id:
                    correct_answers += 1
                break
    
    # Calcular puntuación
    score = (correct_answers / total_questions) * 100
    passed = score >= 60  # Aprobar con 60% o más
    
    # Calcular recompensas
    rewards = 0
    if passed:
        rewards = 50 + (correct_answers * 10)  # Recompensa base + extra por respuestas correctas
        
        # Actualizar estado del quiz del usuario si aprobó
        await db.users.update_one(
            {"_id": current_user["_id"]},
            {"$set": {"quizCompleted": True}}
        )
    
    # Guardar resultado en la base de datos
    result_data = {
        "user_id": str(current_user["_id"]),
        "quiz_id": submission.quiz_id,
        "answers": [answer.dict() for answer in submission.answers],
        "correct_answers": correct_answers,
        "total_questions": total_questions,
        "score": score,
        "passed": passed,
        "rewards": rewards
    }
    
    await db.quiz_results.insert_one(result_data)
    
    # Retornar resultado
    return {
        "correct_answers": correct_answers,
        "total_questions": total_questions,
        "score": score,
        "passed": passed,
        "rewards": rewards
    } 