const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Proteger rutas
const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  console.log('Middleware de autenticación - Headers:', req.headers);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token recibido:', token.substring(0, 10) + '...');
      
      const secret = process.env.JWT_SECRET || 'yuhuhero2024secretkeyforauthentication';
      console.log('Verificando con secreto:', secret.substring(0, 5) + '...');
      
      const decoded = jwt.verify(token, secret);
      console.log('Token decodificado, ID de usuario:', decoded.id);
      
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        console.error('Usuario no encontrado en la base de datos con id:', decoded.id);
        res.status(401);
        throw new Error('Usuario no encontrado');
      }
      
      console.log('Usuario autenticado correctamente:', req.user.name);
      next();
    } catch (error) {
      console.error('Error de autenticación detallado:', error);
      res.status(401);
      throw new Error('No autorizado, token inválido');
    }
  } else {
    console.error('No se encontró token en cabecera Authorization');
    res.status(401);
    throw new Error('No autorizado, no hay token');
  }
});

module.exports = { protect };