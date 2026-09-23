const request = require('supertest');
const createApp = require('../../src/app');

describe('Express Application', () => {
  describe('Security middleware', () => {
    it('sets security headers', async () => {
      const app = createApp(null);
      const response = await request(app).get('/api/health');
      
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
    });
  });

  describe('Rate limiting', () => {
    it('does not rate limit when limiter is null', async () => {
      const app = createApp(null);
      
      // Make multiple requests to verify no rate limiting
      for (let i = 0; i < 10; i++) {
        const response = await request(app).get('/api/health');
        expect(response.status).not.toBe(429);
      }
    });

    it('applies rate limiter when provided', async () => {
      const mockLimiter = jest.fn((req, res, next) => next());
      const app = createApp(mockLimiter);
      
      await request(app).get('/api/health');
      expect(mockLimiter).toHaveBeenCalled();
    });
  });

  describe('Body parsing', () => {
    it('handles JSON body parsing', async () => {
      const app = createApp(null, (app) => {
        app.post('/api/test', (req, res) => {
          res.json({ received: req.body });
        });
      });

      const testData = { name: 'Test User', email: 'test@example.com' };
      const response = await request(app)
        .post('/api/test')
        .send(testData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.received).toEqual(testData);
    });

    it('rejects oversized payloads', async () => {
      const app = createApp(null, (app) => {
        app.post('/api/test', (req, res) => {
          res.json({ received: req.body });
        });
      });

      const largeData = { data: 'x'.repeat(15000) };
      const response = await request(app)
        .post('/api/test')
        .send(largeData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(413);
    });
  });

  describe('404 handling', () => {
    it('returns 404 for unknown routes', async () => {
      const app = createApp(null);
      const response = await request(app).get('/unknown/route');
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: {
          message: 'Route not found',
          statusCode: 404
        },
        path: '/unknown/route'
      });
    });
  });

  describe('Error handling', () => {
    it('handles errors gracefully', async () => {
      const app = createApp(null, (app) => {
        app.get('/api/error', (req, res, next) => {
          next(new Error('Test error'));
        });
      });

      const response = await request(app).get('/api/error');
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
    });
  });
});
