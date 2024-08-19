const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

// Middleware to authenticate users
exports.authenticate = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    if (!req.user) return res.status(404).json({ error: 'User not found' });
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to authorize authenticated users
// exports.authorizeAuthUser = (req, res, next) => {
//   if (req.user !== '') return res.status(403).json({ error: 'Access denied' });
//   next();
// };

// Middleware to authorize authenticated admins
exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin' || req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  next();
};
