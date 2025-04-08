import cors from 'cors';
import { appEnv } from '../utils/env.js';

const ALLOWED_ORIGINS = appEnv.VALID_ORIGINS.split(',');

export const corsOptions = {
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true
};

export default (app) => {
  app.use(cors(corsOptions));
};
