# PSW Helpdesk - Backend API

Backend REST API for PSW Helpdesk Contact Page.

## Architecture

- **Node.js 20 LTS** with Express.js 4.x
- Security middleware: Helmet, CORS
- Rate limiting: express-rate-limit with Redis support
- Structured logging: Winston with PII exclusion
- Error handling: Centralized error middleware

## Project Structure

```
├── src/
│   ├── app.js                 # Express app factory (createApp)
│   ├── server.js              # Server entry point
│   ├── config/
│   │   └── index.js          # Configuration (database, redis, rateLimit, security)
│   ├── middleware/
│   │   └── errorHandler.js   # Global error handler
│   ├── routes/
│   │   └── health.js         # Health check endpoint
│   └── utils/
│       └── logger.js         # Winston logger with excludePII
├── tests/
│   ├── app.test.js           # App structure tests
│   ├── health.test.js        # Health endpoint tests
│   └── logger.test.js        # Logger PII exclusion tests
└── jest.config.js            # Jest configuration (50% coverage threshold)
```

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run tests
npm test

# Start development server
npm run dev

# Start production server
npm start
```

## Configuration

Configuration is grouped into logical sections in `src/config/index.js`:

- **database**: PostgreSQL connection URL
- **redis**: Redis connection URL
- **rateLimit**: windowMs (10 min), maxRequests (5)
- **security**: bodyLimit (10kb), corsOrigin

## API Endpoints

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-09-22T10:30:00.000Z",
  "environment": "development"
}
```

## Rate Limiting

- **Production**: 5 requests per IP per 10 minutes
- **Test**: Disabled when NODE_ENV=test
- Returns HTTP 429 when exceeded

## Security

- Helmet.js security headers
- CORS protection
- Body size limiting (10kb)
- PII exclusion in logs (email, name, message)
- TLS 1.2+ required (infrastructure)

## Testing

```bash
# Run all tests with coverage
npm test

# Watch mode
npm run test:watch
```

Coverage threshold: 50% (functions) - scaffolding phase.
TODO: Raise to 80%+ after implementation complete.

## Development

The app uses a factory pattern:

```javascript
const { createApp } = require('./src/app');

// Without rate limiter (tests)
const app = createApp();

// With rate limiter (production)
const app = createApp(rateLimiter);
```

## Environment Variables

See `.env.example` for all configuration options.

## License

UNLICENSED - PSW Internal Use Only
