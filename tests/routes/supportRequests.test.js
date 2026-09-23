const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/support-requests', () => {
  const validPayload = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test subject',
    message: 'Test message'
  };

  test('returns 201 Created for valid request', async () => {
    const response = await request(app)
      .post('/api/support-requests')
      .send(validPayload);
    expect(response.status).toBe(201);
  });

  test('returns success message', async () => {
    const response = await request(app)
      .post('/api/support-requests')
      .send(validPayload);
    expect(response.body.message).toBe('Support request submitted successfully');
  });

  test('returns submitted data', async () => {
    const response = await request(app)
      .post('/api/support-requests')
      .send(validPayload);
    expect(response.body.data).toMatchObject(validPayload);
  });

  test('returns 400 for missing name', async () => {
    const response = await request(app)
      .post('/api/support-requests')
      .send({ ...validPayload, name: '' });
    expect(response.status).toBe(400);
  });

  test('returns 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/support-requests')
      .send({ ...validPayload, email: 'invalid-email' });
    expect(response.status).toBe(400);
  });

  test('returns 400 for missing message', async () => {
    const response = await request(app)
      .post('/api/support-requests')
      .send({ ...validPayload, message: '' });
    expect(response.status).toBe(400);
  });

  test('accepts optional subject', async () => {
    const { subject, ...payloadWithoutSubject } = validPayload;
    const response = await request(app)
      .post('/api/support-requests')
      .send(payloadWithoutSubject);
    expect(response.status).toBe(201);
  });

  test('enforces name maxlength 120', async () => {
    const response = await request(app)
      .post('/api/support-requests')
      .send({ ...validPayload, name: 'a'.repeat(121) });
    expect(response.status).toBe(400);
  });

  test('enforces subject maxlength 200', async () => {
    const response = await request(app)
      .post('/api/support-requests')
      .send({ ...validPayload, subject: 'a'.repeat(201) });
    expect(response.status).toBe(400);
  });

  test('enforces message maxlength 2000', async () => {
    const response = await request(app)
      .post('/api/support-requests')
      .send({ ...validPayload, message: 'a'.repeat(2001) });
    expect(response.status).toBe(400);
  });
});