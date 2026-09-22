const config = require('../src/config');

describe('Configuration', () => {
  it('should load default values', () => {
    expect(config.env).toBeDefined();
    expect(config.port).toBeDefined();
    expect(config.logLevel).toBeDefined();
  });
  
  it('should have database configuration', () => {
    expect(config.database).toHaveProperty('url');
  });
  
  it('should have redis configuration', () => {
    expect(config.redis).toHaveProperty('url');
  });
  
  it('should have rate limit configuration', () => {
    expect(config.rateLimit).toHaveProperty('windowMs');
    expect(config.rateLimit).toHaveProperty('maxRequests');
    expect(config.rateLimit.maxRequests).toBe(5);
  });
  
  it('should have security configuration', () => {
    expect(config.security).toHaveProperty('bodyLimit');
    expect(config.security).toHaveProperty('corsOrigin');
  });
});