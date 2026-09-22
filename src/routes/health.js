const express = require('express');
const logger = require('../utils/logger');

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    };

    logger.debug('Health check performed', healthCheck);
    res.status(200).json(healthCheck);
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
    });
  }
});

module.exports = router;
