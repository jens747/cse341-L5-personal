// Import passport.js for authentication
const passport = require("passport");
// Handles communication w/Google's servers for OAuth 2.0
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Load environment variables from .env file
const dotenv = require("dotenv");
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, 
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
  // Google redirects to this endpoint in app when logged in
  callbackURL: "http://localhost:8080/auth/google/callback"
  // 
}, (accessToken, refreshToken, profile, done) => {
  // Handle user profile information here
  // console.log(profile);
  
  return done(null, profile);
}));

// Serialize user to store basic user info in the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user to get user info from session on request
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;