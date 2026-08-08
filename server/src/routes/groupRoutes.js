const express = require('express');
const router = express.Router();
const { 
  createGroup, 
  getAllGroups, 
  getGroupById, 
  requestJoinGroup, 
  handleJoinRequest,
  updateGroup 
} = require('../controllers/groupController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createGroup)
  .get(protect, getAllGroups);

router.route('/:id')
  .get(protect, getGroupById)
  .put(protect, updateGroup); // রিসোর্স সেভ বা আপডেট করার PUT রুট

router.post('/:id/join', protect, requestJoinGroup);
router.post('/:id/request', protect, handleJoinRequest);

module.exports = router;