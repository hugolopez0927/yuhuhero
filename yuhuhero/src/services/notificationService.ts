// Verificar si el navegador soporta notificaciones
export const isPushNotificationSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Solicitar permiso para mostrar notificaciones
export const askUserPermission = async () => {
  return await Notification.requestPermission();
};

// Registrar el Service Worker
export const registerServiceWorker = async () => {
  if (!isPushNotificationSupported()) {
    return null;
  }
  
  return await navigator.serviceWorker.register('/sw.js');
};

// Crear una notificación simple
export const createNotification = (title: string, options: NotificationOptions = {}) => {
  if (!isPushNotificationSupported()) {
    alert('Las notificaciones no son soportadas en este navegador');
    return;
  }
  
  if (Notification.permission !== 'granted') {
    alert('Se requiere permiso para mostrar notificaciones');
    return;
  }
  
  const defaultOptions = {
    body: '',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
  };
  
  return new Notification(title, { ...defaultOptions, ...options });
};

// Enviar una notificación a través del Service Worker
export const sendNotification = async (title: string, body: string, url: string = '/') => {
  const registration = await navigator.serviceWorker.getRegistration();
  
  if (!registration) {
    return false;
  }
  
  // Simular la recepción de una notificación push
  const options = {
    body,
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      url
    }
  };
  
  await registration.showNotification(title, options);
  return true;
}; 