const rateLimit = require('express-rate-limit');
const config = require('../config');
const logger = require('../utils/logger');

// Disable rate limiter in test environment per human instructions
const rateLimiter = config.env === 'test'
  ? (req, res, next) => next() // No-op in test mode
  : rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        logger.warn({
          message: 'Rate limit exceeded',
          ip: req.ip,
          path: req.path,
        });
        res.status(429).json({
          error: 'Too many requests from this IP, please try again later.',
          retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
        });
      },
    });

module.exports = rateLimiter;
