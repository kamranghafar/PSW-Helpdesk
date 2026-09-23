const express = require('express');
const path = require('path');
const helmet = require('helmet');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const config = require('./config');

const app = express();

// Security headers
app.use(helmet());

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Static file serving for CSS/JS/images
app.use(express.static(path.join(__dirname, '..', 'public')));

// Helpdesk page route (public, no authentication required)
app.get('/helpdesk', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'helpdesk.html'));
});

// Root redirect to helpdesk page
app.get('/', (req, res) => {
  res.redirect('/helpdesk');
});

// API routes with rate limiting
app.use('/api', rateLimiter);
app.use('/api', require('./routes'));

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;