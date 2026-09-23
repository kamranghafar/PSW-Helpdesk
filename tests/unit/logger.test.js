const logger = require('../../src/utils/logger');

describe('Logger excludePII', () => {
  test('excludePII redacts email field', () => {
    const input = { email: 'user@example.com', other: 'data' };
    const result = logger.excludePII(input);
    
    expect(result.email).toBe('[REDACTED]');
    expect(result.other).toBe('data');
  });

  test('excludePII redacts name field', () => {
    const input = { name: 'John Doe', other: 'data' };
    const result = logger.excludePII(input);
    
    expect(result.name).toBe('[REDACTED]');
    expect(result.other).toBe('data');
  });

  test('excludePII redacts message field', () => {
    const input = { message: 'Sensitive message', other: 'data' };
    const result = logger.excludePII(input);
    
    expect(result.message).toBe('[REDACTED]');
    expect(result.other).toBe('data');
  });

  test('excludePII redacts all PII fields together', () => {
    const input = {
      email: 'user@example.com',
      name: 'John Doe',
      message: 'Sensitive message',
      subject: 'Support request',
      timestamp: '2024-01-01'
    };
    const result = logger.excludePII(input);
    
    expect(result.email).toBe('[REDACTED]');
    expect(result.name).toBe('[REDACTED]');
    expect(result.message).toBe('[REDACTED]');
    expect(result.subject).toBe('Support request');
    expect(result.timestamp).toBe('2024-01-01');
  });

  test('excludePII returns copy without modifying original', () => {
    const input = { email: 'user@example.com', name: 'John' };
    const result = logger.excludePII(input);
    
    expect(input.email).toBe('user@example.com');
    expect(input.name).toBe('John');
    expect(result.email).toBe('[REDACTED]');
    expect(result.name).toBe('[REDACTED]');
  });

  test('excludePII handles objects without PII fields', () => {
    const input = { subject: 'Test', timestamp: '2024-01-01' };
    const result = logger.excludePII(input);
    
    expect(result).toEqual(input);
  });

  test('excludePII handles null and undefined', () => {
    expect(logger.excludePII(null)).toBe(null);
    expect(logger.excludePII(undefined)).toBe(undefined);
  });

  test('excludePII handles non-object values', () => {
    expect(logger.excludePII('string')).toBe('string');
    expect(logger.excludePII(123)).toBe(123);
  });
});
