const logger = require('../src/utils/logger');

describe('Logger excludePII', () => {
  test('should redact email field', () => {
    const input = { email: 'user@example.com', other: 'data' };
    const result = logger.excludePII(input);
    expect(result.email).toBe('[REDACTED]');
    expect(result.other).toBe('data');
  });

  test('should redact name field', () => {
    const input = { name: 'John Doe', other: 'data' };
    const result = logger.excludePII(input);
    expect(result.name).toBe('[REDACTED]');
    expect(result.other).toBe('data');
  });

  test('should redact message field', () => {
    const input = { message: 'Secret message', other: 'data' };
    const result = logger.excludePII(input);
    expect(result.message).toBe('[REDACTED]');
    expect(result.other).toBe('data');
  });

  test('should redact all PII fields', () => {
    const input = {
      email: 'user@example.com',
      name: 'John Doe',
      message: 'Secret message',
      reference: 'HCP-20260922-0001'
    };
    const result = logger.excludePII(input);
    expect(result.email).toBe('[REDACTED]');
    expect(result.name).toBe('[REDACTED]');
    expect(result.message).toBe('[REDACTED]');
    expect(result.reference).toBe('HCP-20260922-0001');
  });

  test('should return non-object as-is', () => {
    expect(logger.excludePII(null)).toBe(null);
    expect(logger.excludePII(undefined)).toBe(undefined);
    expect(logger.excludePII('string')).toBe('string');
    expect(logger.excludePII(123)).toBe(123);
  });

  test('should not modify original object', () => {
    const input = { email: 'user@example.com', name: 'John' };
    const result = logger.excludePII(input);
    expect(input.email).toBe('user@example.com');
    expect(input.name).toBe('John');
    expect(result.email).toBe('[REDACTED]');
    expect(result.name).toBe('[REDACTED]');
  });

  test('should handle empty object', () => {
    const input = {};
    const result = logger.excludePII(input);
    expect(result).toEqual({});
  });
});
