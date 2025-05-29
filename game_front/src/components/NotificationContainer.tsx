import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../store/notificationStore';
import InAppNotification from './InAppNotification';

const NotificationContainer: React.FC = () => {
  const { notifications, markAsRead } = useNotificationStore();
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([]);

  // Al recibir nuevas notificaciones, mostrarlas
  useEffect(() => {
    // Buscar notificaciones no leídas que no estén ya visibles
    const newNotifications = notifications
      .filter((notification) => !notification.read && !visibleNotifications.includes(notification.id))
      .map((notification) => notification.id);

    if (newNotifications.length > 0) {
      setVisibleNotifications((prev) => [...prev, ...newNotifications]);
    }
  }, [notifications, visibleNotifications]);

  // Ocultar una notificación
  const hideNotification = (id: string) => {
    setVisibleNotifications((prev) => prev.filter((notificationId) => notificationId !== id));
    markAsRead(id);
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {notifications
          .filter((notification) => visibleNotifications.includes(notification.id))
          .map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <InAppNotification
                id={notification.id}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                onClose={() => hideNotification(notification.id)}
              />
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer; 