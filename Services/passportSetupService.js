// passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./Models/userModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    // Handle Google OAuth callback
    const existingUser = await User.findOne({ where: { socialId: profile.id, socialProvider: 'google' } });
    if (existingUser) {
        return done(null, existingUser);
    }
    const newUser = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        socialId: profile.id,
        socialProvider: 'google',
        signupType: 'social'
    });
    done(null, newUser);
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
    // Handle Facebook OAuth callback
    const existingUser = await User.findOne({ where: { socialId: profile.id, socialProvider: 'facebook' } });
    if (existingUser) {
        return done(null, existingUser);
    }
    const newUser = await User.create({
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.emails[0].value,
        socialId: profile.id,
        socialProvider: 'facebook',
        signupType: 'social'
    });
    done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findByPk(id);
    done(null, user);
});
