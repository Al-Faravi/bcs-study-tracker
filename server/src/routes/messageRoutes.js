const express = require('express');
const router = express.Router();
const { getGroupMessages } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/:groupId', protect, getGroupMessages);

module.exports = router;