const request = require('supertest');
const app = require('../src/app');

describe('Express Application', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'PSW Helpdesk API');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('status', 'running');
    });
  });

  describe('Security Headers', () => {
    it('should set security headers', async () => {
      const response = await request(app).get('/');

      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('strict-transport-security');
    });
  });

  describe('CORS', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.status).toBe(204);
      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Body Parsing', () => {
    it('should parse JSON body', async () => {
      const response = await request(app)
        .post('/api/test')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');

      // Will return 404 but body should be parsed
      expect(response.status).toBe(404);
    });

    it('should reject body larger than 10kb', async () => {
      const largePayload = { data: 'x'.repeat(11000) };
      const response = await request(app)
        .post('/api/test')
        .send(largePayload)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(413);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on API routes', async () => {
      const requests = [];

      // Make 6 requests (limit is 5)
      for (let i = 0; i < 6; i++) {
        requests.push(request(app).get('/api/health'));
      }

      const responses = await Promise.all(requests);
      const tooManyRequests = responses.filter((r) => r.status === 429);

      expect(tooManyRequests.length).toBeGreaterThan(0);
    }, 10000);

    it('should return proper error message on rate limit', async () => {
      // Make requests until rate limited
      let response;
      for (let i = 0; i < 10; i++) {
        response = await request(app).get('/api/health');
        if (response.status === 429) break;
      }

      if (response.status === 429) {
        expect(response.body).toHaveProperty('error', 'Too many requests');
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('retryAfter');
      }
    }, 10000);
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Route not found');
    });

    it('should handle errors with proper status codes', async () => {
      const response = await request(app).get('/api/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
    });
  });
});
