from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
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

class NotificationBase(BaseModel):
    title: str
    message: str
    type: str  # success, warning, error, info

class NotificationCreate(NotificationBase):
    user_id: str

class Notification(NotificationBase):
    id: Optional[str] = None
    user_id: str
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class NotificationResponse(NotificationBase):
    id: str
    read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class NotificationUpdate(BaseModel):
    read: Optional[bool] = None 