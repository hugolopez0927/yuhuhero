from pydantic import BaseModel, Field
from typing import List, Optional
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

class GameTile(BaseModel):
    id: str
    title: str
    description: str
    position_x: int
    position_y: int
    type: str  # quiz, lesson, challenge
    rewards: int
    mission_id: str

class GameMap(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    tiles: List[GameTile]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class GameProgress(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    user_id: str
    current_level: int = 1
    coins: int = 0
    completed_levels: List[str] = []
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class GameProgressUpdate(BaseModel):
    current_level: Optional[int] = None
    coins: Optional[int] = None
    completed_levels: Optional[List[str]] = None

class GameTile(BaseModel):
    id: str
    title: str
    description: str
    position_x: int
    position_y: int
    type: str
    rewards: int
    mission_id: Optional[str] = None
    
class GameMap(BaseModel):
    tiles: List[GameTile] 