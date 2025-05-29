from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson.objectid import ObjectId

from app.api.dependencies import get_current_user, get_admin_user
from app.db.database import get_database
from app.models.notification import NotificationCreate, NotificationResponse, NotificationUpdate

router = APIRouter()

@router.get("", response_model=List[NotificationResponse])
async def get_notifications(current_user = Depends(get_current_user)):
    """Obtener notificaciones del usuario actual"""
    db = get_database()
    
    notifications = await db.notifications.find(
        {"user_id": str(current_user["_id"])}
    ).sort("created_at", -1).to_list(20)  # Últimas 20 notificaciones
    
    return [
        {
            "id": str(notification["_id"]),
            "title": notification["title"],
            "message": notification["message"],
            "type": notification["type"],
            "read": notification["read"],
            "created_at": notification["created_at"]
        }
        for notification in notifications
    ]

@router.post("", status_code=status.HTTP_201_CREATED, response_model=NotificationResponse)
async def create_notification(
    notification: NotificationCreate,
    current_user = Depends(get_admin_user)
):
    """Crear una nueva notificación (solo admin)"""
    db = get_database()
    
    notification_data = {
        "user_id": notification.user_id,
        "title": notification.title,
        "message": notification.message,
        "type": notification.type,
        "read": False
    }
    
    result = await db.notifications.insert_one(notification_data)
    created = await db.notifications.find_one({"_id": result.inserted_id})
    
    return {
        "id": str(created["_id"]),
        "title": created["title"],
        "message": created["message"],
        "type": created["type"],
        "read": created["read"],
        "created_at": created["created_at"]
    }

@router.put("/{notification_id}", response_model=NotificationResponse)
async def update_notification(
    notification_id: str,
    notification_update: NotificationUpdate,
    current_user = Depends(get_current_user)
):
    """Actualizar una notificación (marcar como leída)"""
    db = get_database()
    
    # Verificar que la notificación existe y pertenece al usuario
    notification = await db.notifications.find_one({
        "_id": ObjectId(notification_id),
        "user_id": str(current_user["_id"])
    })
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notificación no encontrada"
        )
    
    # Actualizar notificación
    update_data = {}
    if notification_update.read is not None:
        update_data["read"] = notification_update.read
    
    if update_data:
        await db.notifications.update_one(
            {"_id": ObjectId(notification_id)},
            {"$set": update_data}
        )
    
    # Obtener notificación actualizada
    updated = await db.notifications.find_one({"_id": ObjectId(notification_id)})
    
    return {
        "id": str(updated["_id"]),
        "title": updated["title"],
        "message": updated["message"],
        "type": updated["type"],
        "read": updated["read"],
        "created_at": updated["created_at"]
    } 