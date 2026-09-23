const { body, validationResult } = require('express-validator');

/**
 * Validation rules for support request submission
 * Enforces BR-009, BR-026, BR-027, BR-028, BR-029
 */
const supportRequestValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 120 })
    .withMessage('Name must be between 1 and 120 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),
  
  body('subject')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject must not exceed 200 characters'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 4000 })
    .withMessage('Message must be between 1 and 4000 characters')
];

/**
 * Middleware to handle validation errors
 * Returns HTTP 422 with field-level error messages per BR-019
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().reduce((acc, error) => {
      acc[error.path] = error.msg;
      return acc;
    }, {});
    
    return res.status(422).json({
      error: 'Validation failed',
      fields: formattedErrors
    });
  }
  next();
};

module.exports = {
  supportRequestValidation,
  handleValidationErrors
};
