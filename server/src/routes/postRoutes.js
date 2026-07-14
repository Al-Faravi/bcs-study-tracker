const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getAllPosts, 
  toggleVote, 
  addComment, 
  updatePost, 
  deletePost 
} = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

// ১. নতুন পোস্ট তৈরি এবং সকল পোস্ট লোড করা
router.route('/')
  .post(protect, createPost)
  .get(protect, getAllPosts);

// ২. নির্দিষ্ট পোস্ট এডিট (Update) এবং ডিলিট (Delete) করা
router.route('/:id')
  .put(protect, updatePost)
  .delete(protect, deletePost);

// ৩. পোস্টে ভোট এবং কমেন্ট করা
router.post('/:id/vote', protect, toggleVote);
router.post('/:id/comment', protect, addComment);

module.exports = router;