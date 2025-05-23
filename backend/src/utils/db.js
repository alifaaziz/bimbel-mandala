import { PrismaClient } from '@prisma/client';
import { appEnv } from './env.js';

const omittedTimestampFields = ({
  createdAt: true,
  updatedAt: true
});

const omitConfig = {
  user: {
    ...omittedTimestampFields,
    password: true
  },
  student: {
    ...omittedTimestampFields
  },
  tutor: {
    ...omittedTimestampFields
  },
  notification: {
    updatedAt: true,
  },
  bimbelPackage: {
    ...omittedTimestampFields
  },
  order: {
    ...omittedTimestampFields
  },
  schedule: {
    ...omittedTimestampFields
  },
  class: {
    ...omittedTimestampFields
  },
  attendance: {
    ...omittedTimestampFields
  },
};

export const prisma = new PrismaClient({
  datasourceUrl: appEnv.DATABASE_URL,
  omit: omitConfig
});