const request = require('supertest');
const createApp = require('../src/app');

describe('PSW Helpdesk API', () => {
  let app;

  beforeEach(() => {
    app = createApp(null);
  });

  describe('POST /api/support-requests', () => {
    test('returns 501 not implemented', async () => {
      const response = await request(app)
        .post('/api/support-requests')
        .set('Content-Type', 'application/json')
        .send({
          title: 'Test Request',
          description: 'Test description',
          priority: 'medium'
        });
      
      expect(response.status).toBe(501);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Endpoint not yet implemented');
      expect(response.body.error.statusCode).toBe(501);
    });
  });

  describe('404 Handler', () => {
    test('returns 404 for unknown API routes', async () => {
      const response = await request(app).get('/api/unknown');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Route not found');
      expect(response.body.error.statusCode).toBe(404);
    });

    test('returns 404 for root path', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(404);
    });
  });

  describe('Security Headers', () => {
    test('includes security headers in response', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });

  describe('Body Size Limit', () => {
    test('accepts requests within size limit', async () => {
      const response = await request(app)
        .post('/api/support-requests')
        .set('Content-Type', 'application/json')
        .send({ data: 'small payload' });
      
      expect(response.status).toBe(501);
    });
  });
});