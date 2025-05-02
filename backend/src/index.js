import express from 'express';
import { createServer } from 'http';
import loaders from './loaders/index.js';
import routes from './routes/index.js';
import errorMiddleware from './middlewares/error.js';
import { appEnv } from './utils/env.js';
import { logger } from './loaders/pino.js';
import cors from 'cors';
import morgan from 'morgan';

function main() {
  const app = express();
  const server = createServer(app);
  
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(morgan('dev'));

  loaders(app, server);
  routes(app);

  // Middleware penanganan kesalahan harus ditempatkan setelah semua rute
  errorMiddleware(app);

  server.listen(appEnv.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${appEnv.PORT}`);
  });

  // Handle server error
  server.on('error', (err) => {
    logger.error(`❌ Server failed to start: ${err.message}`);
    process.exit(1);
  });
}

/** Listen for termination signals */
function handleExit(signal) {
  logger.info(`⚠️ Caught ${signal}, shutting down gracefully.`);
  logger.flush();
  process.exit(0);
}

process.on('SIGTERM', handleExit);
process.on('SIGINT', handleExit);

main();