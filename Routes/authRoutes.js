const express = require('express');
const passport = require('passport');
const AuthController = require('../Controllers/authController');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
// router.post('/verify-otp', AuthController.verifyOtp);
router.post('/reset-password', AuthController.resetPassword);
router.post('/resend-verification-code', AuthController.resendVerificationCode);
router.post('/send-otp', AuthController.sendOTP);
router.post('/verify-otp', AuthController.verifyOTP);

// Google OAuth Routes
router.post('/google', passport.authenticate('google-id-token', { session: false }), (req, res) => {
    res.json({ message: 'Google login successful', user: req.user });
});

// Facebook OAuth Routes
router.post('/facebook', passport.authenticate('facebook-token', { session: false }), (req, res) => {
    res.json({ message: 'Facebook login successful', user: req.user });
});

module.exports = router;
