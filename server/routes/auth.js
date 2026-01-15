const express = require('express');
const { body } = require('express-validator');
const { login, verifyOtp, resendOtp } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').custom((value) => {
      // Allow bypass credentials
      if (value === 'superadmin' || value === 'superadmin@starkcrane.com') return true;
      if (value === 'admin' || value === 'admin@starkcrane.com') return true;
      // Validate email format
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }).withMessage('Please enter a valid email or admin ID.'),
    body('password').custom((value) => {
      // Allow shorter passwords for bypass (superadmin/admin)
      if (value === 'superadmin' || value === 'admin') return true;
      // Regular password validation
      return value && value.length >= 6;
    }).withMessage('Password must be at least 6 characters long.'),
  ],
  login
);

router.post(
  '/verify-otp',
  [
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.'),
  ],
  verifyOtp
);

router.post(
  '/resend-otp',
  [
    body('email').isEmail().withMessage('Please enter a valid email.'),
  ],
  resendOtp
);

module.exports = router;
