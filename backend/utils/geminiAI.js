const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the correct model name
const MODEL_NAME = 'gemini-2.0-flash';

// Enable fallback mode when API quota is exceeded
const USE_FALLBACK = process.env.AI_FALLBACK_MODE === 'true';

/**
 * Fallback summary generator (no API call)
 */
const generateFallbackSummary = (title, description) => {
  const cleanTitle = title.trim();
  if (description && description.trim()) {
    return `Complete: ${cleanTitle}. ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`;
  }
  return `Action required: ${cleanTitle}`;
};

/**
 * Fallback tags generator (no API call)
 */
const generateFallbackTags = (title, description) => {
  const text = `${title} ${description || ''}`.toLowerCase();
  const tagMap = {
    'meeting': 'meeting',
    'call': 'communication',
    'email': 'communication',
    'review': 'review',
    'code': 'coding',
    'bug': 'bugfix',
    'fix': 'bugfix',
    'test': 'testing',
    'deploy': 'deployment',
    'design': 'design',
    'document': 'documentation',
    'report': 'reporting',
    'urgent': 'urgent',
    'asap': 'urgent',
    'important': 'priority',
    'deadline': 'deadline',
    'learn': 'learning',
    'study': 'learning',
    'research': 'research',
    'plan': 'planning',
    'setup': 'setup',
    'install': 'setup',
    'update': 'update',
    'create': 'creation',
    'build': 'development',
  };

  const tags = new Set();
  for (const [keyword, tag] of Object.entries(tagMap)) {
    if (text.includes(keyword)) {
      tags.add(tag);
    }
  }

  // Add default tag if no matches
  if (tags.size === 0) {
    tags.add('task');
  }

  return Array.from(tags).slice(0, 4);
};

/**
 * Generate a concise summary for a task
 * @param {string} title - Task title
 * @param {string} description - Task description
 * @returns {Promise<string>} - Generated summary
 */
exports.generateTaskSummary = async (title, description) => {
  // Use fallback if enabled
  if (USE_FALLBACK) {
    return generateFallbackSummary(title, description);
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `You are a task management assistant. Generate a brief, actionable summary (1-2 sentences, max 100 characters) for this task.

Task Title: ${title}
Task Description: ${description || 'No description provided'}

Requirements:
- Be concise and action-oriented
- Focus on the key objective
- Do not include any formatting or quotes
- Just return the plain summary text`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    // Ensure summary is not too long
    return summary.length > 150 ? summary.substring(0, 147) + '...' : summary;
  } catch (error) {
    console.error('Gemini AI Summary Error:', error.message);
    // Fallback on error
    console.log('Using fallback summary generator');
    return generateFallbackSummary(title, description);
  }
};

/**
 * Generate relevant tags for a task
 * @param {string} title - Task title
 * @param {string} description - Task description
 * @returns {Promise<string[]>} - Array of generated tags
 */
exports.generateTaskTags = async (title, description) => {
  // Use fallback if enabled
  if (USE_FALLBACK) {
    return generateFallbackTags(title, description);
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `You are a task management assistant. Generate 2-4 relevant tags for categorizing this task.

Task Title: ${title}
Task Description: ${description || 'No description provided'}

Requirements:
- Return ONLY comma-separated tags, nothing else
- Each tag should be 1-2 words, lowercase
- Tags should be relevant for task categorization
- Examples: work, personal, urgent, meeting, coding, design, review
- Do not include any explanation or formatting`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tagsText = response.text().trim();

    // Parse tags from response
    const tags = tagsText
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0 && tag.length <= 20)
      .slice(0, 5); // Max 5 tags

    return tags;
  } catch (error) {
    console.error('Gemini AI Tags Error:', error.message);
    // Fallback on error
    console.log('Using fallback tags generator');
    return generateFallbackTags(title, description);
  }
};

/**
 * Generate both summary and tags for a task
 * @param {string} title - Task title
 * @param {string} description - Task description
 * @returns {Promise<{summary: string, tags: string[]}>}
 */
exports.generateTaskAIContent = async (title, description) => {
  try {
    const [summary, tags] = await Promise.all([
      exports.generateTaskSummary(title, description),
      exports.generateTaskTags(title, description),
    ]);

    return { summary, tags };
  } catch (error) {
    console.error('Gemini AI Content Error:', error);
    throw new Error('Failed to generate AI content');
  }
};
