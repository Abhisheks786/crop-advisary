const adminAuth = (req, res, next) => {
  const DEMO_MODE = process.env.DEMO_MODE === 'true';

  if (DEMO_MODE) {
    return next();
  }

  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
};

module.exports = adminAuth;
