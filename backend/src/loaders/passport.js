import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../utils/db.js';
import { appEnv } from '../utils/env.js';
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
          done(null, { user, token, isNew: false }); // <-- tambahkan isNew
        } else {
          throw new Error('Google ID does not match');
        }
      } else {
        // User does not exist, register with null password and role 'siswa'
        user = await prisma.user.create({
          data: {
            email: profile.emails[0].value,
            name: profile.displayName,
            password: null,
            role: 'siswa',
            googleId: profile.id,
            verified: true,
          }
        });
        await prisma.student.create({
          data: { userId: user.id }
        });
        const token = await AuthService.generateToken(user.id);
        done(null, { user, token, isNew: true }); // <-- tambahkan isNew
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
          done(null, null);
        }
      } else {
        done(null, null);
      }
    } catch (err) {
      done(err, null);
    }
  });

export default passport;