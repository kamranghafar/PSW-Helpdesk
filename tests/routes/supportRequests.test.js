const request = require('supertest');
const express = require('express');
const supportRequestsRouter = require('../../src/routes/supportRequests');

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/support-requests', supportRequestsRouter);
  return app;
};

describe('POST /api/support-requests - Validation Rules', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('Valid submissions', () => {
    it('should accept valid request with all fields', async () => {
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: 'John Doe',
          email: 'john.doe@example.com',
          subject: 'Help with customs declaration',
          description: 'I need assistance with my customs declaration form.',
          priority: 'medium'
        });

      expect(response.status).toBe(501); // Not fully implemented yet
      expect(response.body).toHaveProperty('validated_data');
    });

    it('should accept valid request without optional subject', async () => {
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: 'Jane Smith',
          email: 'jane@example.com',
          description: 'Need help with my account.'
        });

      expect(response.status).toBe(501);
    });

    it('should accept valid request without optional priority', async () => {
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: 'Bob Johnson',
          email: 'bob@example.com',
          subject: 'Question',
          description: 'I have a question about the process.'
        });

      expect(response.status).toBe(501);
    });
  });

  describe('Name validation', () => {
    it('should reject empty name', async () => {
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: '',
          email: 'test@example.com',
          description: 'Test message'
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: 'Name is required'
          })
        ])
      );
    });

    it('should reject name exceeding 120 characters', async () => {
      const longName = 'a'.repeat(121);
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: longName,
          email: 'test@example.com',
          description: 'Test message'
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: 'Name must be between 1 and 120 characters'
          })
        ])
      );
    });

    it('should accept name with exactly 120 characters', async () => {
      const maxName = 'a'.repeat(120);
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: maxName,
          email: 'test@example.com',
          description: 'Test message'
        });

      expect(response.status).toBe(501);
    });

    it('should trim whitespace from name', async () => {
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: '  John Doe  ',
          email: 'test@example.com',
          description: 'Test message'
        });

      expect(response.status).toBe(501);
      expect(response.body.validated_data.name).toBe('John Doe');
    });
  });

  describe('Email validation', () => {
    it('should reject empty email', async () => {
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: 'John Doe',
          email: '',
          description: 'Test message'
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: 'Email is required'
          })
        ])
      );
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          description: 'Test message'
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: 'Email must be a valid RFC 5322 format'
          })
        ])
      );
    });

    it('should accept valid RFC 5322 email formats', async () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@sub.example.com'
      ];

      for (const email of validEmails) {
        const response = await request(app)
          .post('/api/support-requests')
          .send({
            name: 'John Doe',
            email,
            description: 'Test message'
          });

        expect(response.status).toBe(501);
      }
    });
  });

  describe('Subject validation', () => {
    it('should accept empty subject (optional field)', async () => {
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: 'John Doe',
          email: 'test@example.com',
          subject: '',
          description: 'Test message'
        });

      expect(response.status).toBe(501);
    });

    it('should reject subject exceeding 200 characters', async () => {
      const longSubject = 'a'.repeat(201);
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: 'John Doe',
          email: 'test@example.com',
          subject: longSubject,
          description: 'Test message'
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'subject',
            message: 'Subject must not exceed 200 characters'
          })
        ])
      );
    });

    it('should accept subject with exactly 200 characters', async () => {
      const maxSubject = 'a'.repeat(200);
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: 'John Doe',
          email: 'test@example.com',
          subject: maxSubject,
          description: 'Test message'
        });

      expect(response.status).toBe(501);
    });
  });

  describe('Description validation', () => {
    it('should reject empty description', async () => {
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: 'John Doe',
          email: 'test@example.com',
          description: ''
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'description',
            message: 'Description is required'
          })
        ])
      );
    });

    it('should reject description exceeding 4000 characters', async () => {
      const longDescription = 'a'.repeat(4001);
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: 'John Doe',
          email: 'test@example.com',
          description: longDescription
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'description',
            message: 'Description must be between 1 and 4000 characters'
          })
        ])
      );
    });

    it('should accept description with exactly 4000 characters', async () => {
      const maxDescription = 'a'.repeat(4000);
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: 'John Doe',
          email: 'test@example.com',
          description: maxDescription
        });

      expect(response.status).toBe(501);
    });
  });

  describe('Priority validation', () => {
    it('should accept valid priority values', async () => {
      const validPriorities = ['low', 'medium', 'high', 'critical'];

      for (const priority of validPriorities) {
        const response = await request(app)
          .post('/api/support-requests')
          .send({
            name: 'John Doe',
            email: 'test@example.com',
            description: 'Test message',
            priority
          });

        expect(response.status).toBe(501);
      }
    });

    it('should reject invalid priority value', async () => {
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: 'John Doe',
          email: 'test@example.com',
          description: 'Test message',
          priority: 'urgent'
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'priority',
            message: 'Priority must be one of: low, medium, high, critical'
          })
        ])
      );
    });
  });

  describe('Multiple validation errors', () => {
    it('should return all validation errors for multiple invalid fields', async () => {
      const response = await request(app)
        .post('/api/support-requests')
        .send({
          name: '',
          email: 'invalid-email',
          subject: 'a'.repeat(201),
          description: ''
        });

      expect(response.status).toBe(422);
      expect(response.body.errors.length).toBeGreaterThanOrEqual(4);
      
      const errorFields = response.body.errors.map(e => e.field);
      expect(errorFields).toContain('name');
      expect(errorFields).toContain('email');
      expect(errorFields).toContain('subject');
      expect(errorFields).toContain('description');
    });
  });
});