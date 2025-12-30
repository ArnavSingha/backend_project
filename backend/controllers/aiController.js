const { generateTaskSummary, generateTaskTags, generateTaskAIContent } = require('../utils/geminiAI');

// @desc    Generate AI summary for a task
// @route   POST /api/ai/summary
// @access  Private
exports.generateSummary = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const summary = await generateTaskSummary(title, description);

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('Generate summary error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate summary' });
  }
};

// @desc    Generate AI tags for a task
// @route   POST /api/ai/tags
// @access  Private
exports.generateTags = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const tags = await generateTaskTags(title, description);

    res.status(200).json({
      success: true,
      tags,
    });
  } catch (error) {
    console.error('Generate tags error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate tags' });
  }
};

// @desc    Generate both AI summary and tags for a task
// @route   POST /api/ai/generate
// @access  Private
exports.generateAIContent = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const { summary, tags } = await generateTaskAIContent(title, description);

    res.status(200).json({
      success: true,
      summary,
      tags,
    });
  } catch (error) {
    console.error('Generate AI content error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate AI content' });
  }
};
