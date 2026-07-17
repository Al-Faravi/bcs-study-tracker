const Target = require('../models/Target');

// ১. নতুন টার্গেট তৈরি করা (Create Target)
exports.createTarget = async (req, res) => {
  try {
    const { title, subject, topics, date } = req.body;
    
    const newTarget = new Target({
      title,
      subject,
      topics,
      date: date || Date.now()
    });

    const savedTarget = await newTarget.save();
    res.status(201).json(savedTarget);
  } catch (error) {
    res.status(500).json({ message: "টার্গেট তৈরি করা যায়নি!", error: error.message });
  }
};

// ২. সব টার্গেট পাওয়া (Get All Targets)
exports.getTargets = async (req, res) => {
  try {
    // তারিখ অনুযায়ী সাজানো (নতুন টার্গেট আগে আসবে) এবং completedBy থেকে মেম্বারদের নাম ও ছবি নিয়ে আসা
    const targets = await Target.find()
      .populate('completedBy', 'name email avatar')
      .sort({ date: -1 });
      
    res.status(200).json(targets);
  } catch (error) {
    res.status(500).json({ message: "টার্গেট লোড করা যায়নি!", error: error.message });
  }
};

// ৩. টার্গেট কমপ্লিট করা বা আনচেক করা (Toggle Completion)
exports.toggleTargetCompletion = async (req, res) => {
  try {
    const targetId = req.params.id;
    const userId = req.user._id; // Auth middleware থেকে লগইন করা ইউজারের আইডি আসবে

    const target = await Target.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: "টার্গেট পাওয়া যায়নি!" });
    }

    // চেক করা হচ্ছে ইউজার আগেই কমপ্লিট করেছে কিনা
    const isCompleted = target.completedBy.includes(userId);

    if (isCompleted) {
      // যদি আগে থেকেই থাকে, তবে রিমুভ করব (Uncheck)
      target.completedBy.pull(userId);
    } else {
      // না থাকলে অ্যাড করব (Mark as Done)
      target.completedBy.push(userId);
    }

    await target.save();
    
    // আপডেট হওয়ার পর ইউজার ডেটাসহ আবার পাঠাচ্ছি
    const updatedTarget = await Target.findById(targetId).populate('completedBy', 'name email avatar');
    res.status(200).json(updatedTarget);
  } catch (error) {
    res.status(500).json({ message: "প্রগ্রেস আপডেট করা যায়নি!", error: error.message });
  }
};