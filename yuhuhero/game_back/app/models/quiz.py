from pydantic import BaseModel, Field, ConfigDict
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

class QuizOption(BaseModel):
    id: str
    text: str

class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[QuizOption]
    correct_option_id: str
    explanation: Optional[str] = None

class Quiz(BaseModel):
    id: str  # Regular id field for sample quizzes
    title: str
    description: str
    questions: List[QuizQuestion]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class QuizResponse(BaseModel):
    id: str
    title: str
    description: str
    questions: List[QuizQuestion]

class AnswerSubmission(BaseModel):
    question_id: str
    selected_option_id: str

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: List[AnswerSubmission]

class QuizResult(BaseModel):
    correct_answers: int
    total_questions: int
    score: float
    passed: bool
    rewards: int 