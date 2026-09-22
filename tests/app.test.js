const request = require('supertest');
const createApp = require('../src/app');

describe('Express App', () => {
  let app;
  
  beforeAll(() => {
    app = createApp();
  });
  
  describe('Security Headers', () => {
    it('should set helmet security headers', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(response.headers['x-xss-protection']).toBeDefined();
    });
  });
  
  describe('Body Size Limit', () => {
    it('should reject requests exceeding body size limit', async () => {
      const largePayload = 'a'.repeat(11 * 1024); // 11KB
      
      const response = await request(app)
        .post('/api/support-requests')
        .send({ data: largePayload });
      
      expect(response.status).toBe(413);
    });
  });
  
  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      
      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Route not found');
    });
  });
  
  describe('Error Handler', () => {
    it('should handle errors gracefully', async () => {
      const response = await request(app).post('/api/support-requests');
      
      expect(response.status).toBe(501);
    });
  });
});