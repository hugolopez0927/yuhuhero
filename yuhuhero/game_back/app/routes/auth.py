from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.models.user import User, Token, UserCreate, user_entity
from app.config.security import verify_password, create_access_token
from app.config.database import get_user_by_phone, create_user
from pydantic import BaseModel
import logging
from app.models.user import create_user_dict

# Configurar logging
logger = logging.getLogger(__name__)

class LoginForm(BaseModel):
    phone: str
    password: str

router = APIRouter()

@router.post("/register", response_model=User)
async def register(user_data: UserCreate):
    """Registrar nuevo usuario"""
    # Verificar si el usuario ya existe
    existing_user = await get_user_by_phone(user_data.phone)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario ya existe"
        )
    
    # Convertir el modelo Pydantic a un diccionario para MongoDB
    user_dict = create_user_dict(user_data.dict())
    
    # Crear nuevo usuario
    new_user_id = await create_user(user_dict)
    if not new_user_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear usuario"
        )
    
    # Agregar el ID al diccionario del usuario
    user_dict["_id"] = new_user_id
    
    # Generar el token JWT para el nuevo usuario
    user_entity_dict = user_entity(user_dict)
    access_token = create_access_token(
        data={"sub": str(user_entity_dict["id"]), "phone": user_entity_dict["phone"]}
    )
    
    # Incluir el token en la respuesta
    user_entity_dict["token"] = access_token
    
    return user_entity_dict

@router.post("/login", response_model=Token)
async def login(form_data: LoginForm):
    """Autenticar usuario y generar token JWT"""
    # Buscar usuario por teléfono
    user = await get_user_by_phone(form_data.phone)
    if not user:
        logger.warning(f"Intento de login con teléfono no registrado: {form_data.phone}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verificar contraseña
    password_field = "password"
    if "hashed_password" in user:
        password_field = "hashed_password"
    
    if not verify_password(form_data.password, user[password_field]):
        logger.warning(f"Contraseña incorrecta para usuario: {form_data.phone}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear el token JWT
    user_id = str(user["_id"])  # Convertir ObjectId a string
    logger.info(f"Login exitoso para usuario ID: {user_id}")
    
    access_token = create_access_token(
        data={"sub": user_id, "phone": user["phone"]}
    )
    
    # Devolver el token en formato esperado por el cliente
    return {"access_token": access_token, "token_type": "bearer"} 