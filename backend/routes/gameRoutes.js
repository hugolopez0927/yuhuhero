const express = require('express');
const router = express.Router();

// Datos de ejemplo para el mapa del juego
const DEFAULT_GAME_MAP = {
  tiles: [
    {
      id: "tile-1",
      title: "Introducción a Finanzas",
      description: "Aprende los conceptos básicos de finanzas",
      position_x: 0,
      position_y: 0,
      type: "quiz",
      rewards: 50,
      mission_id: "finance-intro"
    },
    {
      id: "tile-2",
      title: "Presupuesto Personal",
      description: "Aprende a crear un presupuesto personal",
      position_x: 1,
      position_y: 1,
      type: "lesson",
      rewards: 30,
      mission_id: "personal-budget"
    },
    {
      id: "tile-3",
      title: "Ahorro",
      description: "Descubre estrategias de ahorro efectivas",
      position_x: 2,
      position_y: 0,
      type: "challenge",
      rewards: 70,
      mission_id: "saving-strategies"
    },
    {
      id: "tile-4",
      title: "Inversión Básica",
      description: "Conoce los fundamentos de la inversión",
      position_x: 3,
      position_y: 1,
      type: "lesson",
      rewards: 40,
      mission_id: "investment-basics"
    },
    {
      id: "tile-5",
      title: "Deudas Inteligentes",
      description: "Aprende a manejar tus deudas",
      position_x: 4,
      position_y: 0,
      type: "quiz",
      rewards: 60,
      mission_id: "smart-debt"
    }
  ]
};

// Progreso por defecto
const DEFAULT_GAME_PROGRESS = {
  current_level: 1,
  coins: 0,
  completed_levels: []
};

// @desc    Obtener mapa del juego
// @route   GET /api/game/map
// @access  Público (para simplificar)
router.get('/map', (req, res) => {
  console.log('Solicitando mapa del juego');
  res.json(DEFAULT_GAME_MAP);
});

// @desc    Obtener progreso del juego
// @route   GET /api/game/progress
// @access  Público (para simplificar)
router.get('/progress', (req, res) => {
  console.log('Solicitando progreso del juego');
  res.json(DEFAULT_GAME_PROGRESS);
});

// @desc    Actualizar progreso del juego
// @route   PUT /api/game/progress
// @access  Público (para simplificar)
router.put('/progress', (req, res) => {
  const { current_level, coins, completed_levels } = req.body;
  
  console.log('Actualizando progreso del juego:', { current_level, coins, completed_levels });
  
  // En una implementación real, esto se guardaría en la base de datos
  const updatedProgress = {
    current_level: current_level || DEFAULT_GAME_PROGRESS.current_level,
    coins: coins || DEFAULT_GAME_PROGRESS.coins,
    completed_levels: completed_levels || DEFAULT_GAME_PROGRESS.completed_levels
  };
  
  res.json(updatedProgress);
});

module.exports = router; 