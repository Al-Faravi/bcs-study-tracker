const Message = require('../models/Message');

// নির্দিষ্ট গ্রুপের আগের সব মেসেজ লোড করা
exports.getGroupMessages = async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .populate('sender', 'name profilePic role')
      .sort({ createdAt: 1 }); // পুরনো মেসেজ উপরে, নতুন মেসেজ নিচে

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'মেসেজ লোড করতে সমস্যা হয়েছে।' });
  }
};