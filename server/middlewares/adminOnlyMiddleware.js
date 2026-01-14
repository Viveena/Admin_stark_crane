/**
 * Middleware to restrict access to SUPER_ADMIN and ADMIN only
 * Must be used after authMiddleware
 */
module.exports = (req, res, next) => {
  // Ensure user is authenticated (should be set by authMiddleware)
  if (!req.user || !req.user.role) {
    return res.status(401).json({ msg: 'Authentication required' });
  }

  const userRole = req.user.role;

  // Only SUPER_ADMIN and ADMIN can access
  if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
    return next();
  }

  // All other roles are denied
  return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
};
