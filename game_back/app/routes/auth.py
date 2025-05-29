from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
import uuid

from app.models.user import UserCreate, UserLogin, Token, User, create_user_dict, user_entity
from app.config.security import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.config.database import get_user_by_phone, create_user

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

@router.post("/register", response_model=User)
async def register(user_data: UserCreate):
    """Registrar un nuevo usuario"""
    # Verificar si el usuario ya existe
    existing_user = await get_user_by_phone(user_data.phone)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario ya registrado con este número de teléfono"
        )
    
    # Crear hash de la contraseña
    hashed_password = get_password_hash(user_data.password)
    
    # Crear usuario en la base de datos
    user_dict = create_user_dict(user_data.name, user_data.phone, hashed_password)
    await create_user(user_dict)
    
    return user_entity(user_dict)

@router.post("/login", response_model=Token)
async def login(form_data: UserLogin):
    """Iniciar sesión y obtener token"""
    user = await get_user_by_phone(form_data.phone)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Número de teléfono o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Número de teléfono o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear token de acceso JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"], "phone": user["phone"]},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"} 