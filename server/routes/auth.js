const express = require('express');
const { body } = require('express-validator');
const { login, verifyOtp, resendOtp } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').custom((value) => {
      if (value === 'superamin') return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }).withMessage('Please enter a valid email or superadmin ID.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
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
