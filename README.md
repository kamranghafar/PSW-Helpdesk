# PSW Helpdesk Backend

Backend API for the Pakistan Single Window (PSW) Helpdesk system.

## Project Structure

```
.
├── src/
│   ├── app.js                 # Express app factory
│   ├── server.js              # Server entry point
│   ├── config/
│   │   └── index.js           # Configuration management
│   ├── middleware/
│   │   └── errorHandler.js    # Global error handler
│   ├── routes/
│   │   └── health.js          # Health check endpoint
│   └── utils/
│       └── logger.js          # Winston logger with PII protection
├── tests/
│   └── unit/
│       ├── app.test.js        # App tests
│       ├── health.test.js     # Health endpoint tests
│       └── logger.test.js     # Logger tests
├── jest.config.js             # Jest configuration
└── package.json               # Project dependencies
```

## Features

- **Express.js 4.x** web framework
- **Helmet** security middleware
- **Rate limiting** (disabled in test mode)
- **Structured logging** with Winston (PII-safe)
- **Health check** endpoint with environment info
- **Error handling** middleware
- **Test coverage** with Jest (50% threshold)

## Requirements

- Node.js 20 LTS or higher
- npm 10 or higher

## Installation

```bash
npm install
```

## Configuration

Environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/test/production)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `RATE_LIMIT_WINDOW_MS` - Rate limit window (default: 600000 = 10 minutes)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 5)
- `BODY_LIMIT` - Request body size limit (default: 10kb)
- `CORS_ORIGIN` - CORS allowed origin (default: *)

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Testing

```bash
# Run all tests with coverage
npm test

# Watch mode
npm run test:watch
```

## API Endpoints

### Health Check
```
GET /api/health

Response:
{
  "status": "ok",
  "timestamp": "2026-09-23T10:00:00.000Z",
  "environment": "development"
}
```

### Support Requests (stub)
```
POST /api/support-requests

Response: 501 Not Implemented
```

## Security

- Helmet.js security headers
- Rate limiting (5 requests per 10 minutes per IP in production)
- Body size limits (10KB)
- PII redaction in logs
- HTTPS enforced in production

## License

UNLICENSED - Internal PSW Project
