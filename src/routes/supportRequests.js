const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('subject').optional().trim().isLength({ max: 200 }),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // In a real application, save to database or send email
    res.status(201).json({
      message: 'Support request submitted successfully',
      data: req.body
    });
  }
);

module.exports = router;
