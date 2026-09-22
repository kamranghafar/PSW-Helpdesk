# PSW Helpdesk Support Request System

Backend API for the PSW Helpdesk support request system.

## Prerequisites

- Node.js 20 LTS or higher
- Redis (for production rate limiting)
- npm or yarn

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key configuration options:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production/test)
- `REDIS_HOST`: Redis host for rate limiting (production)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per IP per window (default: 5)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds (default: 600000 = 10 minutes)

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
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## API Endpoints

### Health Check

```
GET /api/health
```

Returns server health status, uptime, and memory usage.

### Root

```
GET /
```

Returns API information.

## Architecture

### Middleware Stack

1. **Helmet**: Security headers (CSP, HSTS, etc.)
2. **CORS**: Cross-origin resource sharing
3. **Body Parser**: JSON and URL-encoded body parsing (10KB limit)
4. **Rate Limiting**: 5 requests per IP per 10 minutes
5. **Request Logging**: Structured logging with Winston
6. **Error Handling**: Centralized error handler

### Rate Limiting

- **Development/Test**: Memory-based store
- **Production**: Redis-backed store for distributed rate limiting
- **Limits**: 5 requests per IP per 10 minutes
- **Response**: HTTP 429 with retry-after header

### Security Features

- TLS enforcement (HSTS headers)
- Content Security Policy
- XSS protection
- Request size limits (10KB)
- Rate limiting per IP
- Helmet.js security headers

### Logging

- **Format**: JSON (structured logging)
- **Levels**: error, warn, info, debug
- **Transport**: Console (all), File (production)
- **Exclusions**: No PII in logs

## Project Structure

```
.
├── src/
│   ├── app.js              # Express application setup
│   ├── server.js           # Server entry point
│   ├── config/
│   │   └── env.js          # Environment configuration
│   ├── middleware/
│   │   ├── errorHandler.js # Error handling middleware
│   │   └── rateLimiter.js  # Rate limiting configuration
│   ├── routes/
│   │   └── health.js       # Health check endpoint
│   └── utils/
│       └── logger.js       # Winston logger setup
├── tests/
│   ├── app.test.js         # Application tests
│   └── health.test.js      # Health endpoint tests
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## License

UNLICENSED - Internal PSW project
