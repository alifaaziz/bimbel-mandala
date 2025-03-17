import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../utils/db.js';
import { appEnv } from '../utils/env.js';
import axios from 'axios';
import { AuthService } from '../services/auth.js';

const googleStrategy = new GoogleStrategy(
  {
    clientID: appEnv.GOOGLE_CLIENT_ID,
    clientSecret: appEnv.GOOGLE_CLIENT_SECRET,
    callbackURL: appEnv.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await prisma.user.findFirst({
        where: {
          email: profile.emails[0].value,
        },
      });

      if (user) {
        // User exists, check Google ID
        if (!user.googleId) {
          // Add Google ID to user
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: profile.id },
          });
        }

        if (user.googleId === profile.id) {
          // Generate token
          const token = await AuthService.generateToken(user.id);
          done(null, { user, token });
        } else {
          throw new Error('Google ID does not match');
        }
      } else {
        // User does not exist, register with null password and role 'siswa'
        const registerResponse = await axios.post(`${appEnv.BASE_URL}/auth/register`, {
          email: profile.emails[0].value,
          name: profile.displayName,
          password: null,
          role: 'siswa',
          googleId: profile.id,
        });

        user = registerResponse.data.user;
        // Redirect to OTP verification page
        done(null, { user, redirect: '/auth/otp' });
      }
    } catch (error) {
      done(error, null);
    }
  }
);

passport.use(googleStrategy);

passport.serializeUser((data, done) => {
    done(null, data);
});

passport.deserializeUser(async (data, done) => {
    try {
      if (data.user && data.user.id) {
        const user = await prisma.user.findUnique({ where: { id: data.user.id } });
        if (user) {
          done(null, { user, token: data.token });
        } else {
          done(null, null); // User not found, no error
        }
      } else {
        done(null, null); // Invalid user data, no error
      }
    } catch (err) {
      done(err, null);
    }
  });

export default passport;