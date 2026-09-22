const express = require('express');
const { Pool } = require('pg');
const { createClient } = require('redis');
const config = require('../config');
const logger = require('../utils/logger');

const router = express.Router();

let pgPool;
let redisClient;

const initHealthCheck = async () => {
  // Initialize PostgreSQL pool
  pgPool = new Pool({
    connectionString: config.database.url,
    max: 1,
    idleTimeoutMillis: 30000
  });
  
  // Initialize Redis client if in production
  if (config.env === 'production') {
    try {
      redisClient = createClient({ url: config.redis.url });
      await redisClient.connect();
      logger.info('Redis client connected for health checks');
    } catch (error) {
      logger.warn('Redis not available for health checks', { error: error.message });
    }
  }
};

router.get('/', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {}
  };
  
  let hasError = false;
  
  // Check database
  try {
    await pgPool.query('SELECT 1');
    health.checks.database = 'ok';
  } catch (error) {
    health.checks.database = 'error';
    hasError = true;
    logger.error('Database health check failed', { error: error.message });
  }
  
  // Check Redis (if configured)
  if (redisClient) {
    try {
      await redisClient.ping();
      health.checks.redis = 'ok';
    } catch (error) {
      health.checks.redis = 'error';
      hasError = true;
      logger.error('Redis health check failed', { error: error.message });
    }
  }
  
  if (hasError) {
    health.status = 'degraded';
    return res.status(503).json(health);
  }
  
  res.status(200).json(health);
});

const closeHealthCheckConnections = async () => {
  if (pgPool) {
    await pgPool.end();
    logger.info('PostgreSQL pool closed');
  }
  
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis client disconnected');
  }
};

module.exports = { router, initHealthCheck, closeHealthCheckConnections };