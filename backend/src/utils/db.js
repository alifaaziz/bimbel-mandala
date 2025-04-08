import { PrismaClient } from '@prisma/client';
import { appEnv } from './env.js';
import order from '../routes/order.js';
import { schedule } from 'node-cron';

const omittedTimestampFields = ({
  createdAt: true,
  updatedAt: true
});

const omitConfig = {
  user: {
    ...omittedTimestampFields,
    password: true
  },
  notification: {
    ...omittedTimestampFields
  },
  bimbelPackage: {
    ...omittedTimestampFields
  },
  order: {
    ...omittedTimestampFields
  },
  schedule
};

export const prisma = new PrismaClient({
  datasourceUrl: appEnv.DATABASE_URL,
  omit: omitConfig
});