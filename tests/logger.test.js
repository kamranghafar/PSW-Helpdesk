const logger = require('../src/utils/logger');

describe('Logger', () => {
  describe('excludePII', () => {
    it('should redact email field', () => {
      const data = {
        email: 'test@example.com',
        reference: 'HCP-20260922-0001'
      };
      
      const sanitized = logger.excludePII(data);
      
      expect(sanitized.email).toBe('[REDACTED]');
      expect(sanitized.reference).toBe('HCP-20260922-0001');
    });
    
    it('should redact name field', () => {
      const data = {
        name: 'John Doe',
        timestamp: '2026-09-22T10:00:00Z'
      };
      
      const sanitized = logger.excludePII(data);
      
      expect(sanitized.name).toBe('[REDACTED]');
      expect(sanitized.timestamp).toBe('2026-09-22T10:00:00Z');
    });
    
    it('should redact message field', () => {
      const data = {
        message: 'This is a support request',
        ip: '192.168.1.1'
      };
      
      const sanitized = logger.excludePII(data);
      
      expect(sanitized.message).toBe('[REDACTED]');
      expect(sanitized.ip).toBe('192.168.1.1');
    });
    
    it('should handle data without PII fields', () => {
      const data = {
        reference: 'HCP-20260922-0001',
        status: 'new'
      };
      
      const sanitized = logger.excludePII(data);
      
      expect(sanitized).toEqual(data);
    });
  });
});