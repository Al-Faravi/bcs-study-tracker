const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. রেজিস্ট্রেশন কন্ট্রোলার
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'ইউজার অলরেডি এক্সিস্ট করে!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'সফলভাবে রেজিস্ট্রেশন সম্পন্ন হয়েছে!' });
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর হয়েছে।' });
  }
};

// 2. লগইন কন্ট্রোলার
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ইউজার খুঁজে বের করা
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'ইউজার খুঁজে পাওয়া যায়নি।' });

    // পাসওয়ার্ড চেক করা
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'ভুল পাসওয়ার্ড!' });

    // JWT টোকেন জেনারেট করা
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর।' });
  }
};

// 3. ইউজার প্রোফাইল দেখার কন্ট্রোলার (Protected)
exports.getMe = async (req, res) => {
  try {
    // req.user.id আসবে authMiddleware থেকে
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'ইউজার পাওয়া যায়নি।' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর।' });
  }
};

// 4. ইউজারের প্রোফাইল তথ্য আপডেট করা (নতুন ফাংশন)
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, bio, phone, targetExam, education, profilePic } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'ইউজার পাওয়া যায়নি!' });
    }

    // তথ্যগুলো আপডেট করা হচ্ছে
    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.phone = phone !== undefined ? phone : user.phone;
    user.targetExam = targetExam || user.targetExam;
    user.education = education !== undefined ? education : user.education;
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
        targetExam: updatedUser.targetExam,
        education: updatedUser.education,
        profilePic: updatedUser.profilePic
      },
      message: 'প্রোফাইল সফলভাবে আপডেট হয়েছে!'
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ success: false, message: 'প্রোফাইল আপডেট করার সময় সার্ভার এরর হয়েছে।' });
  }
};