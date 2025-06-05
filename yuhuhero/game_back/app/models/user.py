from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from bson import ObjectId
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_user_dict(data: dict) -> dict:
    """
    Prepara el payload que se guardará en MongoDB.
    Espera keys: name, phone, password  (y cualquier otro campo extra).
    • Hashea la contraseña
    • Agrega timestamps y banderas por defecto
    """
    user = {
        "name": data["name"],
        "phone": data["phone"],
        "password": pwd_context.hash(data["password"]),
        "quizCompleted": False,
        "created_at": datetime.utcnow(),
        "role": "user",
        "is_admin": False,
    }
    return user



class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)

class UserBase(BaseModel):
    name: str
    phone: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id")
    password: str
    quizCompleted: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    role: str = "user"
    is_admin: bool = False

class UserResponse(UserBase):
    id: str
    quizCompleted: bool
    created_at: Optional[datetime] = None
    is_admin: Optional[bool] = False

    class Config:
        from_attributes = True  # En Pydantic v2, orm_mode se llama from_attributes

class UserLogin(BaseModel):
    phone: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    phone: Optional[str] = None

# Definición de tipo para un usuario
User = Dict[str, Any]

def user_entity(user: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convierte un documento de usuario de MongoDB a un formato seguro para respuesta API
    Maneja la conversión de ObjectId a string y quita campos sensibles
    """
    result = {}
    
    # Manejar _id de MongoDB
    if "_id" in user:
        result["id"] = str(user["_id"])
    elif "id" in user:
        result["id"] = user["id"]
    
    # Copiar el resto de campos no sensibles
    safe_fields = ["name", "phone", "email", "is_admin", "quizCompleted", "created_at", "updated_at"]
    for field in safe_fields:
        if field in user:
            result[field] = user[field]
    
    # Asegurar que quizCompleted existe (para frontend)
    if "quizCompleted" not in result:
        result["quizCompleted"] = user.get("quiz_completed", False)
    
    return result 