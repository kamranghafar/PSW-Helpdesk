const express = require('express');
const { router: healthRouter } = require('./health');

const router = express.Router();

// Health check endpoint per ADR-009
router.use('/health', healthRouter);

// Placeholder for support requests endpoint (US-011)
// Will be implemented in subsequent tasks
router.post('/support-requests', (req, res) => {
  res.status(501).json({
    error: {
      message: 'Endpoint not yet implemented',
      statusCode: 501
    }
  });
});

module.exports = router;