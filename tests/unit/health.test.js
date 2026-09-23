const request = require('supertest');
const { createApp } = require('../../src/app');

describe('Health endpoint', () => {
  let app;

  beforeEach(() => {
    app = createApp(null); // No rate limiter for tests
  });

  test('GET /api/health returns 200 with status ok', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('environment');
  });

  test('GET /api/health includes environment field', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body.environment).toBeDefined();
    expect(typeof response.body.environment).toBe('string');
  });

  test('GET /api/health timestamp is valid ISO 8601', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    const timestamp = new Date(response.body.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.toISOString()).toBe(response.body.timestamp);
  });
});
