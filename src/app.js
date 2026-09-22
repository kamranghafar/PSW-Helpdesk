const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const env = require('./config/env');
const logger = require('./utils/logger');
const { createRateLimiter } = require('./middleware/rateLimiter');
const {
  errorHandler,
  notFoundHandler,
} = require('./middleware/errorHandler');
const healthRouter = require('./routes/health');

const app = express();

// Trust proxy - important for rate limiting by IP
app.set('trust proxy', 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: env.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Rate limiting middleware
const rateLimiter = createRateLimiter();
app.use('/api/', rateLimiter);

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'PSW Helpdesk API',
    version: '1.0.0',
    status: 'running',
  });
});

app.use('/api/health', healthRouter);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
