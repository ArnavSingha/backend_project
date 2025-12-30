const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generateSummary,
  generateTags,
  generateAIContent,
} = require('../controllers/aiController');

// All routes are protected
router.use(protect);

// Generate AI summary
router.post('/summary', generateSummary);

// Generate AI tags
router.post('/tags', generateTags);

// Generate both summary and tags
router.post('/generate', generateAIContent);

module.exports = router;
