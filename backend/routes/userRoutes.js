// backend/routes/userRoutes.js
const express = require('express');
const { getUserProfile, updateUserProfile, updateQuizStatus } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// GET  /api/users/profile   ← sólo usuarios autenticados
router.get('/profile', protect, getUserProfile);

// PUT  /api/users/profile
router.put('/profile', protect, updateUserProfile);

// POST /api/users/quiz-status
router.post('/quiz-status', protect, updateQuizStatus);

module.exports = router;

