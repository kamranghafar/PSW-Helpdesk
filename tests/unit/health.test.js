const request = require('supertest');
const createApp = require('../../src/app');

describe('Health Check Endpoint', () => {
  test('GET /api/health returns 200 and status ok', async () => {
    const app = createApp(null);
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('GET /api/health includes timestamp', async () => {
    const app = createApp(null);
    const response = await request(app).get('/api/health');

    expect(response.body.timestamp).toBeDefined();
    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
  });

  test('GET /api/health includes environment field', async () => {
    const app = createApp(null);
    const response = await request(app).get('/api/health');

    expect(response.body.environment).toBeDefined();
    expect(typeof response.body.environment).toBe('string');
  });
});
