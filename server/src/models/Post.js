const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'পোস্টের শিরোনাম দেওয়া বাধ্যতামূলক'], 
    trim: true 
  },
  content: { 
    type: String, 
    required: [true, 'বিস্তারিত অভিজ্ঞতা বা প্রশ্ন লিখুন'] 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Viva Experience', 'Preparation Strategy', 'Question & Solution', 'General Discussion'],
    default: 'General Discussion'
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  upvotes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  downvotes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  comments: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    text: { 
      type: String, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);