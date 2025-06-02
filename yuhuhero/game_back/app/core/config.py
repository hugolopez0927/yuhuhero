from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Configuración de la API
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "YuhuHero"
    
    # Configuración de seguridad
    SECRET_KEY: str = "your_secret_key_here"  # Debe cambiarse en producción
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 días
    
    # Configuración de la base de datos
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "yuhuhero"
    
    class Config:
        env_file = ".env"


settings = Settings() 