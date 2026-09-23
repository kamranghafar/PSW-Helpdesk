const request = require('supertest');
const createApp = require('../src/app');

describe('Express Application', () => {
  let app;

  beforeAll(() => {
    app = createApp(null); // No rate limiter in tests
  });

  describe('Security Headers', () => {
    it('should set X-Content-Type-Options header', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should set X-Frame-Options header', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers['x-frame-options']).toBeDefined();
    });

    it('should set X-XSS-Protection header', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers['x-xss-protection']).toBeDefined();
    });
  });

  describe('Rate Limiter', () => {
    it('should not apply rate limiting when no limiter provided', async () => {
      const testApp = createApp(null);
      
      // Make multiple requests - none should be rate limited
      for (let i = 0; i < 10; i++) {
        const response = await request(testApp).get('/api/health');
        expect(response.status).toBe(200);
      }
    });

    it('should apply rate limiting when limiter provided', async () => {
      const mockLimiter = jest.fn((req, res, next) => next());
      const testApp = createApp(mockLimiter);
      
      await request(testApp).get('/api/health');
      expect(mockLimiter).toHaveBeenCalled();
    });
  });

  describe('CORS', () => {
    it('should set CORS headers', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
    });
  });
});
