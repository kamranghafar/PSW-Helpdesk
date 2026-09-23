const { logger, excludePII } = require('../src/utils/logger');

describe('Logger Utility', () => {
  describe('excludePII', () => {
    it('should redact email field', () => {
      const input = { email: 'test@example.com', other: 'data' };
      const result = excludePII(input);
      
      expect(result.email).toBe('[REDACTED]');
      expect(result.other).toBe('data');
    });

    it('should redact name field', () => {
      const input = { name: 'John Doe', other: 'data' };
      const result = excludePII(input);
      
      expect(result.name).toBe('[REDACTED]');
      expect(result.other).toBe('data');
    });

    it('should redact message field', () => {
      const input = { message: 'Secret message', other: 'data' };
      const result = excludePII(input);
      
      expect(result.message).toBe('[REDACTED]');
      expect(result.other).toBe('data');
    });

    it('should redact multiple PII fields', () => {
      const input = {
        email: 'test@example.com',
        name: 'John Doe',
        message: 'Secret',
        subject: 'Public'
      };
      const result = excludePII(input);
      
      expect(result.email).toBe('[REDACTED]');
      expect(result.name).toBe('[REDACTED]');
      expect(result.message).toBe('[REDACTED]');
      expect(result.subject).toBe('Public');
    });

    it('should leave other fields unchanged', () => {
      const input = {
        email: 'test@example.com',
        subject: 'Test Subject',
        timestamp: '2026-09-23T10:00:00Z',
        ip: '192.168.1.1'
      };
      const result = excludePII(input);
      
      expect(result.subject).toBe('Test Subject');
      expect(result.timestamp).toBe('2026-09-23T10:00:00Z');
      expect(result.ip).toBe('192.168.1.1');
    });

    it('should handle objects without PII fields', () => {
      const input = { subject: 'Test', other: 'data' };
      const result = excludePII(input);
      
      expect(result).toEqual(input);
    });

    it('should handle null input', () => {
      const result = excludePII(null);
      expect(result).toBeNull();
    });

    it('should handle undefined input', () => {
      const result = excludePII(undefined);
      expect(result).toBeUndefined();
    });

    it('should handle non-object input', () => {
      expect(excludePII('string')).toBe('string');
      expect(excludePII(123)).toBe(123);
      expect(excludePII(true)).toBe(true);
    });

    it('should not modify original object', () => {
      const input = { email: 'test@example.com', other: 'data' };
      const result = excludePII(input);
      
      expect(input.email).toBe('test@example.com');
      expect(result.email).toBe('[REDACTED]');
    });
  });
});
