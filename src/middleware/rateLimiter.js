const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const { createClient } = require('redis');
const config = require('../config');
const logger = require('../utils/logger');

let redisClient;
let rateLimiter;

const initRateLimiter = async () => {
  // Use Redis in production, memory store in development per ADR-003
  if (config.env === 'production') {
    try {
      redisClient = createClient({ url: config.redis.url });
      await redisClient.connect();
      
      logger.info('Redis client connected for rate limiting');
      
      rateLimiter = rateLimit({
        store: new RedisStore({
          client: redisClient,
          prefix: 'rate_limit:'
        }),
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.maxRequests,
        message: {
          error: {
            message: 'Too many requests from this IP, please try again later.',
            statusCode: 429
          }
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
          logger.warn({
            message: 'Rate limit exceeded',
            ip: req.ip,
            url: req.url
          });
          
          res.status(429).json({
            error: {
              message: 'Too many requests from this IP, please try again later.',
              statusCode: 429
            }
          });
        }
      });
    } catch (error) {
      logger.error('Failed to connect to Redis, falling back to memory store', { error: error.message });
      rateLimiter = createMemoryRateLimiter();
    }
  } else {
    rateLimiter = createMemoryRateLimiter();
  }
  
  return rateLimiter;
};

const createMemoryRateLimiter = () => {
  return rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
      error: {
        message: 'Too many requests from this IP, please try again later.',
        statusCode: 429
      }
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

const closeRedisClient = async () => {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis client disconnected');
  }
};

module.exports = { initRateLimiter, closeRedisClient };