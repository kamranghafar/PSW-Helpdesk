const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config');
const healthRouter = require('./routes/health');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { logger } = require('./utils/logger');

/**
 * Creates and configures Express application
 * @param {Function} rateLimiter - Optional rate limiter middleware
 * @returns {express.Application} Configured Express app
 */
function createApp(rateLimiter) {
  const app = express();

  // Security middleware
  app.use(helmet());
  
  // CORS
  app.use(cors({
    origin: config.security.corsOrigin,
    credentials: true
  }));

  // Body parsing
  app.use(express.json({ limit: config.security.bodyLimit }));
  app.use(express.urlencoded({ extended: true, limit: config.security.bodyLimit }));

  // Apply rate limiter if provided
  if (rateLimiter) {
    app.use(rateLimiter);
    logger.info('Rate limiter applied');
  }

  // Request logging
  app.use((req, res, next) => {
    logger.info('Incoming request', {
      method: req.method,
      path: req.path,
      ip: req.ip
    });
    next();
  });

  // Routes
  app.use('/api/health', healthRouter);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

// Default export for server.js
async function createDefaultApp() {
  const { createRateLimiter } = require('./middleware/rateLimiter');
  const rateLimiter = await createRateLimiter();
  return createApp(rateLimiter);
}

module.exports = createApp;
module.exports.createApp = createApp;
module.exports.createDefaultApp = createDefaultApp;
