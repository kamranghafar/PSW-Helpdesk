const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const createApp = (rateLimiter) => {
  const app = express();
  
  // Security middleware per ADR-007
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:']
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));
  
  // CORS configuration
  app.use(cors({
    origin: config.security.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  }));
  
  // Body parsing with size limit per BR-024
  app.use(express.json({ limit: config.security.bodyLimit }));
  app.use(express.urlencoded({ extended: true, limit: config.security.bodyLimit }));
  
  // Request logging
  app.use((req, res, next) => {
    logger.info({
      message: 'Incoming request',
      method: req.method,
      url: req.url,
      ip: req.ip
    });
    next();
  });
  
  // Rate limiting per BR-012 (if initialized)
  if (rateLimiter) {
    app.use('/api', rateLimiter);
  }
  
  // API routes
  app.use('/api', routes);
  
  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: {
        message: 'Route not found',
        statusCode: 404
      }
    });
  });
  
  // Error handler
  app.use(errorHandler);
  
  return app;
};

module.exports = createApp;