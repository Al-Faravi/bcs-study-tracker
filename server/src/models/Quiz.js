const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group', 
    required: true 
  },
  title: { 
    type: String, 
    required: true // যেমন: "বাংলা সাহিত্য - চর্যাপদ স্পেশাল কুইজ"
  },
  subject: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true // পরীক্ষার সময় (মিনিটে), যেমন: ১০
  },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }], // ৪টি অপশন থাকবে
      correctAnswer: { type: String, required: true }, // সঠিক উত্তরটি এখানে থাকবে
      explanation: { type: String, default: '' } // 👈 এই নতুন লাইনটা যোগ করা হলো
    }
  ],
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number },
      totalAttempted: { type: Number },
      submittedAt: { type: Date, default: Date.now }
    }
  ],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);