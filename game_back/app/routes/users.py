from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User
from app.dependencies import get_current_active_user
from app.config.database import update_quiz_status

router = APIRouter()

@router.get("/me", response_model=User)
async def get_user_profile(current_user: User = Depends(get_current_active_user)):
    """Obtener el perfil del usuario actual"""
    return current_user

@router.put("/me/quiz-status", response_model=bool)
async def update_user_quiz_status(completed: bool, current_user: User = Depends(get_current_active_user)):
    """Actualizar el estado del quiz del usuario"""
    result = await update_quiz_status(current_user.id, completed)
    return result 