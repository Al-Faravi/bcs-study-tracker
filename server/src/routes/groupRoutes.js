const express = require('express');
const router = express.Router();
const { 
  createGroup, 
  getAllGroups, 
  getGroupById, 
  requestJoinGroup, 
  handleJoinRequest 
} = require('../controllers/groupController');
const { protect } = require('../middlewares/authMiddleware');

// সব রাউটের আগেই protect মিডলওয়্যার দেওয়া হয়েছে, অর্থাৎ লগইন ছাড়া কেউ গ্রুপ অ্যাকসেস পাবে না
router.route('/')
  .post(protect, createGroup)
  .get(protect, getAllGroups);

router.route('/:id')
  .get(protect, getGroupById);

router.post('/:id/join', protect, requestJoinGroup);
router.post('/:id/request', protect, handleJoinRequest);

module.exports = router;