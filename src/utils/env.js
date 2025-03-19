import { z } from 'zod';
import dotenv from 'dotenv';
import { logger } from '../loaders/pino.js';
import { validStringSchema } from './validation.js';

// Load environment variables dari .env
dotenv.config();
logger.info('✅ Environment variables loaded from .env');

// Schema validasi environment variables
const envSchema = z.object({
  PORT: validStringSchema,
  VALID_ORIGINS: validStringSchema,
  JWT_SECRET: validStringSchema,
  BASE_URL: validStringSchema,
  GOOGLE_CLIENT_ID: validStringSchema,
  GOOGLE_CLIENT_SECRET: validStringSchema,
  GOOGLE_CALLBACK_URL: validStringSchema,
  DATABASE_URL: validStringSchema,
  FRONTEND_URL: validStringSchema
});

function validateEnv() {
  const PORT = process.env.PORT ?? process.env.HOST_PORT;

  const mergedEnv = { ...process.env, PORT };

  const { data, error } = envSchema.safeParse(mergedEnv);
  if (error) {
    throw new Error(`❌ Environment validation error: ${error.message}`);
  }

  return (data);
}

// Eksekusi validasi environment variables
export const appEnv = validateEnv();