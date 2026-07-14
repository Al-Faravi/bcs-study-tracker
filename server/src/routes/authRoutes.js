const express = require('express');
const router = express.Router();
// কন্ট্রোলার থেকে আপডেটেড ফাংশনগুলো ইমপোর্ট করা হচ্ছে
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
// প্রোটেক্টেড রাউটের জন্য মিডলওয়্যার ইমপোর্ট করা হচ্ছে
const { protect } = require('../middlewares/authMiddleware');

// ১. ইউজার রেজিস্ট্রেশন রাউট
router.post('/register', registerUser);

// ২. ইউজার লগইন রাউট
router.post('/login', loginUser);

// ৩. ইউজারের নিজস্ব প্রোফাইল দেখার রাউট (Protected)
router.get('/profile', protect, getUserProfile);

// ৪. ইউজারের প্রোফাইল তথ্য আপডেট করার রাউট (Protected)
router.put('/profile', protect, updateUserProfile);

module.exports = router;