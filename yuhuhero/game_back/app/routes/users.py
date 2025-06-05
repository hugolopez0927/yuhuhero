from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import Optional
from app.models.user import User
from app.dependencies import get_current_active_user
from app.config.database import update_quiz_status, get_user_by_phone
from app.config.security import verify_token
from app.models.user import user_entity

router = APIRouter()

@router.get("/me", response_model=User)
async def get_user_profile(current_user: User = Depends(get_current_active_user)):
    """Obtener el perfil del usuario actual"""
    return current_user

# Ruta adicional para mantener compatibilidad con el frontend
@router.get("/profile", response_model=User)
async def get_user_profile_alt(current_user: User = Depends(get_current_active_user)):
    """Obtener el perfil del usuario actual (ruta alternativa)"""
    return current_user

# Endpoint alternativo que acepta token como parámetro de query para debugging
@router.get("/profile-by-token")
async def get_profile_by_token(token: str):
    """Endpoint alternativo para obtener perfil usando token como parámetro"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    user_id = payload.get("sub")
    phone = payload.get("phone")
    
    if not user_id and not phone:
        raise HTTPException(status_code=401, detail="Token no contiene identificación de usuario")
    
    # Intentar obtener usuario por ID primero
    user = None
    if user_id:
        # Importar aquí para evitar dependencia circular
        from app.config.database import get_user_by_id
        user = await get_user_by_id(user_id)
    
    # Si no se encuentra por ID, intentar por teléfono
    if not user and phone:
        user = await get_user_by_phone(phone)
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return user_entity(user)

@router.put("/me/quiz-status", response_model=bool)
async def update_user_quiz_status(completed: bool, current_user: User = Depends(get_current_active_user)):
    """Actualizar el estado del quiz del usuario"""
    result = await update_quiz_status(current_user["id"], completed)
    return result 