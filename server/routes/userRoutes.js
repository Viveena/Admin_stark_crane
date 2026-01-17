const express = require('express');
const { body, param } = require('express-validator');
const { createUser, getUsers, toggleUserStatus, getMe } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminOnlyMiddleware = require('../middlewares/adminOnlyMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get current user (must be before /:id routes to avoid conflict if id is checked loosely)
router.get('/me', getMe);

// All subsequent routes require admin privileges
router.use(adminOnlyMiddleware);

/**
 * POST /api/users
 * Create a new user
 */
router.post(
  '/',
  [
    body('full_name')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 255 })
      .withMessage('Full name must be between 2 and 255 characters'),
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Username must be between 3 and 100 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role_id')
      .notEmpty()
      .withMessage('Role ID is required')
      .isInt({ min: 1 })
      .withMessage('Role ID must be a valid integer'),
    body('company')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Company name must not exceed 255 characters'),
    body('country')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Country name must not exceed 100 characters'),
    body('contact')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Contact must not exceed 20 characters')
      .matches(/^[0-9+\-() ]+$/)
      .withMessage('Contact can only contain numbers, +, -, (, ), and spaces'),
  ],
  createUser
);

/**
 * GET /api/users
 * Get all users with role names and statuses
 */
router.get('/', getUsers);

/**
 * PATCH /api/users/:id/status
 * Toggle user status
 */
router.patch(
  '/:id/status',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('User ID must be a valid integer'),
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['active', 'inactive', 'suspended'])
      .withMessage('Status must be one of: active, inactive, suspended'),
  ],
  toggleUserStatus
);

module.exports = router;
