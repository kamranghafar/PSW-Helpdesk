const request = require('supertest');
const { createApp } = require('../src/app');

describe('GET /api/health', () => {
  let app;

  beforeEach(() => {
    // Create app without rate limiter for tests
    app = createApp();
  });

  test('should return 200 status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
  });

  test('should return JSON with status ok', async () => {
    const response = await request(app).get('/api/health');
    expect(response.body.status).toBe('ok');
  });

  test('should return timestamp', async () => {
    const response = await request(app).get('/api/health');
    expect(response.body.timestamp).toBeDefined();
    expect(new Date(response.body.timestamp).toString()).not.toBe('Invalid Date');
  });

  test('should return environment field', async () => {
    const response = await request(app).get('/api/health');
    expect(response.body.environment).toBeDefined();
    expect(typeof response.body.environment).toBe('string');
  });

  test('should return test environment in test mode', async () => {
    process.env.NODE_ENV = 'test';
    const response = await request(app).get('/api/health');
    expect(response.body.environment).toBe('test');
  });

  test('should have correct content-type', async () => {
    const response = await request(app).get('/api/health');
    expect(response.headers['content-type']).toMatch(/json/);
  });
});
