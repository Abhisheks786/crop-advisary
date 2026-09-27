require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initRedis } = require('./config/redis');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Initialize database and cache connections
const initialize = async () => {
  // Connect to MongoDB (falls back to demo mode if unavailable)
  await connectDB();

  // Initialize Redis (gracefully handles unavailability)
  await initRedis();

  const isDemoMode = process.env.DEMO_MODE === 'true';
  if (isDemoMode) {
    console.log('\n🌾 Running in DEMO MODE — Using Offline Dataset');
    console.log('   MongoDB and Redis are not required\n');
  }
};

initialize();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/regions', require('./routes/regionRoutes'));
app.use('/api/irrigation', require('./routes/irrigationRoutes'));
app.use('/api/rotation', require('./routes/rotationRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Crop Advisory & Resource Planner API',
    demoMode: process.env.DEMO_MODE === 'true',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      recommendations: '/api/recommendations',
      crops: '/api/crops',
      regions: '/api/regions',
      irrigation: '/api/irrigation',
      rotation: '/api/rotation',
      dashboard: '/api/dashboard',
      admin: '/api/admin'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    demoMode: process.env.DEMO_MODE === 'true',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
