from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from bson.objectid import ObjectId

client = None
db = None

# Referencias a colecciones
users_collection = None
quiz_collection = None
game_collection = None
notifications_collection = None

async def connect_to_mongo():
    """Conectar a MongoDB al iniciar la aplicación"""
    global client, db, users_collection, quiz_collection, game_collection, notifications_collection
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.DATABASE_NAME]
        
        # Inicializar colecciones
        users_collection = db.users
        quiz_collection = db.quizzes
        game_collection = db.game_progress
        notifications_collection = db.notifications
        
        print("Conectado a MongoDB")
    except Exception as e:
        print(f"Error conectando a MongoDB: {e}")
        raise e

async def close_mongo_connection():
    """Cerrar conexión con MongoDB al detener la aplicación"""
    global client
    if client:
        client.close()
        print("Conexión a MongoDB cerrada")

def get_database():
    """Obtener instancia de la base de datos"""
    return db

async def get_user_by_id(user_id: str):
    """Obtener usuario por ID"""
    try:
        # Convertir string a ObjectId si es necesario
        if ObjectId.is_valid(user_id):
            return await users_collection.find_one({"_id": ObjectId(user_id)})
        else:
            return await users_collection.find_one({"id": user_id})
    except Exception as e:
        print(f"Error obteniendo usuario por ID: {e}")
        return None 