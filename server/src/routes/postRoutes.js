const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, toggleVote, addComment } = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createPost)
  .get(protect, getAllPosts);

router.post('/:id/vote', protect, toggleVote);
router.post('/:id/comment', protect, addComment);

module.exports = router;