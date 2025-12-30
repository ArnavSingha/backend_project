const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validation');

// All routes require authentication
router.use(protect);

// Task statistics (must be before /:id route)
router.get('/stats', getTaskStats);

// CRUD routes
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(validateObjectId('id'), getTask)
  .put(validateObjectId('id'), updateTask)
  .delete(validateObjectId('id'), deleteTask);

module.exports = router;
