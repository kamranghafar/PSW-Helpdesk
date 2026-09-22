const express = require('express');
const router = express.Router();
const config = require('../config');

/**
 * GET /api/health
 * Health check endpoint
 * Returns server status, timestamp, and environment
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.env, // Added per human instructions
  });
});

module.exports = router;
