const express = require('express');
const router = express.Router();

// Notificaciones de ejemplo
const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "¡Bienvenido a YuhuHero!",
    message: "Has completado el quiz inicial. ¡Explora el mapa para continuar aprendiendo!",
    type: "welcome",
    read: false,
    created_at: new Date().toISOString()
  },
  {
    id: "notif-2",
    title: "¡Quiz Completado!",
    message: "Has completado el quiz financiero básico. ¡Sigue explorando para ganar más monedas!",
    type: "achievement",
    read: false,
    created_at: new Date().toISOString()
  }
];

// @desc    Obtener notificaciones
// @route   GET /api/notifications
// @access  Público (para simplificar)
router.get('/', (req, res) => {
  console.log('Solicitando notificaciones');
  res.json(DEFAULT_NOTIFICATIONS);
});

// @desc    Marcar notificación como leída
// @route   PUT /api/notifications/:id
// @access  Público (para simplificar)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { read } = req.body;
  
  console.log(`Marcando notificación ${id} como leída:`, read);
  
  // En una implementación real, esto se actualizaría en la base de datos
  res.json({ 
    success: true, 
    message: `Notificación ${id} actualizada` 
  });
});

module.exports = router; 