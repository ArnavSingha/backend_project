const express = require('express');
const router = express.Router();
const { getUsers, updateUserStatus, activateUser, deactivateUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validation');

router.route('/users').get(protect, authorize('admin'), getUsers);
router.route('/users/:id/status').put(protect, authorize('admin'), validateObjectId('id'), updateUserStatus);
router.route('/users/:id/activate').put(protect, authorize('admin'), validateObjectId('id'), activateUser);
router.route('/users/:id/deactivate').put(protect, authorize('admin'), validateObjectId('id'), deactivateUser);

module.exports = router;
