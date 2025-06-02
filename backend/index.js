// backend/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importa tus rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');

const app = express();

// --- Middlewares globales
// Configuración de CORS más explícita
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Manejador para depuración de rutas - muestra todas las solicitudes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// --- Rutas montadas
app.use('/api/auth', authRoutes);    // POST /api/auth/register, /api/auth/login
app.use('/api/users', userRoutes);   // GET/PUT /api/users/profile (protegida)

// (Opcional) ruta raíz de prueba
app.get('/', (req, res) => res.send('🛠️  API YuhuHero funcionando'));

// --- Conexión a MongoDB y arranque del servidor
// Usamos directamente la cadena de conexión para evitar problemas con .env
const PORT = 5001; // Cambio a puerto 5001 para evitar conflictos
const MONGO_URI = 'mongodb+srv://app:yuhuhero@clusterapp.9frrtan.mongodb.net/yuhuhero?retryWrites=true&w=majority&appName=ClusterApp';
const JWT_SECRET = process.env.JWT_SECRET || 'yuhuhero2024secretkeyforauthentication';

// Asegurar que process.env.JWT_SECRET está disponible para otros módulos
process.env.JWT_SECRET = JWT_SECRET;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('🗄️  Conectado a MongoDB');
    app.listen(PORT, () =>
      console.log(`🚀  Server escuchando en http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1);
  });



