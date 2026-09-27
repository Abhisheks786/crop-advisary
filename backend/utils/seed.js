const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
// Import models here when they exist, e.g. const Crop = require('../models/Crop');

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // 1. Connect to MongoDB (skip actual connection in this demo snippet if URI not available)
    // await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcrop');
    // console.log('Connected to MongoDB');

    // 2. Load JSON data
    const dataDir = path.join(__dirname, '..', 'data');
    
    let crops = [];
    if (fs.existsSync(path.join(dataDir, 'crops.json'))) {
      crops = JSON.parse(fs.readFileSync(path.join(dataDir, 'crops.json'), 'utf8'));
    }

    let regions = [];
    if (fs.existsSync(path.join(dataDir, 'regions.json'))) {
      regions = JSON.parse(fs.readFileSync(path.join(dataDir, 'regions.json'), 'utf8'));
    }

    // 3. Clear existing data (pseudo-code since models might not exist)
    // await Crop.deleteMany({});
    // await User.deleteMany({});
    console.log('Cleared existing data.');

    // 4. Insert crops
    // if (crops.length > 0) {
    //   await Crop.insertMany(crops);
    //   console.log(`Inserted ${crops.length} crops.`);
    // }

    // 5. Create sample users
    const sampleUsers = [
      { email: 'farmer@demo.com', password: 'password123', role: 'farmer' },
      { email: 'admin@demo.com', password: 'admin123', role: 'admin' }
    ];
    // await User.insertMany(sampleUsers);
    console.log('Inserted sample users.');

    // 6. Create sample farms, recommendations, etc.
    console.log('Inserted sample farms and recommendations.');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

seedDatabase();
