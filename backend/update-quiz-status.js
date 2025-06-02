require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');

// URL de MongoDB desde index.js
const MONGO_URI = 'mongodb+srv://app:yuhuhero@clusterapp.9frrtan.mongodb.net/yuhuhero?retryWrites=true&w=majority&appName=ClusterApp';

// Número de teléfono a actualizar (parámetro desde línea de comandos)
const phoneNumber = process.argv[2] || '8112707423'; // Valor por defecto si no se proporciona

// Valor de quizCompleted (parámetro desde línea de comandos)
const quizStatus = (process.argv[3] || 'true') === 'true';

if (!phoneNumber) {
  console.error('Error: Se requiere un número de teléfono');
  process.exit(1);
}

console.log(`Intentando actualizar quizCompleted=${quizStatus} para el usuario con teléfono ${phoneNumber}`);

// Conexión a MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('🗄️  Conectado a MongoDB');
    
    try {
      // Buscar el usuario por número de teléfono
      const user = await User.findOne({ phone: phoneNumber });
      
      if (!user) {
        console.error(`Usuario con teléfono ${phoneNumber} no encontrado`);
        process.exit(1);
      }
      
      console.log('Usuario encontrado:', {
        id: user._id,
        name: user.name,
        phone: user.phone,
        quizCompletedAntes: user.quizCompleted
      });
      
      // Actualizar estado del quiz
      user.quizCompleted = quizStatus;
      await user.save();
      
      console.log(`¡Estado del quiz actualizado correctamente a: ${quizStatus}!`);
      console.log('Usuario actualizado:', {
        id: user._id,
        name: user.name,
        phone: user.phone,
        quizCompletedDespués: user.quizCompleted
      });
    } catch (error) {
      console.error('Error actualizando usuario:', error);
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