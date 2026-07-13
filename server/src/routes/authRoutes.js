const express = require('express');
const router = express.Router();

const { register, login, getMe, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile); // <-- প্রোফাইল আপডেটের নতুন রাউট

module.exports = router;