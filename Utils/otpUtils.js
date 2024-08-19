// otpUtils.js
const crypto = require('crypto');
const OTP = require('../Models/otpModel');
const { sendVerificationEmail } = require('../Services/emailService');

// function to send OTP via email
async function sendOTPEmail(email, otp) {
    // Send the OTP via email
    await sendVerificationEmail(email, otp);
}

// function to send OTP via SMS
async function sendOTPSMS(phoneNumber, otp) {
    console.log(`Sending OTP ${otp} to phone number: ${phoneNumber}`);
    // SMS sending logic here
}

async function generateAndSendOTP(emailOrPhoneNumber) {
    // Generate a random 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Determine if it's an email or phone number
    const isEmail = emailOrPhoneNumber.includes('@');

    // Create a new OTP record in the database
    await OTP.create({
        otp,
        email: isEmail ? emailOrPhoneNumber : null,
        phone_number: isEmail ? null : emailOrPhoneNumber,
    });

    // Send OTP via email or SMS
    if (isEmail) {
        await sendOTPEmail(emailOrPhoneNumber, otp);
    } else {
        await sendOTPSMS(emailOrPhoneNumber, otp);
    }

    return otp;
}

async function verifyOTP(emailOrPhoneNumber, otpInput) {
    const isEmail = emailOrPhoneNumber.includes('@');

    // Find the OTP record
    const otpRecord = await OTP.findOne({
        where: {
            otp: otpInput,
            [isEmail ? 'email' : 'phone_number']: emailOrPhoneNumber,
            verified: false,
        },
    });

    if (!otpRecord) {
        throw new Error('Invalid OTP');
    }

    // Check if the OTP is expired
    if (otpRecord.expires_at < new Date()) {
        throw new Error('OTP has expired');
    }

    // Mark the OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    return true;
}

module.exports = { generateAndSendOTP, verifyOTP };
