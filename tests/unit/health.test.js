const request = require('supertest');
const createApp = require('../../src/app');

describe('Health endpoint', () => {
  let app;

  beforeEach(() => {
    app = createApp(null); // No rate limiter for tests
  });

  test('GET /api/health returns 200 with status ok', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('GET /api/health includes timestamp', async () => {
    const response = await request(app).get('/api/health');
    expect(response.body.timestamp).toBeDefined();
  });

  test('GET /api/health timestamp is valid ISO 8601', async () => {
    const response = await request(app).get('/api/health');
    expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});