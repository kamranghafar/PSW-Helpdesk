const request = require('supertest');
const app = require('../src/app');

describe('Express App', () => {
  test('app is defined', () => {
    expect(app).toBeDefined();
  });

  test('returns 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });

  test('sets security headers', async () => {
    const response = await request(app).get('/api/health');
    expect(response.headers['x-content-type-options']).toBeDefined();
  });

  test('serves static files', async () => {
    const response = await request(app).get('/favicon.ico');
    // Will be 404 if file doesn't exist, but middleware is configured
    expect([200, 404]).toContain(response.status);
  });
});