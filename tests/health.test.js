const request = require('supertest');
const { createApp } = require('../src/app');

describe('Health Check Endpoint', () => {
  let app;

  beforeAll(() => {
    app = createApp(); // No rate limiter in tests
  });

  describe('GET /api/health', () => {
    it('should return 200 status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
    });

    it('should return ok status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body.status).toBe('ok');
    });

    it('should return timestamp in ISO format', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body.timestamp).toBeDefined();
      expect(() => new Date(response.body.timestamp)).not.toThrow();
    });

    it('should return environment field', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body.environment).toBeDefined();
      expect(typeof response.body.environment).toBe('string');
    });

    it('should return test environment in test mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';
      
      // Re-require config to pick up new NODE_ENV
      delete require.cache[require.resolve('../src/config')];
      const config = require('../src/config');
      
      const response = await request(app).get('/api/health');
      expect(response.body.environment).toBe('test');
      
      // Restore
      process.env.NODE_ENV = originalEnv;
      delete require.cache[require.resolve('../src/config')];
    });
  });
});
