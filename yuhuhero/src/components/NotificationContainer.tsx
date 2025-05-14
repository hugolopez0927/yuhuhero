import React from 'react';
import { useNotificationStore } from '../store/notificationStore';
import InAppNotification from './InAppNotification';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();
  
  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="mb-2 pointer-events-auto">
          <InAppNotification
            title={notification.title}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer; 