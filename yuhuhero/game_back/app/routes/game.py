from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import uuid

from app.models.user import User
from app.models.game import GameProgress, GameProgressUpdate, GameTile, GameMap
from app.dependencies import get_current_active_user
from app.config.database import update_game_progress, get_game_progress

router = APIRouter()

# Datos de ejemplo para el mapa del juego
DEFAULT_GAME_TILES = [
    GameTile(
        id=f"tile-{uuid.uuid4()}",
        title="Introducción a Finanzas",
        description="Aprende los conceptos básicos de finanzas personales",
        position_x=1,
        position_y=1,
        type="quiz",
        rewards=10,
        mission_id="mission-intro"
    ),
    GameTile(
        id=f"tile-{uuid.uuid4()}",
        title="Ahorro",
        description="Aprende a crear un plan de ahorro",
        position_x=2,
        position_y=1,
        type="lesson",
        rewards=15,
        mission_id="mission-savings"
    ),
    GameTile(
        id=f"tile-{uuid.uuid4()}",
        title="Inversión",
        description="Descubre cómo funciona la inversión",
        position_x=3,
        position_y=2,
        type="challenge",
        rewards=25,
        mission_id="mission-investment"
    ),
    GameTile(
        id=f"tile-{uuid.uuid4()}",
        title="Deudas",
        description="Manejo y reducción de deudas",
        position_x=2,
        position_y=3,
        type="lesson",
        rewards=20,
        mission_id="mission-debt"
    )
]

@router.get("/progress", response_model=GameProgress)
async def get_user_game_progress(current_user: User = Depends(get_current_active_user)):
    """Obtener el progreso del juego del usuario"""
    progress = await get_game_progress(current_user["id"])
    
    if not progress:
        # Si no hay progreso, crear uno nuevo
        default_progress = GameProgress(
            user_id=current_user["id"],
            current_level=1,
            coins=0,
            completed_levels=[]
        )
        await update_game_progress(current_user["id"], default_progress.dict())
        return default_progress
    
    return GameProgress(**progress)

@router.put("/progress", response_model=GameProgress)
async def update_user_game_progress(
    progress_data: GameProgressUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Actualizar el progreso del juego del usuario"""
    # Obtener progreso actual
    current_progress = await get_game_progress(current_user["id"])
    
    if not current_progress:
        # Si no hay progreso, crear uno nuevo
        current_progress = {
            "user_id": current_user["id"],
            "current_level": 1,
            "coins": 0,
            "completed_levels": []
        }
    
    # Actualizar datos según la solicitud
    update_data = {}
    
    if progress_data.current_level is not None:
        update_data["current_level"] = progress_data.current_level
    
    if progress_data.coins is not None:
        update_data["coins"] = progress_data.coins
    
    if progress_data.add_coins is not None:
        update_data["coins"] = current_progress.get("coins", 0) + progress_data.add_coins
    
    if progress_data.complete_level is not None:
        completed_levels = current_progress.get("completed_levels", [])
        if progress_data.complete_level not in completed_levels:
            completed_levels.append(progress_data.complete_level)
        update_data["completed_levels"] = completed_levels
    
    # Actualizar en la base de datos
    await update_game_progress(current_user["id"], update_data)
    
    # Obtener progreso actualizado
    updated_progress = await get_game_progress(current_user["id"])
    return GameProgress(**updated_progress)

@router.get("/map", response_model=GameMap)
async def get_game_map(current_user: User = Depends(get_current_active_user)):
    """Obtener el mapa del juego"""
    # En una implementación real, este mapa podría cargarse desde la base de datos
    # y personalizarse según el progreso del usuario
    return GameMap(tiles=DEFAULT_GAME_TILES) 