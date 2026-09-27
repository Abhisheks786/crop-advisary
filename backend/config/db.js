const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (process.env.DEMO_MODE === 'true') {
      console.log('⚡ Running in Demo Mode - MongoDB not required');
      return null;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Falling back to Demo Mode');
    process.env.DEMO_MODE = 'true';
    return null;
  }
};

module.exports = connectDB;
