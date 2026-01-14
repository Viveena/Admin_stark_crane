const db = require('../config/db');

/**
 * Permission middleware factory
 * Checks if the authenticated user has permission to perform an action on a specific page
 * 
 * @param {string} pageKey - The page key to check permissions for
 * @param {string} action - The action to check ('view' or 'edit')
 * @returns {Function} Express middleware function
 * 
 * Usage:
 * router.get('/page', authMiddleware, checkPermission('Home', 'view'), controller.getPage);
 * router.put('/page', authMiddleware, checkPermission('Home', 'edit'), controller.updatePage);
 */
const checkPermission = (pageKey, action) => {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated (should be set by authMiddleware)
      if (!req.user || !req.user.id || !req.user.role) {
        return res.status(401).json({ msg: 'Authentication required' });
      }

      const userRole = req.user.role;

      // SUPER_ADMIN and ADMIN get full access automatically
      if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
        return next();
      }

      // Validate action parameter
      if (action !== 'view' && action !== 'edit') {
        return res.status(500).json({ msg: 'Invalid action. Must be "view" or "edit"' });
      }

      // For USER role, strictly enforce permissions from database
      if (userRole === 'USER') {
        // Get role_id from role name
        const [roles] = await db.query('SELECT id FROM roles WHERE name = ?', [userRole]);
        
        if (roles.length === 0) {
          return res.status(403).json({ msg: 'Role not found. Access denied.' });
        }

        const roleId = roles[0].id;

        // Check permission in role_permissions table
        const [permissions] = await db.query(
          'SELECT can_view, can_edit FROM role_permissions WHERE role_id = ? AND page_key = ?',
          [roleId, pageKey]
        );

        // If no permission record exists, deny access
        if (permissions.length === 0) {
          return res.status(403).json({ 
            msg: `No permission found for ${pageKey}. Access denied.` 
          });
        }

        const permission = permissions[0];
        const hasViewPermission = Boolean(permission.can_view);
        const hasEditPermission = Boolean(permission.can_edit);

        // Check specific action permission
        if (action === 'view' && !hasViewPermission) {
          return res.status(403).json({ 
            msg: `View permission denied for ${pageKey}.` 
          });
        }

        if (action === 'edit' && !hasEditPermission) {
          return res.status(403).json({ 
            msg: `Edit permission denied for ${pageKey}.` 
          });
        }

        // Permission granted
        return next();
      }

      // For any other role (including 'guest'), deny access
      return res.status(403).json({ msg: 'Access denied. Insufficient permissions.' });

    } catch (error) {
      console.error('Error checking permissions:', error);
      return res.status(500).json({ msg: 'Server error while checking permissions' });
    }
  };
};

module.exports = checkPermission;
