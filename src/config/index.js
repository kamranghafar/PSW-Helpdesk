require('dotenv').config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/psw_helpdesk'
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 600000, // 10 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 5
  },
  
  security: {
    bodyLimit: process.env.BODY_LIMIT || '10kb',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  }
};

module.exports = config;
