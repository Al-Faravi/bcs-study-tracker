const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, toggleApplyJob } = require('../controllers/jobController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createJob)
  .get(protect, getAllJobs);

router.post('/:id/apply', protect, toggleApplyJob);

module.exports = router;