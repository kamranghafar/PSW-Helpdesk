const request = require('supertest');
const createApp = require('../src/app');
const { initHealthCheck, closeHealthCheckConnections } = require('../src/routes/health');

describe('Health Check Endpoint', () => {
  let app;
  
  beforeAll(async () => {
    await initHealthCheck();
    app = createApp();
  });
  
  afterAll(async () => {
    await closeHealthCheckConnections();
  });
  
  describe('GET /api/health', () => {
    it('should return 200 with health status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('checks');
    });
    
    it('should include database check', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.body.checks).toHaveProperty('database');
    });
    
    it('should return timestamp in ISO format', async () => {
      const response = await request(app).get('/api/health');
      
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
    });
  });
});