const config = require('./config');
const logger = require('./utils/logger');
const createApp = require('./app');
const { initRateLimiter, closeRedisClient } = require('./middleware/rateLimiter');
const { initHealthCheck, closeHealthCheckConnections } = require('./routes/health');

let server;

const startServer = async () => {
  try {
    // Initialize rate limiter
    const rateLimiter = await initRateLimiter();
    
    // Initialize health check connections
    await initHealthCheck();
    
    // Create Express app
    const app = createApp(rateLimiter);
    
    // Start server
    server = app.listen(config.port, () => {
      logger.info(`Server started on port ${config.port} in ${config.env} mode`);
    });
    
    return server;
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

const stopServer = async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    await closeRedisClient();
    await closeHealthCheckConnections();
    logger.info('Server stopped gracefully');
  }
};

// Graceful shutdown per ADR-006
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await stopServer();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await stopServer();
  process.exit(0);
});

// Start server if run directly
if (require.main === module) {
  startServer();
}

module.exports = { startServer, stopServer };