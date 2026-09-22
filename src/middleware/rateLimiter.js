const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const redis = require('redis');
const env = require('../config/env');
const logger = require('../utils/logger');

// Create Redis client for rate limiting (only in production)
let redisClient = null;

const createRateLimiter = () => {
  const limiterConfig = {
    windowMs: env.rateLimit.windowMs,
    max: env.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (req, res) => {
      logger.warn({
        message: 'Rate limit exceeded',
        ip: req.ip,
        path: req.path,
      });
      res.status(429).json({
        error: 'Too many requests',
        message: `You have exceeded the ${env.rateLimit.maxRequests} requests in ${env.rateLimit.windowMs / 60000} minutes limit. Please try again later.`,
        retryAfter: Math.ceil(env.rateLimit.windowMs / 1000),
      });
    },
  };

  // Use Redis store in production
  if (env.isProduction() && !env.isTest()) {
    try {
      redisClient = redis.createClient({
        socket: {
          host: env.redis.host,
          port: env.redis.port,
        },
        password: env.redis.password,
        database: env.redis.db,
      });

      redisClient.on('error', (err) => {
        logger.error('Redis client error', { error: err.message });
      });

      redisClient.connect().catch((err) => {
        logger.error('Redis connection failed', { error: err.message });
      });

      limiterConfig.store = new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
      });

      logger.info('Rate limiter using Redis store');
    } catch (error) {
      logger.error('Failed to initialize Redis for rate limiting', { error: error.message });
      logger.info('Falling back to memory store for rate limiting');
    }
  } else {
    logger.info('Rate limiter using memory store (development/test mode)');
  }

  return rateLimit(limiterConfig);
};

// Cleanup function for graceful shutdown
const closeRateLimiter = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
      logger.info('Redis client closed');
    } catch (error) {
      logger.error('Error closing Redis client', { error: error.message });
    }
  }
};

module.exports = { createRateLimiter, closeRateLimiter };
