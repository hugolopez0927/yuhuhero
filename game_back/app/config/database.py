import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "yuhuhero_db")

# Cliente MongoDB
client = AsyncIOMotorClient(MONGODB_URL)
database = client[DATABASE_NAME]

# Colecciones
users_collection = database.users
quiz_collection = database.quizzes
game_collection = database.game_progress
notifications_collection = database.notifications

async def get_user_by_phone(phone: str):
    return await users_collection.find_one({"phone": phone})

async def get_user_by_id(user_id: str):
    return await users_collection.find_one({"id": user_id})

async def create_user(user_data: dict):
    result = await users_collection.insert_one(user_data)
    return result.inserted_id

async def update_quiz_status(user_id: str, completed: bool):
    await users_collection.update_one(
        {"id": user_id}, 
        {"$set": {"quizCompleted": completed}}
    )
    return True

async def update_game_progress(user_id: str, progress_data: dict):
    await game_collection.update_one(
        {"user_id": user_id},
        {"$set": progress_data},
        upsert=True
    )
    return True

async def get_game_progress(user_id: str):
    return await game_collection.find_one({"user_id": user_id})

async def create_notification(notification_data: dict):
    result = await notifications_collection.insert_one(notification_data)
    return result.inserted_id

async def get_notifications(user_id: str):
    cursor = notifications_collection.find({"user_id": user_id})
    return await cursor.to_list(length=100) 