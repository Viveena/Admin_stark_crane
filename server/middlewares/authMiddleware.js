const jwt = require('jsonwebtoken');

/**
 * Authentication middleware to protect routes using JWT
 * Supports both 'x-auth-token' header and 'Authorization: Bearer <token>' header
 */
module.exports = (req, res, next) => {
  // Get token from header (support both x-auth-token and Authorization Bearer)
  let token = req.header('x-auth-token');
  
  // If no x-auth-token, try Authorization header
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
