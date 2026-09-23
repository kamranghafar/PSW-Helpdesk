const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation rules for support request fields
// Note: Task spec refers to "message" field, but form uses "description" to match user story requirements
const supportRequestValidation = [
  // Name: required, 1-120 characters
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 1, max: 120 }).withMessage('Name must be between 1 and 120 characters'),
  
  // Email: required, valid RFC 5322 format
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid RFC 5322 format')
    .normalizeEmail(),
  
  // Subject: optional, maximum 200 characters
  body('subject')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage('Subject must not exceed 200 characters'),
  
  // Description: required, 1-4000 characters (maps to "message" in task spec)
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 1, max: 4000 }).withMessage('Description must be between 1 and 4000 characters'),
  
  // Priority: optional, must be one of the allowed values
  body('priority')
    .optional({ checkFalsy: true })
    .isIn(['low', 'medium', 'high', 'critical']).withMessage('Priority must be one of: low, medium, high, critical')
];

/**
 * POST /api/support-requests
 * Create new support request with validation
 * Returns 422 with field-level errors if validation fails
 */
router.post('/', supportRequestValidation, (req, res) => {
  // Check validation results
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Return 422 Unprocessable Entity with field-level error messages
    return res.status(422).json({
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  // Extract validated data
  const { name, email, subject, description, priority } = req.body;
  
  // TODO: Implement full functionality per US-011, US-013, US-014
  // - Generate reference number (HCP-YYYYMMDD-NNNN)
  // - Store in database with encryption
  // - Enqueue email notification
  // For now, return 501 to indicate endpoint is not fully implemented
  res.status(501).json({ 
    message: 'Support request endpoint validation implemented, database storage pending',
    validated_data: { name, email, subject, description, priority }
  });
});

module.exports = router;