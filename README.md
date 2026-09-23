# PSW Helpdesk Backend

Backend API for PSW Helpdesk Contact and Support Request System.

## Requirements

- Node.js 20 LTS or higher
- PostgreSQL 15+
- Redis (for production rate limiting)

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

## Running

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## Testing

Run tests:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

**Note**: Functions coverage threshold is currently set to 50% for initial scaffolding. This should be raised to 80% once full implementation is complete.

## API Endpoints

### Health Check
- `GET /api/health` - Returns service health status and environment

## Architecture

- Express.js 4.x framework
- Helmet.js for security headers
- Rate limiting with express-rate-limit (disabled in test mode)
- Winston structured logging with PII exclusion
- Modular configuration management

## Security Features

- Rate limiting: 5 requests per IP per 10 minutes (production only)
- Request size limit: 10KB
- Security headers via Helmet.js
- CORS configuration
- PII exclusion in logs (email, name, message fields redacted)

## Project Structure

```
src/
├── app.js              # Express app factory with createApp(rateLimiter)
├── server.js           # Server entry point
├── config/
│   └── index.js        # Grouped configuration (database, redis, rateLimit, security)
├── middleware/
│   └── errorHandler.js # Global error handling
├── routes/
│   └── health.js       # Health check endpoint
└── utils/
    └── logger.js       # Winston logger with excludePII function

tests/
└── unit/
    ├── app.test.js     # App factory tests
    ├── health.test.js  # Health endpoint tests
    └── logger.test.js  # Logger and excludePII tests
```
