const express = require('express');
const router = express.Router();
const { getUsers, updateUserStatus, activateUser, deactivateUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validation');
const { cacheMiddleware, invalidateCache } = require('../middleware/cacheMiddleware');

// Cache users list for 2 minutes, invalidate on updates
router.route('/users').get(protect, authorize('admin'), cacheMiddleware('admin:users', 120), getUsers);
router.route('/users/:id/status').put(protect, authorize('admin'), validateObjectId('id'), invalidateCache('admin:users'), updateUserStatus);
router.route('/users/:id/activate').put(protect, authorize('admin'), validateObjectId('id'), invalidateCache('admin:users'), activateUser);
router.route('/users/:id/deactivate').put(protect, authorize('admin'), validateObjectId('id'), invalidateCache('admin:users'), deactivateUser);

module.exports = router;
