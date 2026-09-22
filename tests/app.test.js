const request = require('supertest');
const { createApp } = require('../src/app');

describe('Express Application', () => {
  let app;

  beforeEach(() => {
    // Create app without rate limiter for tests
    app = createApp();
  });

  test('should have security headers', async () => {
    const response = await request(app).get('/api/health');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBeDefined();
  });

  test('should parse JSON body', async () => {
    const response = await request(app)
      .get('/api/health')
      .send({ test: 'data' });
    expect(response.status).toBe(200);
  });

  test('should apply rate limiter when provided', async () => {
    const rateLimit = require('express-rate-limit');
    const limiter = rateLimit({
      windowMs: 60000,
      max: 2,
      skip: () => false // Force rate limiting for this test
    });
    
    const appWithLimiter = createApp(limiter);
    
    await request(appWithLimiter).get('/api/health');
    await request(appWithLimiter).get('/api/health');
    const response = await request(appWithLimiter).get('/api/health');
    
    expect(response.status).toBe(429);
  });

  test('should not apply rate limiter when not provided', async () => {
    const appWithoutLimiter = createApp();
    
    // Make multiple requests - should all succeed
    for (let i = 0; i < 10; i++) {
      const response = await request(appWithoutLimiter).get('/api/health');
      expect(response.status).toBe(200);
    }
  });

  test('should handle CORS', async () => {
    const response = await request(app)
      .options('/api/health')
      .set('Origin', 'http://example.com');
    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });

  test('should handle 404 for unknown routes', async () => {
    const response = await request(app).get('/api/unknown');
    expect(response.status).toBe(404);
  });
});
