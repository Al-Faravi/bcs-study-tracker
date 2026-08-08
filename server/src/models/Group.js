const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'গ্রুপের নাম দেওয়া বাধ্যতামূলক'],
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'গ্রুপের বিবরণ দেওয়া প্রয়োজন'] 
  },
  targetExam: { 
    type: String, 
    required: true,
    default: 'BCS Preliminary' // যেমন: 47th BCS, Bank Job, Primary Teachers
  },
  icon: { 
    type: String, 
    default: 'Users' // ফ্রন্টএন্ডে Lucide আইকন দেখানোর জন্য
  },
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  joinRequests: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  isPrivate: { 
    type: Boolean, 
    default: false 
  },
  rules: [{ 
    type: String 
  }],
  
  // ✅ আমাদের নতুন Resources ফিল্ডটি এখানে যোগ করা হলো
  resources: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['video', 'pdf', 'link'], default: 'link' },
    addedAt: { type: Date, default: Date.now }
  }]
  
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);