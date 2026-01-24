const db = require('../config/db');

/**
 * Dynamic permission middleware that extracts pageKey from route params
 * and checks if the authenticated user has permission to perform an action
 * 
 * @param {string} action - The action to check ('view' or 'edit')
 * @returns {Function} Express middleware function
 * 
 * Usage:
 * router.get('/:pageKey', authMiddleware, dynamicCheckPermission('view'), controller.getPage);
 * router.put('/:pageKey', authMiddleware, dynamicCheckPermission('edit'), controller.updatePage);
 */
const dynamicCheckPermission = (action, explicitPageKey) => {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated (should be set by authMiddleware)
      if (!req.user || !req.user.id || !req.user.role) {
        return res.status(401).json({ msg: 'Authentication required' });
      }

      // Extract pageKey from route params or use explicit passed key
      const pageKey = explicitPageKey || req.params.pageKey;
      if (!pageKey) {
        return res.status(400).json({ msg: 'Page key is required' });
      }

      const userRole = req.user.role;
      console.log(`[Permission Check] User: ${req.user.id}, Role: ${userRole}, Page: ${pageKey}, Action: ${action}`);

      // SUPER_ADMIN and ADMIN get full access automatically
      if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
        return next();
      }

      // Validate action parameter
      if (action !== 'view' && action !== 'edit') {
        return res.status(500).json({ msg: 'Invalid action. Must be "view" or "edit"' });
      }

      // For any non-admin role, strictly enforce permissions from database
      if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
        // Get role_id from role name
        const [roles] = await db.query('SELECT id FROM roles WHERE name = ?', [userRole]);

        if (roles.length === 0) {
          return res.status(403).json({ msg: 'Role not found. Access denied.' });
        }

        const roleId = roles[0].id;

        // Check permission in role_permissions table
        // Changed column names to match DB schema (can_read, can_create) and page_key
        const [permissions] = await db.query(
          'SELECT can_read, can_create FROM role_permissions WHERE role_id = ? AND page_key = ?',
          [roleId, pageKey]
        );

        // If no permission record exists, deny access
        if (permissions.length === 0) {
          return res.status(403).json({
            msg: `No permission found for ${pageKey}. Access denied.`
          });
        }

        const permission = permissions[0];
        const hasViewPermission = Boolean(permission.can_read);
        const hasEditPermission = Boolean(permission.can_create);

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

    } catch (error) {
      console.error('Error checking permissions:', error);
      return res.status(500).json({ msg: 'Server error while checking permissions' });
    }
  };
};

module.exports = dynamicCheckPermission;
