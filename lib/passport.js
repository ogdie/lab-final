import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/user.js';

// Google OAuth Strategy (only register if env vars present)
const hasGoogleCreds = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
if (!hasGoogleCreds) {
  console.warn('[OAuth] GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET missing. Google login disabled.');
}
if (hasGoogleCreds) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? `${process.env.BASE_URL}/auth/google/callback`
      : "http://localhost:3000/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'google' });
    
    if (user) {
      return done(null, user);
    }

    // Check if user exists with this email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Link OAuth account to existing user
      user.oauthId = profile.id;
      user.oauthProvider = 'google';
      await user.save();
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      oauthId: profile.id,
      oauthProvider: 'google',
      profilePicture: profile.photos[0]?.value || '',
      userType: 'Estudante' // Default user type
    });

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
  }));
}

// GitHub OAuth Strategy (only register if env vars present)
const hasGithubCreds = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
if (!hasGithubCreds) {
  console.warn('[OAuth] GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET missing. GitHub login disabled.');
}
if (hasGithubCreds) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? `${process.env.BASE_URL}/auth/github/callback`
      : "http://localhost:3000/auth/github/callback"
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this GitHub ID
    let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'github' });
    
    if (user) {
      return done(null, user);
    }

    // Check if user exists with this email
    const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;
    user = await User.findOne({ email });
    
    if (user) {
      // Link OAuth account to existing user
      user.oauthId = profile.id;
      user.oauthProvider = 'github';
      await user.save();
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      name: profile.displayName || profile.username,
      email: email,
      oauthId: profile.id,
      oauthProvider: 'github',
      profilePicture: profile.photos[0]?.value || '',
      userType: 'Estudante' // Default user type
    });

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
  }));
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

