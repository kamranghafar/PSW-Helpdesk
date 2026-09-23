const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const { createClient } = require('redis');
const config = require('../config');
const { logger } = require('../utils/logger');

/**
 * Creates rate limiter middleware
 * @returns {Function} Express middleware
 */
async function createRateLimiter() {
  // Disable rate limiting in test environment
  if (config.nodeEnv === 'test') {
    logger.info('Rate limiting disabled in test environment');
    return (req, res, next) => next();
  }

  // Use Redis store in production/development
  let store;
  if (config.redis.url && config.nodeEnv !== 'development') {
    try {
      const redisClient = createClient({
        url: config.redis.url,
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 500)
        }
      });
      
      await redisClient.connect();
      
      store = new RedisStore({
        client: redisClient,
        prefix: 'rl:'
      });
      
      logger.info('Rate limiter using Redis store');
    } catch (error) {
      logger.warn('Failed to connect to Redis, falling back to memory store', { error: error.message });
    }
  }

  return rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(config.rateLimit.windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    store,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path
      });
      res.status(429).json({
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(config.rateLimit.windowMs / 1000)
      });
    }
  });
}

module.exports = { createRateLimiter };
