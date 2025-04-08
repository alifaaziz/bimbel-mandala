import { pino as Pino } from 'pino';
import { pinoHttp as PinoHttp } from 'pino-http';

const developmentLoggerOptions = {
  pinoOptions: {
    transport: {
      target: 'pino-pretty'
    }
  },
  pinoHttpOptions: {
    autoLogging: false
  }
};

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

const { pinoOptions, pinoHttpOptions } =
  process.env.NODE_ENV === 'production'
    ? productionLoggerOptions
    : developmentLoggerOptions;

export const logger = Pino(pinoOptions);

const pinoHttp = PinoHttp({
  ...pinoHttpOptions,
  logger
});

export default (app) => {
  app.use(pinoHttp);
};