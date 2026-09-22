const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('should return 200 status', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
  });

  it('should return ok status in response body', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.body).toHaveProperty('status', 'ok');
  });

  it('should return timestamp in ISO format', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('should return environment field', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.body).toHaveProperty('environment');
    expect(response.body.environment).toBe('test');
  });

  it('should return Content-Type application/json', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  it('should have all required fields in response', async () => {
    const response = await request(app).get('/api/health');
    
    expect(Object.keys(response.body).sort()).toEqual(['environment', 'status', 'timestamp']);
  });
});
