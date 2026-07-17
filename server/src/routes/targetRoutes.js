const express = require('express');
const router = express.Router();
const { createTarget, getTargets, toggleTargetCompletion } = require('../controllers/targetController');
// ✅ ফিক্সড: ফোল্ডারের নামের শেষে 's' যোগ করা হয়েছে (middlewares)
const { protect } = require('../middlewares/authMiddleware'); 

// রুটসগুলো সেট করা হচ্ছে
router.route('/')
  .post(protect, createTarget)  
  .get(protect, getTargets);    

router.route('/:id/toggle')
  .put(protect, toggleTargetCompletion); 

module.exports = router;