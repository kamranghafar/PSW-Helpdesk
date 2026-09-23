const express = require('express');
const helmet = require('helmet');
const healthRouter = require('./routes/health');
const logger = require('./utils/logger');

function createApp(rateLimiter, setupRoutes) {
  const app = express();

  // Security middleware
  app.use(helmet());

  // Body parsing
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Apply rate limiter if provided (disabled in test mode)
  if (rateLimiter) {
    app.use(rateLimiter);
  }

  // Request logging
  app.use((req, res, next) => {
    const body = req.body ? logger.excludePII(req.body) : {};
    logger.info('Incoming request', {
      method: req.method,
      path: req.path,
      ip: req.ip,
      body
    });
    next();
  });

  // Health check endpoint
  app.use('/api/health', healthRouter);

  // Allow tests to inject routes before 404 handler
  if (setupRoutes) {
    setupRoutes(app);
  }

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found', path: req.path });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    logger.error('Error handling request', {
      error: err.message,
      stack: err.stack,
      path: req.path
    });
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error'
    });
  });

  return app;
}

module.exports = createApp;
