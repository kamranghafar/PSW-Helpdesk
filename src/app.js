const express = require('express');
const helmet = require('helmet');
const config = require('./config');
const healthRouter = require('./routes/health');
const errorHandler = require('./middleware/errorHandler');
const { logger, excludePII } = require('./utils/logger');

/**
 * Creates and configures an Express application
 * @param {Object} rateLimiter - Optional rate limiter middleware
 * @param {Function} setupRoutes - Optional callback to add routes before 404 handler
 * @returns {express.Application} Configured Express app
 */
function createApp(rateLimiter, setupRoutes) {
  const app = express();

  // Security middleware
  app.use(helmet());

  // Body parsing
  app.use(express.json({ limit: config.security.bodyLimit }));
  app.use(express.urlencoded({ extended: true, limit: config.security.bodyLimit }));

  // Request logging
  app.use((req, res, next) => {
    logger.info({
      method: req.method,
      path: req.path,
      ip: req.ip,
      body: req.body ? excludePII(req.body) : undefined
    });
    next();
  });

  // Rate limiting (only if provided)
  if (rateLimiter) {
    app.use(rateLimiter);
  }

  // Health check route
  app.use('/api/health', healthRouter);

  // Stub for support requests endpoint
  app.post('/api/support-requests', (req, res) => {
    res.status(501).json({ error: 'Not implemented' });
  });

  // Allow tests to inject additional routes
  if (setupRoutes) {
    setupRoutes(app);
  }

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not found',
      path: req.path
    });
  });

  // Error handler
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
