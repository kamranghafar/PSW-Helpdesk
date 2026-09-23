/**
 * Configuration module with grouped settings
 * Groups: database, redis, rateLimit, security, server
 */
module.exports = {
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/psw_helpdesk'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '600000', 10), // 10 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10)
  },
  security: {
    bodyLimit: process.env.BODY_SIZE_LIMIT || '10kb',
    corsOrigin: process.env.CORS_ORIGIN || '*'
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10)
  }
};
