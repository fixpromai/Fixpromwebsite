const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Sign Up
router.post('/request-signup-otp', authController.requestSignupOtp);
router.post('/verify-signup-otp', authController.verifySignupOtp);
router.post('/resend-signup-otp', authController.resendSignupOtp);

// Login
router.post('/signin', authController.signin);

// Forgot Password
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-forgot-otp', authController.verifyForgotOtp);
router.post('/reset-password', authController.resetPassword);


router.get('/check-login', authController.checkLoginStatus); // used by signup.js
router.get('/check', authController.check); // used by signin.js, sessionCheck.js

router.get('/logout', authController.logout);

module.exports = router;
