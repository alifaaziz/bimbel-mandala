import { jest } from '@jest/globals';
import { Prisma } from '@prisma/client';

/** @import {ModelName,ModelAction} from './types/prisma.js' */

/**
 * @typedef {{
 *   [Model in ModelName]: {
 *     [Action in ModelAction]: jest.Mock;
 *   };
 * }} PrismaMock
 */

/** @typedef {{ prisma: PrismaMock & { $transaction: jest.Mock } }} GeneratedPrismaMock */

/** @returns {GeneratedPrismaMock} */
export function generatePrismaMock() {
  const modelsName = /** @type {ModelName[]} */ (
    Prisma.dmmf.datamodel.models.map(({ name }) => name.toLowerCase())
  );

  /** @type {Record<ModelAction, jest.Mock>} */
  const modelOperation = {
    count: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
    groupBy: jest.fn(),
    findMany: jest.fn(),
    aggregate: jest.fn(),
    findFirst: jest.fn(),
    updateMany: jest.fn(),
    createMany: jest.fn(),
    deleteMany: jest.fn(),
    findUnique: jest.fn(),
    findFirstOrThrow: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    createManyAndReturn: jest.fn(),
  };

  const prismaMock = modelsName.reduce((modelAccumulator, modelName) => {
    modelAccumulator[modelName] = modelOperation;
    return modelAccumulator;
  }, /** @type {PrismaMock} */ ({}));

  return {
    prisma: {
      ...prismaMock,
      $transaction: jest.fn(),
    },
  };
}

/**
 * @typedef {{
 *   req?: Record<string, unknown>;
 *   res?: Record<string, unknown>;
 * }} ExpressMockOptions
 */

/** @param {ExpressMockOptions} options */
export function setupExpressMock({ req = {}, res = {} } = {}) {
  const parsedReq = {
    ...req,
  };

  const parsedRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    locals: {},
    setHeader: jest.fn(),
    end: jest.fn(),
    ...res,
  };

  const next = jest.fn();

  return { req: parsedReq, res: parsedRes, next };
}

/**
 * Mock setup for Puppeteer.
 *
 * @returns {{
 *   mockBrowser: { newPage: jest.Mock, close: jest.Mock };
 *   mockPage: { setContent: jest.Mock, pdf: jest.Mock, close: jest.Mock };
 * }}
 */
export function setupPuppeteerMock() {
  const mockPage = {
    setContent: jest.fn(),
    pdf: jest.fn(() => Buffer.from('PDF content')), // Mock PDF content
    close: jest.fn(),
  };

  const mockBrowser = {
    newPage: jest.fn(() => mockPage),
    close: jest.fn(),
  };

  jest.unstable_mockModule('puppeteer', () => ({
    launch: jest.fn(() => mockBrowser),
  }));

  return { mockBrowser, mockPage };
}

/**
 * Mock setup for fs/promises.
 *
 * @returns {{ readFile: jest.Mock }}
 */
export function setupFsMock() {
  const readFile = jest.fn(() => '<html><body>{{classId}}</body></html>'); // Mock template HTML

  jest.unstable_mockModule('fs/promises', () => ({
    readFile,
  }));

  return { readFile };
}

/**
 * Utility to capture thrown errors from a function.
 *
 * @param {() => unknown | Promise<unknown>} fn - The function to execute.
 * @returns {Promise<Error | undefined>} The error thrown by the function, if any.
 */
export async function getFunctionThrownError(fn) {
  try {
    await fn();
  } catch (error) {
    return error;
  }
}