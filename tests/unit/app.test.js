const request = require('supertest');
const createApp = require('../../src/app');

describe('Express App', () => {
  describe('Security middleware', () => {
    test('app sets security headers', async () => {
      const app = createApp(null);
      const response = await request(app).get('/api/health');
      
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
    });
  });

  describe('Body parsing', () => {
    test('app handles JSON body parsing', async () => {
      const app = createApp(null, (app) => {
        app.post('/api/test', (req, res) => {
          res.json({ received: req.body });
        });
      });

      const response = await request(app)
        .post('/api/test')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.received).toEqual({ test: 'data' });
    });
  });

  describe('Rate limiting', () => {
    test('app works without rate limiter', async () => {
      const app = createApp(null);
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
    });

    test('app works with rate limiter', async () => {
      const mockRateLimiter = (req, res, next) => next();
      const app = createApp(mockRateLimiter);
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
    });
  });

  describe('404 handling', () => {
    test('app returns 404 for unknown routes', async () => {
      const app = createApp(null);
      const response = await request(app).get('/unknown');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Route not found');
      expect(response.body.error.statusCode).toBe(404);
    });
  });

  describe('Support requests endpoint', () => {
    test('POST /api/support-requests returns 501', async () => {
      const app = createApp(null);
      const response = await request(app)
        .post('/api/support-requests')
        .send({ name: 'Test' });
      
      expect(response.status).toBe(501);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Endpoint not yet implemented');
      expect(response.body.error.statusCode).toBe(501);
    });
  });

  describe('Custom routes injection', () => {
    test('setupRoutes callback allows route injection', async () => {
      const app = createApp(null, (app) => {
        app.get('/custom', (req, res) => {
          res.json({ custom: true });
        });
      });

      const response = await request(app).get('/custom');
      expect(response.status).toBe(200);
      expect(response.body.custom).toBe(true);
    });
  });
});