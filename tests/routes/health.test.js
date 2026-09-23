const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/health', () => {
  test('returns 200 OK', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
  });

  test('returns JSON content type', async () => {
    const response = await request(app).get('/api/health');
    expect(response.headers['content-type']).toMatch(/json/);
  });

  test('returns status healthy', async () => {
    const response = await request(app).get('/api/health');
    expect(response.body.status).toBe('healthy');
  });

  test('returns timestamp', async () => {
    const response = await request(app).get('/api/health');
    expect(response.body.timestamp).toBeDefined();
    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
  });
});