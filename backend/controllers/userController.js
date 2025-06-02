const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generar un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'yuhuhero2024secretkeyforauthentication', {
    expiresIn: '30d',
  });
};

// @desc    Obtener perfil de usuario
// @route   GET /api/users/profile
// @access  Privado
const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user; // seteado en authMiddleware
  if (user) {
    res.json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      quizCompleted: user.quizCompleted,
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Actualizar perfil de usuario
// @route   PUT /api/users/profile
// @access  Privado
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.body.quizCompleted !== undefined) {
      user.quizCompleted = req.body.quizCompleted;
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      quizCompleted: updatedUser.quizCompleted,
      token: generateToken(updatedUser._id), // renovar token
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Actualizar estado del quiz
// @route   POST /api/users/quiz-status
// @access  Privado
const updateQuizStatus = asyncHandler(async (req, res) => {
  const user = req.user;
  
  console.log('Solicitud de actualización de quiz recibida');
  console.log('Usuario:', user?._id);
  console.log('Datos recibidos:', req.body);
  
  if (user) {
    user.quizCompleted = req.body.completed;
    
    console.log('Actualizando quizCompleted a:', req.body.completed);
    
    try {
      const updatedUser = await user.save();
      console.log('Usuario actualizado correctamente:', {
        id: updatedUser._id,
        quizCompleted: updatedUser.quizCompleted
      });
      
      res.json({ 
        success: true,
        message: 'Estado del quiz actualizado correctamente',
        quizCompleted: updatedUser.quizCompleted
      });
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      res.status(500);
      throw new Error('Error al actualizar estado del quiz');
    }
  } else {
    console.error('Usuario no encontrado para actualizar estado del quiz');
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

module.exports = { getUserProfile, updateUserProfile, updateQuizStatus };