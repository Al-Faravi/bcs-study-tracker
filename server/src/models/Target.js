const mongoose = require('mongoose');

const TargetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true
  },
  topics: [{
    type: String,
    required: true
  }],
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  // কোন কোন মেম্বার এই টার্গেট কমপ্লিট করেছে তাদের আইডি এখানে পুশ হবে
  completedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Target', TargetSchema);