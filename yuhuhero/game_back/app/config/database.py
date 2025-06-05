import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from bson import ObjectId

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
    try:
        return await users_collection.find_one({"_id": ObjectId(user_id)})
    except:
        # Si hay error al convertir a ObjectId, intentar buscar por id como string
        return await users_collection.find_one({"id": user_id})

async def create_user(user_data: dict):
    result = await users_collection.insert_one(user_data)
    return result.inserted_id

async def update_quiz_status(user_id: str, completed: bool):
    try:
        # Try to update using the "id" field
        result = await users_collection.update_one(
            {"id": user_id}, 
            {"$set": {"quizCompleted": completed}}
        )
        
        # If no document was modified, try with _id as ObjectId
        if result.modified_count == 0:
            try:
                result = await users_collection.update_one(
                    {"_id": ObjectId(user_id)}, 
                    {"$set": {"quizCompleted": completed}}
                )
            except:
                # If conversion to ObjectId fails, keep the original id approach
                pass
                
        return True
    except Exception as e:
        print(f"Error updating quiz status: {e}")
        return False

async def update_game_progress(user_id: str, progress_data: dict):
    try:
        # Try first with user_id as is
        result = await game_collection.update_one(
            {"user_id": user_id},
            {"$set": progress_data},
            upsert=True
        )
        
        # If no document was modified and upsert didn't happen, try with ObjectId
        if result.modified_count == 0 and result.upserted_id is None:
            try:
                # Try converting to ObjectId
                object_id = ObjectId(user_id)
                result = await game_collection.update_one(
                    {"user_id": str(object_id)}, # Use the string representation just to be safe
                    {"$set": progress_data},
                    upsert=True
                )
            except:
                # If conversion fails, that's okay - we already tried the original approach
                pass
                
        return True
    except Exception as e:
        print(f"Error updating game progress: {e}")
        return False

async def get_game_progress(user_id: str):
    try:
        # First try with user_id as is
        progress = await game_collection.find_one({"user_id": user_id})
        
        # If not found, try with ObjectId conversion
        if progress is None:
            try:
                # Try converting to ObjectId
                object_id = ObjectId(user_id)
                progress = await game_collection.find_one({"user_id": str(object_id)})
            except:
                # If conversion fails, return None
                pass
                
        return progress
    except Exception as e:
        print(f"Error getting game progress: {e}")
        return None

async def create_notification(notification_data: dict):
    result = await notifications_collection.insert_one(notification_data)
    return result.inserted_id

async def get_notifications(user_id: str):
    cursor = notifications_collection.find({"user_id": user_id})
    return await cursor.to_list(length=100) 