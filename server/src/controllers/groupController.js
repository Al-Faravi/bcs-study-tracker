const Group = require('../models/Group');
const User = require('../models/User');

// ১. নতুন স্টাডি গ্রুপ তৈরি করা
exports.createGroup = async (req, res) => {
  try {
    const { name, description, targetExam, icon, isPrivate, rules } = req.body;

    const newGroup = await Group.create({
      name,
      description,
      targetExam,
      icon,
      isPrivate,
      rules,
      admin: req.user.id, // যে তৈরি করছে সে-ই অ্যাডমিন
      members: [req.user.id] // অ্যাডমিন স্বয়ংক্রিয়ভাবে প্রথম মেম্বার হবে
    });

    res.status(201).json({ success: true, group: newGroup, message: 'স্টাডি গ্রুপ সফলভাবে তৈরি হয়েছে!' });
  } catch (error) {
    console.error('Group Creation Error:', error);
    res.status(500).json({ success: false, message: 'গ্রুপ তৈরি করার সময় সার্ভার এরর হয়েছে।' });
  }
};

// ২. সকল গ্রুপের তালিকা দেখা (সার্চ ও ফিল্টার সহ)
exports.getAllGroups = async (req, res) => {
  try {
    const { search, target } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (target) {
      query.targetExam = target;
    }

    const groups = await Group.find(query)
      .populate('admin', 'name email profilePic')
      .populate('members', 'name profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: groups.length, groups });
  } catch (error) {
    res.status(500).json({ success: false, message: 'গ্রুপ লোড করতে সমস্যা হচ্ছে।' });
  }
};

// ৩. নির্দিষ্ট একটি গ্রুপের বিস্তারিত দেখা
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('admin', 'name email profilePic')
      .populate('members', 'name email profilePic')
      .populate('joinRequests', 'name email profilePic');

    if (!group) {
      return res.status(404).json({ success: false, message: 'গ্রুপটি পাওয়া যায়নি!' });
    }

    res.status(200).json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, message: 'সার্ভার এরর।' });
  }
};

// ৪. গ্রুপে জয়েন করার রিকোয়েস্ট পাঠানো
exports.requestJoinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'গ্রুপ পাওয়া যায়নি!' });

    // চেক করা হচ্ছে ইউজার অলরেডি মেম্বার কিনা
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'আপনি ইতোমধ্যে এই গ্রুপের সদস্য!' });
    }

    // চেক করা হচ্ছে অলরেডি রিকোয়েস্ট পাঠানো আছে কিনা
    if (group.joinRequests.includes(req.user.id)) {
      return res.status(400).json({ message: 'আপনার জয়েন রিকোয়েস্ট ইতোমধ্যে অপেক্ষমাণ আছে!' });
    }

    group.joinRequests.push(req.user.id);
    await group.save();

    res.status(200).json({ success: true, message: 'জয়েন রিকোয়েস্ট পাঠানো হয়েছে! অ্যাডমিনের অনুমোদনের অপেক্ষা করুন।' });
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর।' });
  }
};

// ৫. জয়েন রিকোয়েস্ট অ্যাপ্রুভ (Approve) বা রিজেক্ট (Reject) করা (শুধুমাত্র অ্যাডমিনের জন্য)
exports.handleJoinRequest = async (req, res) => {
  try {
    const { userId, action } = req.body; // action হবে 'accept' অথবা 'reject'
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ message: 'গ্রুপ পাওয়া যায়নি!' });

    // চেক করা হচ্ছে রিকোয়েস্টকারী ইউজার গ্রুপের অ্যাডমিন কিনা
    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'অনুমতি নেই! শুধুমাত্র গ্রুপের অ্যাডমিন মেম্বার অ্যাপ্রুভ করতে পারবেন।' });
    }

    if (action === 'accept') {
      group.members.push(userId);
      group.joinRequests = group.joinRequests.filter(id => id.toString() !== userId);
      await group.save();
      return res.status(200).json({ success: true, message: 'সদস্যকে গ্রুপে যুক্ত করা হয়েছে!' });
    } else if (action === 'reject') {
      group.joinRequests = group.joinRequests.filter(id => id.toString() !== userId);
      await group.save();
      return res.status(200).json({ success: true, message: 'রিকোয়েস্ট বাতিল করা হয়েছে।' });
    } else {
      return res.status(400).json({ message: 'সঠিক অ্যাকশন প্রদান করুন (accept/reject)।' });
    }
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর।' });
  }
};