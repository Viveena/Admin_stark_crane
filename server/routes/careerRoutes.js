const express = require('express');
const { body } = require('express-validator');
const { getAllCareers, getCareer, createCareer, updateCareer, deleteCareer } = require('../controllers/careerController');
const authMiddleware = require('../middlewares/authMiddleware');
// NOTE: Using dynamicCheckPermission might be relevant if we want to restrict to 'career' page permission
// But typically "Add Job" is a specific act. 
// We can use dynamicCheckPermission('edit') for create/update/delete if we map it to 'career' key.
const dynamicCheckPermission = require('../middlewares/dynamicPermissionMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Get All
router.get('/', dynamicCheckPermission('view', 'career'), getAllCareers);
// router.get('/', getAllCareers);

// Get Single
router.get('/:id', dynamicCheckPermission('view', 'career'), getCareer);

// Create
router.post(
    '/',
    [
        body('job_title').notEmpty().withMessage('Job title is required'),
        body('location').notEmpty().withMessage('Location is required')
    ],
    dynamicCheckPermission('edit', 'career'),
    createCareer
);

// Update
router.put('/:id', dynamicCheckPermission('edit', 'career'), updateCareer);

// Delete
router.delete('/:id', dynamicCheckPermission('edit', 'career'), deleteCareer);

module.exports = router;
