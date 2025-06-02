// backend/check-users.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');

// URL de MongoDB desde index.js
const MONGO_URI = 'mongodb+srv://app:yuhuhero@clusterapp.9frrtan.mongodb.net/yuhuhero?retryWrites=true&w=majority&appName=ClusterApp';

// Conexión a MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('🗄️  Conectado a MongoDB');
    
    try {
      // Consultar todos los usuarios
      const users = await User.find({}).select('-password');
      
      console.log('=== Usuarios registrados ===');
      
      if (users.length === 0) {
        console.log('No hay usuarios registrados');
      } else {
        users.forEach(user => {
          console.log(`ID: ${user._id}`);
          console.log(`Nombre: ${user.name}`);
          console.log(`Teléfono: ${user.phone}`);
          console.log(`Quiz completado: ${user.quizCompleted ? 'Sí' : 'No'}`);
          console.log(`Creado: ${user.createdAt}`);
          console.log('----------------------------');
        });
        
        console.log(`Total: ${users.length} usuarios`);
      }
    } catch (error) {
      console.error('Error consultando usuarios:', error);
    } finally {
      // Cerrar conexión
      mongoose.connection.close();
      console.log('Conexión cerrada');
    }
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1);
  }); 