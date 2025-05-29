from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from bson.objectid import ObjectId
from datetime import datetime

from app.core.security import verify_password, get_password_hash, create_access_token
from app.db.database import get_database
from app.models.user import UserCreate, Token, UserResponse

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """Registrar un nuevo usuario"""
    db = get_database()
    
    # Verificar si el teléfono ya está registrado
    if await db.users.find_one({"phone": user_data.phone}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El número de teléfono ya está registrado",
        )
    
    # Crear usuario
    hashed_password = get_password_hash(user_data.password)
    new_user = {
        "name": user_data.name,
        "phone": user_data.phone,
        "password": hashed_password,
        "quizCompleted": False,
        "role": "user",
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(new_user)
    
    # Obtener el usuario creado
    created_user = await db.users.find_one({"_id": result.inserted_id})
    
    return {
        "id": str(created_user["_id"]),
        "name": created_user["name"],
        "phone": created_user["phone"],
        "quizCompleted": created_user["quizCompleted"],
        "created_at": created_user["created_at"]
    }

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Obtener token de acceso"""
    db = get_database()
    
    # Buscar usuario por teléfono
    user = await db.users.find_one({"phone": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Teléfono o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generar token
    access_token = create_access_token(
        subject=str(user["_id"])
    )
    
    return {"access_token": access_token, "token_type": "bearer"} 