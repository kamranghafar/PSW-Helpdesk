const express = require('express');

const router = express.Router();

/**
 * POST /api/support-requests
 * Create a new support request (not yet implemented)
 */
router.post('/', (req, res) => {
  res.status(501).json({
    error: {
      message: 'Endpoint not yet implemented',
      statusCode: 501
    }
  });
});

module.exports = router;
