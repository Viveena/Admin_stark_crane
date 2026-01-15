const express = require('express');
const { getRoles, createRole } = require('../controllers/rolesController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminOnlyMiddleware = require('../middlewares/adminOnlyMiddleware');

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminOnlyMiddleware);

/**
 * GET /api/roles
 * List all available roles
 */
router.get('/', getRoles);

/**
 * POST /api/roles
 * Create a new role with permissions
 */
router.post(
    '/',
    [
        require('express-validator').body('roleName').notEmpty().withMessage('Role ID/Name is required')
    ],
    createRole
);

module.exports = router;
