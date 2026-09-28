const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is required'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is missing'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('[Auth] JWT_SECRET is not configured');
      return res.status(500).json({
        success: false,
        message: 'Server authentication is not configured'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account was not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth] Token error:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = { protect };
