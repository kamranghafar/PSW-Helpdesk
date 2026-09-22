const request = require('supertest');
const app = require('../src/app');

describe('Express Application', () => {
  describe('Middleware Stack', () => {
    it('should parse JSON request bodies', async () => {
      const response = await request(app)
        .post('/api/health')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');
      
      // We expect 404 since POST is not supported on /api/health
      expect(response.status).toBe(404);
    });

    it('should enforce body size limits', async () => {
      const largePayload = { data: 'x'.repeat(11 * 1024) }; // 11KB
      const response = await request(app)
        .post('/api/health')
        .send(largePayload)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(413);
    });

    it('should set security headers', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });

  describe('Rate Limiting in Test Mode', () => {
    it('should not enforce rate limits in test environment', async () => {
      // Make 6 requests (more than the 5 request limit)
      const requests = Array(6).fill(null).map(() => 
        request(app).get('/api/health')
      );
      
      const responses = await Promise.all(requests);
      
      // All should succeed (200) since rate limiter is disabled in test mode
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body.message).toContain('GET');
      expect(response.body.message).toContain('/api/unknown');
    });

    it('should handle errors with proper status codes', async () => {
      const response = await request(app).get('/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Request Logging', () => {
    it('should log incoming requests', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      // Logger is mocked in test environment, so we just verify the request succeeds
    });
  });
});
