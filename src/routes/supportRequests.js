const express = require('express');
const router = express.Router();
const { supportRequestValidation, handleValidationErrors } = require('../middleware/validation');

/**
 * POST /api/support-requests
 * Submit a new support request
 * 
 * Validates input per US-012 requirements:
 * - name: 1-120 characters required
 * - email: valid RFC 5322 format required
 * - subject: optional, maximum 200 characters
 * - message: 1-4000 characters required
 * 
 * Returns 201 with reference number on success
 * Returns 422 with field-level errors on validation failure
 */
router.post(
  '/',
  supportRequestValidation,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { name, email, subject, message } = req.body;
      
      // TODO: Future tasks will implement:
      // - US-014: Generate unique reference number (HCP-YYYYMMDD-NNNN)
      // - US-013: Store in database with encryption
      // - US-015: Enqueue email notification
      
      // Placeholder response for validation testing
      const reference = `HCP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-0001`;
      
      res.status(201).json({
        message: 'Support request received successfully',
        reference: reference,
        data: {
          name,
          email,
          subject: subject || null,
          message
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
