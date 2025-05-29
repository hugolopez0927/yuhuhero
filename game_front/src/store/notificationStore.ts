import { create } from 'zustand';
import { getNotifications, markNotificationAsRead } from '../services/api';
import { Notification } from '../services/api';

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  
  fetchNotifications: async () => {
    try {
      set({ loading: true, error: null });
      const notifications = await getNotifications();
      set({ notifications, loading: false });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      set({ 
        loading: false, 
        error: 'Error al cargar las notificaciones' 
      });
    }
  },
  
  markAsRead: async (id: string) => {
    try {
      await markNotificationAsRead(id);
      
      // Actualizar localmente
      set((state) => ({
        notifications: state.notifications.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      }));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      set({ error: 'Error al marcar notificación como leída' });
    }
  },
  
  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications]
    }));
  }
})); 