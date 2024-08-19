// middleware/authMiddleware.js
const passport = require('passport');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    // Find or create user logic
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    // Find or create user logic
}));

module.exports = passport;
