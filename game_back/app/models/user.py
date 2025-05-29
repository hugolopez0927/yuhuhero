from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId

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

def user_entity(user: Dict[str, Any]) -> User:
    """
    Convierte un documento de usuario de MongoDB a un formato estándar
    """
    # Si el usuario tiene _id (ObjectId), convertirlo a string
    if "_id" in user and user["_id"]:
        user_dict = dict(user)
        user_dict["id"] = str(user["_id"])
        return user_dict
    return dict(user) 