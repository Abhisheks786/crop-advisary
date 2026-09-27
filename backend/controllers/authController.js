/**
 * Auth Controller
 * 
 * Handles user registration, login, and profile.
 * Supports demo mode with pre-configured users.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DemoDataService = require('../services/DemoDataService');

const isDemoMode = () => process.env.DEMO_MODE === 'true';
const JWT_SECRET = () => process.env.JWT_SECRET || 'smart-crop-advisory-dev-secret';

/**
 * Generate JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    JWT_SECRET(),
    { expiresIn: '30d' }
  );
};

/**
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, region } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (isDemoMode()) {
      // Check if user already exists in demo
      const existing = DemoDataService.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = DemoDataService.addUser({
        name,
        email,
        password, // Not hashed in demo mode
        role: role || 'farmer',
        region
      });

      const token = generateToken(user._id, user.role);
      return res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, region: user.region }
      });
    }

    const User = require('../models/User');
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'farmer',
      region
    });

    await user.save();

    const token = generateToken(user.id, user.role);
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, region: user.region }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (isDemoMode()) {
      // Demo mode login - match against demo users
      const demoUser = DemoDataService.getUserByEmail(email);
      if (demoUser && (password === demoUser.password || password === 'password')) {
        const token = generateToken(demoUser._id, demoUser.role);
        return res.json({
          token,
          user: {
            id: demoUser._id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role
          },
          demoMode: true
        });
      }
      
      // Allow any login in demo mode with a role hint
      const role = email.includes('admin') ? 'admin' : 'farmer';
      const name = email.split('@')[0];
      const token = generateToken(`demo-${role}-${Date.now()}`, role);
      return res.json({
        token,
        user: {
          id: `demo-${role}-${Date.now()}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email,
          role
        },
        demoMode: true
      });
    }

    const User = require('../models/User');
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, region: user.region }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    if (isDemoMode()) {
      const user = DemoDataService.getUserById(req.user.id) || {
        id: req.user.id,
        name: 'Demo User',
        email: 'demo@demo.com',
        role: req.user.role || 'farmer'
      };
      return res.json({
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        region: user.region || 'Demo Region'
      });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};
