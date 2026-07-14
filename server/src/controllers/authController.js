const User = require('../models/User');
const jwt = require('jsonwebtoken');

// টোকেন তৈরি করার হেল্পার ফাংশন
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// ১. ইউজার রেজিস্ট্রেশন
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, profilePic, dateOfBirth, gender, education } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট খোলা হয়েছে!' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      profilePic: profilePic || '',
      dateOfBirth: dateOfBirth || '',
      gender: gender || '',
      education: education || ''
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        bio: user.bio,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        targetExam: user.targetExam,
        education: user.education
      },
      token: generateToken(user._id),
      message: 'রেজিস্ট্রেশন সফল হয়েছে!'
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: 'রেজিস্ট্রেশন করার সময় সার্ভার এরর হয়েছে।' });
  }
};

// ২. ইউজার লগইন
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'ভুল ইমেইল অথবা পাসওয়ার্ড!' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        bio: user.bio,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        targetExam: user.targetExam,
        education: user.education
      },
      token: generateToken(user._id),
      message: 'লগইন সফল হয়েছে!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'সার্ভার এরর হয়েছে।' });
  }
};

// ৩. প্রোফাইল লোড করা
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'ইউজার পাওয়া যায়নি!' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'সার্ভার এরর।' });
  }
};

// ৪. প্রোফাইল আপডেট করা
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, bio, phone, targetExam, education, profilePic, dateOfBirth, gender } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'ইউজার পাওয়া যায়নি!' });
    }

    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.phone = phone !== undefined ? phone : user.phone;
    user.targetExam = targetExam || user.targetExam;
    user.education = education !== undefined ? education : user.education;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (profilePic) user.profilePic = profilePic;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        targetExam: updatedUser.targetExam,
        education: updatedUser.education,
        profilePic: updatedUser.profilePic
      },
      message: 'প্রোফাইল সফলভাবে আপডেট হয়েছে!'
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ success: false, message: 'প্রোফাইল আপডেট করার সময় সার্ভার এরর হয়েছে।' });
  }
};