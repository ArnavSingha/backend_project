const express = require('express');
const router = express.Router();
const { getUsers, updateUserStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/users').get(protect, authorize('admin'), getUsers);
router.route('/users/:id/status').put(protect, authorize('admin'), updateUserStatus);

module.exports = router;
