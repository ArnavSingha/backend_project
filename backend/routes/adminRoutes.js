const express = require('express');
const router = express.Router();
const { getUsers, updateUserStatus, activateUser, deactivateUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/users').get(protect, authorize('admin'), getUsers);
router.route('/users/:id/status').put(protect, authorize('admin'), updateUserStatus);
router.route('/users/:id/activate').put(protect, authorize('admin'), activateUser);
router.route('/users/:id/deactivate').put(protect, authorize('admin'), deactivateUser);

module.exports = router;
