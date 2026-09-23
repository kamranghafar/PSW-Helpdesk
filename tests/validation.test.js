const request = require('supertest');
const express = require('express');
const { supportRequestValidation, handleValidationErrors } = require('../src/middleware/validation');

// Create test app with validation middleware
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.post('/test', supportRequestValidation, handleValidationErrors, (req, res) => {
    res.status(200).json({ success: true, data: req.body });
  });
  return app;
};

describe('Support Request Validation', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  const validRequest = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Test message'
  };

  describe('Complete valid request', () => {
    test('should accept valid request with all fields', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, subject: 'Test subject' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should accept valid request without optional subject', async () => {
      const response = await request(app)
        .post('/test')
        .send(validRequest);

      expect(response.status).toBe(200);
    });
  });

  describe('Name validation', () => {
    test('should reject empty name', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, name: '' });

      expect(response.status).toBe(422);
      expect(response.body.fields.name).toBeDefined();
    });

    test('should reject missing name', async () => {
      const response = await request(app)
        .post('/test')
        .send({ email: validRequest.email, message: validRequest.message });

      expect(response.status).toBe(422);
      expect(response.body.fields.name).toBeDefined();
    });

    test('should reject name exceeding 120 characters', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, name: 'a'.repeat(121) });

      expect(response.status).toBe(422);
      expect(response.body.fields.name).toContain('120');
    });

    test('should accept maximum length name (120 chars)', async () => {
      const maxName = 'a'.repeat(120);
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, name: maxName });

      expect(response.status).toBe(200);
    });

    test('should trim whitespace from name', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, name: '  John Doe  ' });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('John Doe');
    });

    test('should reject whitespace-only name', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, name: '   ' });

      expect(response.status).toBe(422);
      expect(response.body.fields.name).toBeDefined();
    });
  });

  describe('Email validation', () => {
    test('should accept valid email formats', async () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@test-domain.com'
      ];

      for (const email of validEmails) {
        const response = await request(app)
          .post('/test')
          .send({ ...validRequest, email });
        expect(response.status).toBe(200);
      }
    });

    test('should reject invalid email formats', async () => {
      const invalidEmails = [
        'invalid',
        'invalid@',
        '@example.com',
        'invalid@domain',
        'invalid..email@example.com'
      ];

      for (const email of invalidEmails) {
        const response = await request(app)
          .post('/test')
          .send({ ...validRequest, email });
        expect(response.status).toBe(422);
        expect(response.body.fields.email).toBeDefined();
      }
    });

    test('should reject empty email', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, email: '' });

      expect(response.status).toBe(422);
      expect(response.body.fields.email).toBeDefined();
    });

    test('should reject missing email', async () => {
      const response = await request(app)
        .post('/test')
        .send({ name: validRequest.name, message: validRequest.message });

      expect(response.status).toBe(422);
      expect(response.body.fields.email).toBeDefined();
    });

    test('should preserve email case (stored as given)', async () => {
      const email = 'User.Name@Example.COM';
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, email });

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe(email);
    });
  });

  describe('Subject validation', () => {
    test('should accept valid subject', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, subject: 'Help with application' });

      expect(response.status).toBe(200);
    });

    test('should accept missing subject (optional)', async () => {
      const response = await request(app)
        .post('/test')
        .send(validRequest);

      expect(response.status).toBe(200);
    });

    test('should accept empty subject (optional)', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, subject: '' });

      expect(response.status).toBe(200);
    });

    test('should reject subject exceeding 200 characters', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, subject: 'a'.repeat(201) });

      expect(response.status).toBe(422);
      expect(response.body.fields.subject).toContain('200');
    });

    test('should accept maximum length subject (200 chars)', async () => {
      const maxSubject = 'a'.repeat(200);
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, subject: maxSubject });

      expect(response.status).toBe(200);
    });

    test('should trim whitespace from subject', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, subject: '  Help needed  ' });

      expect(response.status).toBe(200);
      expect(response.body.data.subject).toBe('Help needed');
    });
  });

  describe('Message validation', () => {
    test('should accept valid message', async () => {
      const response = await request(app)
        .post('/test')
        .send(validRequest);

      expect(response.status).toBe(200);
    });

    test('should reject empty message', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, message: '' });

      expect(response.status).toBe(422);
      expect(response.body.fields.message).toBeDefined();
    });

    test('should reject missing message', async () => {
      const response = await request(app)
        .post('/test')
        .send({ name: validRequest.name, email: validRequest.email });

      expect(response.status).toBe(422);
      expect(response.body.fields.message).toBeDefined();
    });

    test('should reject message exceeding 4000 characters', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, message: 'a'.repeat(4001) });

      expect(response.status).toBe(422);
      expect(response.body.fields.message).toContain('4000');
    });

    test('should accept maximum length message (4000 chars)', async () => {
      const maxMessage = 'a'.repeat(4000);
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, message: maxMessage });

      expect(response.status).toBe(200);
    });

    test('should trim whitespace from message', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, message: '  Test message  ' });

      expect(response.status).toBe(200);
      expect(response.body.data.message).toBe('Test message');
    });

    test('should reject whitespace-only message', async () => {
      const response = await request(app)
        .post('/test')
        .send({ ...validRequest, message: '   ' });

      expect(response.status).toBe(422);
      expect(response.body.fields.message).toBeDefined();
    });
  });

  describe('Error handling', () => {
    test('should return errors for multiple invalid fields', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          name: '',
          email: 'invalid-email',
          subject: 'a'.repeat(201),
          message: ''
        });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.fields.name).toBeDefined();
      expect(response.body.fields.email).toBeDefined();
      expect(response.body.fields.subject).toBeDefined();
      expect(response.body.fields.message).toBeDefined();
    });

    test('should handle special characters in fields', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          name: 'John O\'Brien',
          email: 'john+test@example.com',
          subject: 'Question about <feature>',
          message: 'I have a question about the "new" feature & how it works.'
        });

      expect(response.status).toBe(200);
    });

    test('should handle Unicode characters', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          name: 'محمد علی',
          email: 'user@example.com',
          subject: 'مدد چاہیے',
          message: 'مجھے مدد کی ضرورت ہے۔'
        });

      expect(response.status).toBe(200);
    });
  });
});
