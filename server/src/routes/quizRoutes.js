const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createQuiz, getGroupQuizzes, submitQuiz } = require('../controllers/quizController');

// নতুন কুইজ তৈরি করার রুট
router.post('/', protect, createQuiz);

// কোনো গ্রুপের সব কুইজ দেখার রুট
router.get('/group/:groupId', protect, getGroupQuizzes);

// কুইজ সাবমিট করার রুট
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;