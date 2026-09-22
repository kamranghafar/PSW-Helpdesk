const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const { closeRateLimiter } = require('./middleware/rateLimiter');

let server;

// Start server
const startServer = () => {
  server = app.listen(env.port, env.host, () => {
    logger.info(`Server started in ${env.nodeEnv} mode`, {
      port: env.port,
      host: env.host,
      nodeVersion: process.version,
    });
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${env.port} is already in use`);
    } else {
      logger.error('Server error', { error: error.message });
    }
    process.exit(1);
  });
};

// Graceful shutdown
const shutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');

      // Close rate limiter Redis connection
      await closeRateLimiter();

      logger.info('All connections closed, exiting');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {
    error: error.message,
    stack: error.stack,
  });
  shutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', {
    reason: reason,
    promise: promise,
  });
  shutdown('unhandledRejection');
});

// Start the server if not in test mode
if (!env.isTest()) {
  startServer();
}

module.exports = { app, server, startServer, shutdown };
