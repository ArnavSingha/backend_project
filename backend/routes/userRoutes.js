const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/password', protect, changePassword); // Alias for change-password

module.exports = router;
