const request = require('supertest');
const { createApp } = require('../../src/app');
const rateLimit = require('express-rate-limit');

describe('Express app factory', () => {
  test('createApp returns Express app instance', () => {
    const app = createApp(null);
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe('function');
  });

  test('createApp applies rate limiter when provided', async () => {
    const limiter = rateLimit({
      windowMs: 60000,
      max: 2,
      message: 'Rate limit exceeded'
    });
    
    const app = createApp(limiter);

    // First two requests should succeed
    await request(app).get('/api/health').expect(200);
    await request(app).get('/api/health').expect(200);
    
    // Third request should be rate limited
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(429);
  });

  test('createApp does not apply rate limiter when null', async () => {
    const app = createApp(null);

    // Multiple requests should all succeed
    for (let i = 0; i < 10; i++) {
      await request(app).get('/api/health').expect(200);
    }
  });

  test('app returns 404 for unknown routes', async () => {
    const app = createApp(null);
    const response = await request(app)
      .get('/api/unknown')
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Not Found');
  });

  test('app handles JSON body parsing', async () => {
    const app = createApp(null);
    
    // Add a test route to verify body parsing
    app.post('/api/test', (req, res) => {
      res.json({ received: req.body });
    });

    const response = await request(app)
      .post('/api/test')
      .send({ test: 'data' })
      .expect(200);

    expect(response.body.received).toEqual({ test: 'data' });
  });
});
