const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const DEMO_MODE = process.env.DEMO_MODE === 'true';
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (DEMO_MODE && !token) {
    req.user = { id: 'demo_user_123', role: 'farmer', email: 'farmer@demo.com' };
    return next();
  }

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (err) {
    if (DEMO_MODE) {
      req.user = { id: 'demo_user_123', role: 'farmer', email: 'farmer@demo.com' };
      return next();
    }
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth;
