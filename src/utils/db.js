import { PrismaClient } from '@prisma/client';
import { appEnv } from './env.js';
import order from '../routes/order.js';

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
};

export const prisma = new PrismaClient({
  datasourceUrl: appEnv.DATABASE_URL,
  omit: omitConfig
});