const express = require('express');
const { body, param } = require('express-validator');
const { getRolePermissions, updateRolePermissions } = require('../controllers/rolesController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminOnlyMiddleware = require('../middlewares/adminOnlyMiddleware');

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminOnlyMiddleware);

/**
 * GET /api/permissions/:roleId
 * Get full permission matrix for a specific role
 */
router.get(
  '/:roleId',
  [
    param('roleId')
      .isInt({ min: 1 })
      .withMessage('Role ID must be a valid positive integer'),
  ],
  getRolePermissions
);

/**
 * PUT /api/permissions/:roleId
 * Update role permissions
 */
router.put(
  '/:roleId',
  [
    param('roleId')
      .isInt({ min: 1 })
      .withMessage('Role ID must be a valid positive integer'),
    body('permissions')
      .isArray({ min: 0 })
      .withMessage('Permissions must be an array')
      .custom((permissions) => {
        if (!Array.isArray(permissions)) return false;
        
        for (const perm of permissions) {
          if (!perm.page_key || typeof perm.page_key !== 'string') {
            return false;
          }
          if (typeof perm.can_view !== 'boolean') {
            return false;
          }
          if (typeof perm.can_edit !== 'boolean') {
            return false;
          }
        }
        return true;
      })
      .withMessage('Each permission must have page_key (string), can_view (boolean), and can_edit (boolean)'),
  ],
  updateRolePermissions
);

module.exports = router;
