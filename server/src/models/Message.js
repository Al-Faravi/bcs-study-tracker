const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group', 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  text: { 
    type: String, 
    default: '',
    trim: true 
  },
  // মেসেজটি কী ধরনের তা বোঝার জন্য (text, image, file, অথবা audio)
  messageType: { 
    type: String, 
    enum: ['text', 'image', 'file', 'audio'], 
    default: 'text' 
  },
  // ফাইল বা অডিওর Base64 ডেটা বা লিংক
  fileUrl: { 
    type: String, 
    default: '' 
  },
  // ফাইলের আসল নাম (যেমন: Lecture-1.pdf)
  fileName: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);