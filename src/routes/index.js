const express = require('express');
const healthRouter = require('./health');
const supportRequestsRouter = require('./supportRequests');

const router = express.Router();

// Health check endpoint
router.use('/api/health', healthRouter);

// Support requests endpoint
router.use('/api/support-requests', supportRequestsRouter);

// Redirect root to helpdesk
router.get('/', (req, res) => {
  res.redirect('/helpdesk');
});

// Helpdesk contact page
router.get('/helpdesk', (req, res) => {
  res.render('helpdesk');
});

module.exports = router;
