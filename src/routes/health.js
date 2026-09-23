const express = require('express');
const router = express.Router();

/**
 * Health check endpoint
 * Returns service status, timestamp, and environment
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
