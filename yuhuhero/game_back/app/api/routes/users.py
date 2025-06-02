from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from bson.objectid import ObjectId
from pydantic import BaseModel

from app.api.dependencies import get_current_user, get_admin_user
from app.db.database import get_database
from app.models.user import UserResponse

class QuizResponseItem(BaseModel):
    questionId: str
    questionText: str
    selectedOptionId: str
    selectedOptionText: str

class QuizStatusUpdate(BaseModel):
    quizCompleted: bool
    quizResponses: List[QuizResponseItem]

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_user_me(current_user = Depends(get_current_user)):
    """Obtener información del usuario actual"""
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "phone": current_user["phone"],
        "quizCompleted": current_user["quizCompleted"],
        "created_at": current_user.get("created_at")
    }

@router.put("/me/quiz-status")
async def update_quiz_status(completed: bool, current_user = Depends(get_current_user)):
    """Actualizar el estado del quiz para el usuario actual"""
    db = get_database()
    
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"quizCompleted": completed}}
    )
    
    return {"success": True}

@router.post("/update-quiz-status", response_model=Dict[str, bool])
async def update_quiz_status_with_responses(
    data: QuizStatusUpdate, 
    current_user = Depends(get_current_user)
):
    """
    Actualizar el estado del quiz y guardar las respuestas detalladas del usuario
    """
    db = get_database()
    
    # Actualizar el estado del quiz
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {
            "quizCompleted": data.quizCompleted,
            "quizResponses": [response.dict() for response in data.quizResponses]
        }}
    )
    
    return {"success": True}

@router.get("", response_model=List[UserResponse])
async def get_all_users(skip: int = 0, limit: int = 100, current_user = Depends(get_admin_user)):
    """Obtener todos los usuarios (solo admin)"""
    db = get_database()
    
    users = await db.users.find().skip(skip).limit(limit).to_list(limit)
    
    return [
        {
            "id": str(user["_id"]),
            "name": user["name"],
            "phone": user["phone"],
            "quizCompleted": user["quizCompleted"],
            "created_at": user.get("created_at")
        }
        for user in users
    ] 