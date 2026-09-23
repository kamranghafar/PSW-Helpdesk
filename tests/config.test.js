const config = require('../src/config');

describe('Configuration', () => {
  test('config is defined', () => {
    expect(config).toBeDefined();
  });

  test('has port property', () => {
    expect(config.port).toBeDefined();
    expect(typeof config.port).toBe('number');
  });

  test('has nodeEnv property', () => {
    expect(config.nodeEnv).toBeDefined();
    expect(typeof config.nodeEnv).toBe('string');
  });

  test('has logLevel property', () => {
    expect(config.logLevel).toBeDefined();
    expect(typeof config.logLevel).toBe('string');
  });

  test('port defaults to 3000 in test', () => {
    expect(config.port).toBe(3000);
  });

  test('nodeEnv is test when running tests', () => {
    expect(config.nodeEnv).toBe('test');
  });
});