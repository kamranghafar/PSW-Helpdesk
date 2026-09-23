const config = require('../src/config');

describe('Configuration', () => {
  it('should have database config', () => {
    expect(config.database).toBeDefined();
    expect(config.database.url).toBeDefined();
  });

  it('should have redis config', () => {
    expect(config.redis).toBeDefined();
    expect(config.redis.url).toBeDefined();
  });

  it('should have rateLimit config', () => {
    expect(config.rateLimit).toBeDefined();
    expect(config.rateLimit.windowMs).toBeDefined();
    expect(config.rateLimit.maxRequests).toBeDefined();
  });

  it('should have security config', () => {
    expect(config.security).toBeDefined();
    expect(config.security.bodyLimit).toBeDefined();
    expect(config.security.corsOrigin).toBeDefined();
  });

  it('should have correct default values', () => {
    expect(config.rateLimit.windowMs).toBe(600000); // 10 minutes
    expect(config.rateLimit.maxRequests).toBe(5);
    expect(config.security.bodyLimit).toBe('10kb');
  });
});
