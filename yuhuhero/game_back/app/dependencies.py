from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.config.security import verify_token
from app.config.database import get_user_by_id
from app.models.user import TokenData, User, user_entity
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# El token no necesita el / al inicio porque el cliente lo quita
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

async def get_current_user(request: Request, token: str = Depends(oauth2_scheme)) -> User:
    """Obtener el usuario actual a partir del token JWT"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Log headers para debug
    logger.info(f"Authorization header: {request.headers.get('Authorization')}")
    
    # Verificar y decodificar token
    payload = verify_token(token)
    if payload is None:
        logger.error(f"Token inválido: {token[:10]}...")
        raise credentials_exception
    
    user_id = payload.get("sub")
    if user_id is None:
        logger.error("Token no contiene sub (user_id)")
        raise credentials_exception
    
    logger.info(f"Token válido para usuario ID: {user_id}")
    token_data = TokenData(user_id=user_id, phone=payload.get("phone"))
    
    # Obtener usuario de la base de datos
    user = await get_user_by_id(token_data.user_id)
    if user is None:
        logger.error(f"Usuario no encontrado con ID: {user_id}")
        raise credentials_exception
    
    # Convertir ObjectId a string para evitar problemas de serialización
    user_data = user_entity(user)
    logger.info(f"Usuario autenticado: {user_data.get('name', 'Unknown')}")
    
    return user_data

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Verificar que el usuario está activo"""
    return current_user

async def get_admin_user(current_user: User = Depends(get_current_active_user)):
    """Verificar si el usuario actual es administrador"""
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren permisos de administrador"
        )
    return current_user 