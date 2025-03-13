import pino from './pino.js';

/** @import {Express} from 'express' */
/** @import {Server} from 'http' */

/**
 * @param {Express} app
 * @param {Server} server
 */
export default (app, server) => {
  pino(app);
};