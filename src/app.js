const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config');
const logger = require('./utils/logger');
const rateLimiter = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const healthRouter = require('./routes/health');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.cors));

// Body parsing middleware
app.use(express.json({ limit: '10kb' })); // 10KB body limit per ADR-007
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
app.use((req, res, next) => {
  logger.info({
    message: 'Incoming request',
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Rate limiting (disabled in test mode)
app.use('/api', rateLimiter);

// Routes
app.use('/api/health', healthRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
