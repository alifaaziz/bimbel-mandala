import { PrismaClient } from '@prisma/client';
import { appEnv } from './env.js';

/** @import {Prisma} from '@prisma/client' */
/** @import {ModelName} from './types/prisma.js' */

const omittedTimestampFields = /** @type {const} */ ({
  createdAt: true,
  updatedAt: true
});

/** @satisfies {Prisma.GlobalOmitConfig} */
const omitConfig = {
  user: {
    ...omittedTimestampFields,
    password: true
  },
  // account: {
  //   ...omittedTimestampFields,
  //   userId: true
  // },
  // transaction: {
  //   ...omittedTimestampFields,
  //   senderAccountId: true,
  //   receiverAccountId: true
  // }
};

export const prisma = new PrismaClient({
  datasourceUrl: appEnv.DATABASE_URL,
  omit: omitConfig
});

/** @typedef {typeof prisma} GeneratedPrismaClient */

/**
 * @template {ModelName} Model
 * @typedef {NonNullable<
 *   Awaited<ReturnType<GeneratedPrismaClient[Model]['findUnique']>>
 * >} OmittedModel
 */
