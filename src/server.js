const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const server = app.listen(config.port, () => {
  logger.info({
    message: 'Server started',
    port: config.port,
    environment: config.env,
  });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info({ message: `${signal} received, shutting down gracefully` });
  server.close(() => {
    logger.info({ message: 'Server closed' });
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error({ message: 'Forced shutdown after timeout' });
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error({ message: 'Uncaught exception', error: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ message: 'Unhandled rejection', reason, promise });
  process.exit(1);
});
