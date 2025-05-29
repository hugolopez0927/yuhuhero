from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import uuid

from app.models.user import User
from app.models.notification import Notification, NotificationCreate, NotificationUpdate, create_notification
from app.dependencies import get_current_active_user
from app.config.database import create_notification as db_create_notification, get_notifications

router = APIRouter()

@router.get("/", response_model=List[Notification])
async def get_user_notifications(current_user: User = Depends(get_current_active_user)):
    """Obtener todas las notificaciones del usuario"""
    notifications = await get_notifications(current_user.id)
    return notifications

@router.post("/", response_model=Notification)
async def create_user_notification(
    notification_data: NotificationCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Crear una nueva notificación (esto normalmente sería interno, pero se expone para pruebas)"""
    # Asegurarse de que la notificación sea para el usuario actual
    if notification_data.user_id != current_user.id:
        notification_data.user_id = current_user.id
        
    notification = create_notification(notification_data)
    notification_id = await db_create_notification(notification)
    
    # Añadir el ID a la notificación
    notification["id"] = str(notification_id)
    
    return notification

@router.put("/{notification_id}", response_model=dict)
async def mark_notification_as_read(
    notification_id: str,
    update_data: NotificationUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Marcar una notificación como leída"""
    # En una implementación real, verificaríamos que la notificación pertenece al usuario
    # y actualizaríamos el estado en la base de datos
    
    return {"success": True, "message": f"Notificación {notification_id} actualizada"} 