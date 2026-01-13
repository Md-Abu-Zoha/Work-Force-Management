const mongoose = require('mongoose');

async function connectToDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
  // connection events handled by mongoose internally; bubble up errors for visibility
  return mongoose.connection;
}

module.exports = {
  connectToDatabase,
};


