const request = require('supertest');
const createApp = require('../src/app');

describe('Health Check Endpoint', () => {
  let app;

  beforeAll(() => {
    app = createApp(); // No rate limiter in tests
  });

  describe('GET /api/health', () => {
    it('should return status ok', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });

    it('should include timestamp in response', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body.timestamp).toBeDefined();
    });

    it('should return timestamp in ISO format', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should return environment field', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body.environment).toBeDefined();
    });

    it('should return test environment in test mode', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body.environment).toBe('test');
    });
  });
});
