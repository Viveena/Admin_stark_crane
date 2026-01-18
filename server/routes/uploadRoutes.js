const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect upload route - only authenticated users can upload
router.post('/image', authMiddleware, uploadController.uploadImage, uploadController.handleUpload);

module.exports = router;
