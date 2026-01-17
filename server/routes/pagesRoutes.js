const express = require('express');
const { body, param } = require('express-validator');
const { getAllPages, getPage, updatePage, toggleVisibility } = require('../controllers/pagesController');
const authMiddleware = require('../middlewares/authMiddleware');
const dynamicCheckPermission = require('../middlewares/dynamicPermissionMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);


/**
 * GET /api/pages
 * Fetch all pages
 * Requires authentication
 */
router.get('/', getAllPages);

/**
 * GET /api/pages/:pageKey
 * Fetch page content and visibility
 * Requires 'view' permission
 */
router.get(
  '/:pageKey',
  [
    param('pageKey')
      .trim()
      .notEmpty()
      .withMessage('Page key is required')
      .isLength({ max: 100 })
      .withMessage('Page key must not exceed 100 characters'),
  ],
  // Remove dynamicCheckPermission for fetching single page details if it's general access, 
  // OR keep it if specifics are needed. Assuming keeping it is correct for now.
  dynamicCheckPermission('view'),
  getPage
);

/**
 * PUT /api/pages/:pageKey
 * Update page content (content_json and image_url)
 * Requires 'edit' permission
 */
router.put(
  '/:pageKey',
  [
    param('pageKey')
      .trim()
      .notEmpty()
      .withMessage('Page key is required')
      .isLength({ max: 100 })
      .withMessage('Page key must not exceed 100 characters'),
    body('content_json')
      .optional()
      .custom((value) => {
        // Allow null, object, or valid JSON string
        if (value === null) return true;
        if (typeof value === 'object') return true;
        if (typeof value === 'string') {
          try {
            JSON.parse(value);
            return true;
          } catch {
            return false;
          }
        }
        return false;
      })
      .withMessage('content_json must be a valid JSON object, JSON string, or null'),
    body('image_url')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Image URL must not exceed 500 characters')
      .isURL()
      .withMessage('Image URL must be a valid URL'),
  ],
  dynamicCheckPermission('edit'),
  updatePage
);

/**
 * PATCH /api/pages/:pageKey/visibility
 * Toggle page visibility
 * Requires 'edit' permission
 */
router.patch(
  '/:pageKey/visibility',
  [
    param('pageKey')
      .trim()
      .notEmpty()
      .withMessage('Page key is required')
      .isLength({ max: 100 })
      .withMessage('Page key must not exceed 100 characters'),
  ],
  dynamicCheckPermission('edit'),
  toggleVisibility
);

module.exports = router;
