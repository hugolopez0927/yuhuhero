const mongoose = require('mongoose');

// Usamos la misma URI del backend
const MONGO_URI = 'mongodb+srv://app:yuhuhero@clusterapp.9frrtan.mongodb.net/yuhuhero?retryWrites=true&w=majority&appName=ClusterApp';

async function cleanupDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('🗄️  Conectado a MongoDB');

    // Obtener la colección users
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Obtener información de índices
    console.log('📋 Índices actuales:');
    const indexes = await usersCollection.indexes();
    console.log(indexes);

    // Eliminar índice problemático del email si existe
    try {
      await usersCollection.dropIndex('email_1');
      console.log('✅ Índice email_1 eliminado');
    } catch (error) {
      console.log('ℹ️  Índice email_1 no existe o ya fue eliminado');
    }

    // Limpiar todos los documentos (opcional)
    const result = await usersCollection.deleteMany({});
    console.log(`🗑️  ${result.deletedCount} usuarios eliminados`);

    // Crear índice correcto para phone
    await usersCollection.createIndex({ phone: 1 }, { unique: true });
    console.log('✅ Índice único para phone creado');

    console.log('🎉 Base de datos limpia y lista');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

cleanupDatabase(); 