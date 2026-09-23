const express = require('express');
const router = express.Router();

// Home route
router.get('/', (req, res) => {
  res.json({ message: 'PSW Helpdesk API' });
});

// Helpdesk contact page
router.get('/helpdesk', (req, res) => {
  res.render('helpdesk');
});

module.exports = router;