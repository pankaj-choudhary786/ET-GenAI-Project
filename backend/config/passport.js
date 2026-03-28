import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'MISSING_GOOGLE_CLIENT_ID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'MISSING_GOOGLE_CLIENT_SECRET',
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ 
          $or: [
            { googleId: profile.id }, 
            { email: profile.emails[0].value }
          ]
        });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        } else {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: profile.photos[0].value,
            password: null, // No password for OAuth users
            role: "user",
            plan: "free",
            agentPreferences: {
              prospecting: { autoSend: false, minIcpScore: 60 },
              dealIntel: { riskAlertThreshold: 70 },
              retention: { churnEscalateThreshold: 75 },
              competitive: { trackedCompetitors: [] }
            },
            notificationPrefs: {
              emailAlerts: true, slackAlerts: false, dailySummary: true, weeklyReport: true
            },
            connectedIntegrations: {
              hubspot: false, salesforce: false, gmail: false, slack: false
            }
          });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Required for express-session integration with passport
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
