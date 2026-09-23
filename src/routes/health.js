const express = require('express');
const router = express.Router();
const config = require('../config');

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

module.exports = router;
