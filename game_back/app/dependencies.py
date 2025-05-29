from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.security import verify_token
from app.core.config import settings
from app.db.database import get_user_by_id
from app.models.user import TokenData, User, user_entity

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Obtener el usuario actual a partir del token JWT"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Verificar y decodificar token
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    token_data = TokenData(user_id=user_id, phone=payload.get("phone"))
    
    # Obtener usuario de la base de datos
    user = await get_user_by_id(token_data.user_id)
    if user is None:
        raise credentials_exception
    
    return user_entity(user)

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