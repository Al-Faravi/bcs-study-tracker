const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'চাকরির পদের নাম বাধ্যতামূলক'], 
    trim: true 
  },
  organization: { 
    type: String, 
    required: [true, 'প্রতিষ্ঠানের নাম প্রয়োজন'] // যেমন: বাংলাদেশ সরকারী কর্ম কমিশন (BPSC)
  },
  category: { 
    type: String, 
    required: true,
    enum: ['BCS', 'Bank Job', 'Primary & NTRCA', 'Government', 'Other'] 
  },
  vacancies: { 
    type: Number, 
    default: 1 
  },
  deadline: { 
    type: Date, 
    required: [true, 'আবেদনের শেষ তারিখ প্রয়োজন'] 
  },
  applicationLink: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // যে সকল ইউজার এই চাকরিটি নিজেদের ট্র্যাকারে সেভ বা অ্যাপ্লাইড হিসেবে মার্ক করেছে
  appliedUsers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);