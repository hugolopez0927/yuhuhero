from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from bson.objectid import ObjectId

from app.api.dependencies import get_current_user
from app.db.database import get_database
from app.models.game import GameProgressUpdate

router = APIRouter()

@router.get("/progress")
async def get_game_progress(current_user = Depends(get_current_user)):
    """Obtener el progreso del juego para el usuario actual"""
    db = get_database()
    
    # Buscar progreso existente
    progress = await db.game_progress.find_one({"user_id": str(current_user["_id"])})
    
    # Si no existe, crear uno nuevo
    if not progress:
        progress_data = {
            "user_id": str(current_user["_id"]),
            "current_level": 1,
            "coins": 0,
            "completed_levels": []
        }
        
        result = await db.game_progress.insert_one(progress_data)
        progress = await db.game_progress.find_one({"_id": result.inserted_id})
    
    return {
        "current_level": progress["current_level"],
        "coins": progress["coins"],
        "completed_levels": progress["completed_levels"]
    }

@router.put("/progress")
async def update_game_progress(
    progress_update: GameProgressUpdate,
    current_user = Depends(get_current_user)
):
    """Actualizar el progreso del juego para el usuario actual"""
    db = get_database()
    
    # Preparar los campos a actualizar
    update_data = {}
    if progress_update.current_level is not None:
        update_data["current_level"] = progress_update.current_level
    if progress_update.coins is not None:
        update_data["coins"] = progress_update.coins
    if progress_update.completed_levels is not None:
        update_data["completed_levels"] = progress_update.completed_levels
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se proporcionaron datos para actualizar"
        )
    
    # Buscar y actualizar progreso
    await db.game_progress.update_one(
        {"user_id": str(current_user["_id"])},
        {"$set": update_data},
        upsert=True
    )
    
    # Obtener progreso actualizado
    progress = await db.game_progress.find_one({"user_id": str(current_user["_id"])})
    
    return {
        "current_level": progress["current_level"],
        "coins": progress["coins"],
        "completed_levels": progress["completed_levels"]
    }

@router.get("/map")
async def get_game_map(current_user = Depends(get_current_user)):
    """Obtener el mapa del juego"""
    db = get_database()
    
    # Buscar mapa existente
    game_map = await db.game_maps.find_one({"active": True})
    
    # Si no existe, crear uno de ejemplo
    if not game_map:
        map_data = {
            "active": True,
            "tiles": [
                {
                    "id": "tile-1",
                    "title": "Introducción a Finanzas",
                    "description": "Aprende los conceptos básicos de finanzas",
                    "position_x": 0,
                    "position_y": 0,
                    "type": "quiz",
                    "rewards": 50,
                    "mission_id": "finance-intro"
                },
                {
                    "id": "tile-2",
                    "title": "Presupuesto Personal",
                    "description": "Aprende a crear un presupuesto personal",
                    "position_x": 1,
                    "position_y": 1,
                    "type": "lesson",
                    "rewards": 30,
                    "mission_id": "personal-budget"
                },
                {
                    "id": "tile-3",
                    "title": "Ahorro",
                    "description": "Descubre estrategias de ahorro efectivas",
                    "position_x": 2,
                    "position_y": 0,
                    "type": "challenge",
                    "rewards": 70,
                    "mission_id": "saving-strategies"
                },
                {
                    "id": "tile-4",
                    "title": "Inversión Básica",
                    "description": "Conoce los fundamentos de la inversión",
                    "position_x": 3,
                    "position_y": 1,
                    "type": "lesson",
                    "rewards": 40,
                    "mission_id": "investment-basics"
                },
                {
                    "id": "tile-5",
                    "title": "Deudas Inteligentes",
                    "description": "Aprende a manejar tus deudas",
                    "position_x": 4,
                    "position_y": 0,
                    "type": "quiz",
                    "rewards": 60,
                    "mission_id": "smart-debt"
                }
            ]
        }
        
        result = await db.game_maps.insert_one(map_data)
        game_map = await db.game_maps.find_one({"_id": result.inserted_id})
    
    return {"tiles": game_map["tiles"]} 