// emailService.js
const nodemailer = require('nodemailer');

// Set up the transporter with your email service credentials
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider (Gmail, Yahoo, etc.)
    auth: {
        user: process.env.GMAIL_USER, // Your email address
        pass: process.env.GMAIL_APP_PASSWORD, // Your email password
    },
});

async function sendVerificationEmail(to, verificationCode) {
    const mailOptions = {
        from: `"${process.env.APPNAME}" <${process.env.GMAIL_USER}>`, // Sender address ${process.env.NOREPLY_EMAIL}
        to: to, // Recipient email address
        subject: 'Confirm your email address',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Confirm your email address</h2>
                <p>There’s one quick step you need to complete before creating your ${process.env.APPNAME} account. Let’s make sure this is the right email address for you — please confirm this is the right address to use for your new account.</p>
                <p><strong>Please enter this verification code to get started on ${process.env.APPNAME}:</strong></p>
                <h1 style="color: #1a73e8;">${verificationCode}</h1>
                <p>Verification codes expire after two hours.</p>
                <p>Thanks,<br>${process.env.APPNAME}</p>
                <hr>
                <p style="font-size: 12px; color: #999;">
                    <a href="#">Help</a>  |  <a href="#">Email security tips</a><br>
                    ${process.env.APPNAME}
                </p>
            </div>
        `,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
}

module.exports = { sendVerificationEmail };
