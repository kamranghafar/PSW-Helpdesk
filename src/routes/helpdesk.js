const express = require('express');
const router = express.Router();

/**
 * GET /helpdesk
 * Display the support request form page
 */
router.get('/helpdesk', (req, res) => {
  res.render('helpdesk');
});

/**
 * GET /
 * Redirect root to helpdesk page
 */
router.get('/', (req, res) => {
  res.redirect(302, '/helpdesk');
});

module.exports = router;
