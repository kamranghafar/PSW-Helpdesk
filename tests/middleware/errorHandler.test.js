const errorHandler = require('../../src/middleware/errorHandler');

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      path: '/test',
      method: 'GET'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('responds with error message', () => {
    const error = new Error('Test error');
    errorHandler(error, req, res, next);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Test error'
      })
    );
  });

  test('uses error status if provided', () => {
    const error = new Error('Test error');
    error.status = 404;
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('defaults to 500 status', () => {
    const error = new Error('Test error');
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('includes stack in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const error = new Error('Test error');
    errorHandler(error, req, res, next);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: expect.any(String)
      })
    );
    process.env.NODE_ENV = originalEnv;
  });

  test('excludes stack in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const error = new Error('Test error');
    errorHandler(error, req, res, next);
    expect(res.json).toHaveBeenCalledWith(
      expect.not.objectContaining({
        stack: expect.any(String)
      })
    );
    process.env.NODE_ENV = originalEnv;
  });
});