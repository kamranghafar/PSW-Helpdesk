const request = require('supertest');
const app = require('../src/app');

describe('Health Check Endpoint', () => {
  describe('GET /api/health', () => {
    it('should return 200 status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
    });

    it('should return health check data', async () => {
      const response = await request(app).get('/api/health');

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('memory');
    });

    it('should return valid timestamp', async () => {
      const response = await request(app).get('/api/health');

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    it('should return memory usage', async () => {
      const response = await request(app).get('/api/health');

      expect(response.body.memory).toHaveProperty('used');
      expect(response.body.memory).toHaveProperty('total');
      expect(typeof response.body.memory.used).toBe('number');
      expect(typeof response.body.memory.total).toBe('number');
      expect(response.body.memory.used).toBeGreaterThan(0);
      expect(response.body.memory.total).toBeGreaterThan(0);
    });

    it('should return uptime as a number', async () => {
      const response = await request(app).get('/api/health');

      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should return environment', async () => {
      const response = await request(app).get('/api/health');

      expect(response.body.environment).toBeDefined();
      expect(typeof response.body.environment).toBe('string');
    });
  });
});
