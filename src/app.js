const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const healthRouter = require('./routes/health');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const config = require('./config');

/**
 * Factory function to create Express app with optional rate limiter
 * @param {object} rateLimiter - Optional express-rate-limit middleware
 * @returns {object} Express app instance
 */
function createApp(rateLimiter) {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({ origin: config.security.corsOrigin }));
  app.use(express.json({ limit: config.security.bodyLimit }));

  // Apply rate limiter if provided (disabled in test mode)
  if (rateLimiter) {
    app.use('/api/', rateLimiter);
  }

  // Request logging with PII exclusion
  app.use((req, res, next) => {
    const logData = {
      method: req.method,
      path: req.path,
      ip: req.ip
    };
    if (req.body && Object.keys(req.body).length > 0) {
      logData.body = logger.excludePII(req.body);
    }
    logger.info('Incoming request', logData);
    next();
  });

  // Routes
  app.use('/api/health', healthRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  // Error handling
  app.use(errorHandler);

  return app;
}

// Create rate limiter for production (disabled when NODE_ENV is 'test')
const rateLimiter = process.env.NODE_ENV === 'test' 
  ? null 
  : rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });

// Default export: app instance with real limiter for server.js
module.exports = createApp(rateLimiter);
// Named export: factory function for tests
module.exports.createApp = createApp;
