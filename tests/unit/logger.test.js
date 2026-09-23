const { excludePII } = require('../../src/utils/logger');

describe('Logger PII Exclusion', () => {
  test('excludePII redacts email field', () => {
    const input = { email: 'user@example.com', other: 'data' };
    const result = excludePII(input);
    
    expect(result.email).toBe('[REDACTED]');
    expect(result.other).toBe('data');
  });

  test('excludePII redacts name field', () => {
    const input = { name: 'John Doe', id: '123' };
    const result = excludePII(input);
    
    expect(result.name).toBe('[REDACTED]');
    expect(result.id).toBe('123');
  });

  test('excludePII redacts message field', () => {
    const input = { message: 'Secret text', status: 'active' };
    const result = excludePII(input);
    
    expect(result.message).toBe('[REDACTED]');
    expect(result.status).toBe('active');
  });

  test('excludePII redacts all PII fields', () => {
    const input = {
      email: 'user@example.com',
      name: 'John Doe',
      message: 'Help needed',
      reference: 'HCP-20260923-0001'
    };
    const result = excludePII(input);
    
    expect(result.email).toBe('[REDACTED]');
    expect(result.name).toBe('[REDACTED]');
    expect(result.message).toBe('[REDACTED]');
    expect(result.reference).toBe('HCP-20260923-0001');
  });

  test('excludePII handles null input', () => {
    expect(excludePII(null)).toBeNull();
  });

  test('excludePII handles undefined input', () => {
    expect(excludePII(undefined)).toBeUndefined();
  });

  test('excludePII handles non-object input', () => {
    expect(excludePII('string')).toBe('string');
    expect(excludePII(123)).toBe(123);
  });
});
