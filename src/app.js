const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const healthRouter = require('./routes/health');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const config = require('./config');

/**
 * Factory function to create Express application
 * @param {object} rateLimiter - Optional rate limiter middleware
 * @returns {object} Express application instance
 */
function createApp(rateLimiter) {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: config.security.corsOrigin
  }));

  // Body parsing with size limit
  app.use(express.json({ limit: config.security.bodyLimit }));
  app.use(express.urlencoded({ extended: true, limit: config.security.bodyLimit }));

  // Request logging middleware
  app.use((req, res, next) => {
    const logData = {
      method: req.method,
      url: req.url,
      ip: req.ip
    };
    
    if (req.body && Object.keys(req.body).length > 0) {
      logData.body = logger.excludePII(req.body);
    }
    
    logger.info('Request received', logData);
    next();
  });

  // Rate limiting (only if provided)
  if (rateLimiter) {
    app.use('/api/', rateLimiter);
  }

  // Routes
  app.use('/api/health', healthRouter);

  // Error handling
  app.use(errorHandler);

  return app;
}

// Create rate limiter for production use
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test'
});

// Default export with rate limiter for server.js
module.exports = createApp(limiter);

// Named export for testing
module.exports.createApp = createApp;
