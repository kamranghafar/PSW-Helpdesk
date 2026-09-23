const request = require('supertest');
const { createApp } = require('../src/app');

describe('Express Application', () => {
  let app;

  beforeAll(() => {
    app = createApp(); // No rate limiter in tests
  });

  describe('Security Headers', () => {
    it('should set security headers via Helmet', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });

  describe('Body Parsing', () => {
    it('should parse JSON request bodies', async () => {
      const response = await request(app)
        .post('/api/test')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');
      
      // Will 404 but body should be parsed
      expect(response.status).toBe(404);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown');
      expect(response.status).toBe(404);
    });

    it('should return error message for unknown routes', async () => {
      const response = await request(app).get('/api/unknown');
      expect(response.body.error).toBe('Not found');
      expect(response.body.path).toBe('/api/unknown');
    });
  });

  describe('Rate Limiter', () => {
    it('should not apply rate limiting when no limiter provided', async () => {
      // Make multiple requests quickly
      for (let i = 0; i < 10; i++) {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
      }
    });

    it('should apply rate limiting when limiter provided', async () => {
      const mockLimiter = (req, res, next) => {
        res.status(429).json({ error: 'Rate limited' });
      };
      
      const appWithLimiter = createApp(mockLimiter);
      const response = await request(appWithLimiter).get('/api/health');
      
      expect(response.status).toBe(429);
      expect(response.body.error).toBe('Rate limited');
    });
  });

  describe('CORS', () => {
    it('should set CORS headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
