import { pino as Pino } from 'pino';
import { pinoHttp as PinoHttp } from 'pino-http';

/** @typedef {Object} CombinedLoggerOptions
 * @property {import('pino').LoggerOptions} pinoOptions
 * @property {import('pino-http').Options} [pinoHttpOptions]
 */

/** @type {CombinedLoggerOptions} */
const developmentLoggerOptions = {
  pinoOptions: {
    transport: {
      target: 'pino-pretty' // Agar log lebih mudah dibaca saat development
    }
  },
  pinoHttpOptions: {
    autoLogging: false // Nonaktifkan auto logging request-response di development
  }
};

/** @type {CombinedLoggerOptions} */
const productionLoggerOptions = {
  pinoOptions: {
    formatters: {
      level(label) {
        return { severity: label };
      }
    },
    messageKey: 'message'
  }
};

// Pilih konfigurasi sesuai environment
const { pinoOptions, pinoHttpOptions } =
  process.env.NODE_ENV === 'production'
    ? productionLoggerOptions
    : developmentLoggerOptions;

// Inisialisasi logger utama
export const logger = Pino(pinoOptions);

// Middleware Pino untuk Express
const pinoHttp = PinoHttp({
  ...pinoHttpOptions,
  logger
});

/** 
 * @param {import('express').Application} app 
 */
export default function setupLogger(app) {
  app.use(pinoHttp);
}