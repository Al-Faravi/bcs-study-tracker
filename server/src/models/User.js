const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'নাম দেওয়া বাধ্যতামূলক'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'ইমেইল দেওয়া বাধ্যতামূলক'], 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: [true, 'পাসওয়ার্ড দেওয়া বাধ্যতামূলক'], 
    minlength: 6,
    select: false 
  },
  role: { 
    type: String, 
    enum: ['student', 'admin'], 
    default: 'student' 
  },
  profilePic: { 
    type: String, 
    default: '' 
  },
  bio: { 
    type: String, 
    default: 'বিসিএস ও সরকারি চাকরির প্রস্তুতি নিচ্ছি।' 
  },
  phone: { 
    type: String, 
    default: '' 
  },
  // নতুন যোগ করা ফিল্ডসমূহ (Registration থেকে আসবে)
  dateOfBirth: { 
    type: String, 
    default: '' 
  },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other', 'পুরুষ', 'মহিলা', 'অন্যান্য', ''], 
    default: '' 
  },
  targetExam: { 
    type: String, 
    default: 'BCS Preliminary' 
  },
  education: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true });

// পাসওয়ার্ড হ্যাশ করা
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// পাসওয়ার্ড মেলানোর মেথড
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);