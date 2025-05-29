from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, users, quiz, game, notifications
from app.db.database import connect_to_mongo, close_mongo_connection

app = FastAPI(title="YuhuHero API", description="API para la aplicación de educación financiera gamificada")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, restringe a dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Eventos de inicio y cierre
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Incluir routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["quiz"])
app.include_router(game.router, prefix="/api/game", tags=["game"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])

@app.get("/", tags=["root"])
def read_root():
    return {"message": "Bienvenido a YuhuHero API", "version": "1.0.0"} 