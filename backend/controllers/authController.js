const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Generar un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'yuhuhero2024secretkeyforauthentication', {
    expiresIn: '30d',
  });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Público
const registerUser = asyncHandler(async (req, res) => {
  const { name, phone, password } = req.body;

  // Validaciones básicas
  if (!name || !phone || !password) {
    res.status(400);
    throw new Error('Por favor completa todos los campos');
  }

  const userExists = await User.findOne({ phone });
  if (userExists) {
    res.status(400);
    throw new Error('Usuario ya registrado con este número de teléfono');
  }

  const user = await User.create({ name, phone, password });

  if (user) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      quizCompleted: user.quizCompleted,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Datos inválidos');
  }
});

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Público
const loginUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    console.log('Login exitoso para:', user.name);
    console.log('Token generado:', token.substring(0, 10) + '...');
    
    res.json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      quizCompleted: user.quizCompleted,
      token: token,
    });
  } else {
    console.log('Intento de login fallido para:', phone);
    res.status(401);
    throw new Error('Credenciales inválidas');
  }
});

module.exports = { registerUser, loginUser };