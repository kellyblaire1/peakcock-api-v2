const User = require('../Models/userModel');
const { hashPassword, comparePassword } = require('../Utils/passwordUtils');
const { generateToken, verifyToken } = require('../Utils/jwt');
const { sendVerificationOTP } = require('../Services/emailService');
const { createAvatar } = require('../Services/avatarService');
const crypto = require('crypto');
const { generateUsernameFromName } = require('../Utils/functionUtils');
const { generateAndSendOTP, verifyOTP } = require('../Utils/otpUtils');


class AuthController {
    static async register(req, res) {
        const { name, email, password, signupType } = req.body;

        try {
            // Check if the user already exists
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) return res.status(400).json({ message: 'Email already in use' });

            // Generate a username from the user's name
            const generatedUsername = generateUsernameFromName(name);

            // Check if the user already exists
            const usernameExists = await User.findOne({ where: { generatedUsername } });
            if (usernameExists) return res.status(400).json({ message: 'Username already in use' });

            // Create a new user
            const hashedPassword = await hashPassword(password);
            const avatar = createAvatar(name);

            const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
            const otp_expiration = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes

            const user = await User.create({
                name,
                email,
                generatedUsername,
                password: hashedPassword,
                username,
                profile_photo: avatar,
                account_status: 'inactive',
                email_verified: false,
                otp,
                otp_expiration
            });

            // Send OTP via email
            await sendVerificationOTP(user.firstname, user.email, otp);

            res.status(201).json({ message: 'Account registered, please verify your email with the OTP sent' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Registration failed. Please try again later.' });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.email_verified) return res.status(400).json({ message: 'Email not verified' });

        const token = generateToken({ id: user.id, email: user.email });
        res.status(200).json({ token });
    }

    static async verifyEmail(req, res) {
        const { token } = req.query;
        try {
            const decoded = verifyToken(token);
            const user = await User.findByPk(decoded.id);
            if (!user) return res.status(400).json({ message: 'Invalid token' });

            user.email_verified = true;
            await user.save();

            res.status(200).json({ message: 'Email verified successfully' });
        } catch (error) {
            res.status(400).json({ message: 'Invalid or expired token' });
        }
    }

    static async resetPassword(req, res) {
        const { email, otp, newPassword } = req.body;

        try {
            // Find the user by email
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(400).json({ message: 'User not found' });

            // Verify the OTP
            if (user.otp !== otp || Date.now() > user.otp_expiration) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
            }

            // Hash the new password
            const hashedPassword = await hashPassword(newPassword);

            // Update the user's password
            user.password = hashedPassword;
            user.otp = null; // Clear the OTP after successful reset
            user.otp_expiration = null; // Clear the OTP expiration time
            user.email_verified = true;
            await user.save();

            res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async resendVerificationCode(req, res) {
        const { email } = req.body;

        try {
            // Find the user by email
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(400).json({ message: 'User not found' });

            if (user.email_verified) {
                return res.status(400).json({ message: 'Email already verified' });
            }

            // Send the verification email with a new OTP
            const otp = await sendVerificationEmail(user.email);

            // Save the new OTP and its expiration time to the user record
            user.otp = otp;
            user.otp_expiration = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes
            await user.save();

            res.status(200).json({ message: 'Verification code resent' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async forgotPassword(req, res) {
        const { email } = req.body;

        try {
            // Find the user by email
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(400).json({ message: 'User not found' });

            // Generate OTP and OTP expiration
            const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
            const otp_expiration = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes

            // Save OTP and expiration in the database
            user.otp = otp;
            user.otp_expiration = otp_expiration;
            user.email_verified = false; // Optional: Mark email as not verified
            await user.save();

            // Send OTP to user
            await sendVerificationOTP(user.firstname, user.email, otp);

            res.status(200).json({ message: 'Check your email for your OTP.' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    
    static async sendOTP(req, res) {
        const { emailOrPhoneNumber } = req.body;

        try {
            await generateAndSendOTP(emailOrPhoneNumber);
            res.status(200).json({ message: 'OTP sent successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async verifyOTP(req, res) {
        const { emailOrPhoneNumber, otp } = req.body;

        try {
            await verifyOTP(emailOrPhoneNumber, otp);
            res.status(200).json({ message: 'OTP verified successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = AuthController;
