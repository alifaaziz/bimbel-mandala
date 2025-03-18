import cors from './cors.js';
import pino from './pino.js';
import common from './common.js';
import passport from './passport.js';
import expressSession from 'express-session';

export default (app, server) => {
  cors(app);
  pino(app);
  common(app);

  app.use(expressSession({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());
};