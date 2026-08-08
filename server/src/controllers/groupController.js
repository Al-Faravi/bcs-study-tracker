const Group = require('../models/Group');
const User = require('../models/User');

// নতুন স্টাডি গ্রুপ তৈরি করা
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
      admin: req.user.id,
      members: [req.user.id]
    });

    res.status(201).json({ success: true, group: newGroup, message: 'স্টাডি গ্রুপ সফলভাবে তৈরি হয়েছে!' });
  } catch (error) {
    console.error('Group Creation Error:', error);
    res.status(500).json({ success: false, message: 'গ্রুপ তৈরি করার সময় সার্ভার এরর হয়েছে।' });
  }
};

// সকল গ্রুপের তালিকা দেখা (সার্চ ও ফিল্টার সহ)
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

// নির্দিষ্ট একটি গ্রুপের বিস্তারিত দেখা
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('admin', 'name email profilePic')
      .populate('members', 'name email profilePic')
      .populate('joinRequests', 'name email profilePic');

    if (!group) {
      return res.status(404).json({ success: false, message: 'গ্রুপটি পাওয়া যায়নি!' });
    }

    res.status(200).json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, message: 'সার্ভার এরর।' });
  }
};

// গ্রুপে জয়েন করার রিকোয়েস্ট পাঠানো
exports.requestJoinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'গ্রুপ পাওয়া যায়নি!' });

    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'আপনি ইতোমধ্যে এই গ্রুপের সদস্য!' });
    }

    if (group.joinRequests.includes(req.user.id)) {
      return res.status(400).json({ message: 'আপনার জয়েন রিকোয়েস্ট ইতোমধ্যে অপেক্ষমাণ আছে!' });
    }

    group.joinRequests.push(req.user.id);
    await group.save();

    res.status(200).json({ success: true, message: 'জয়েন রিকোয়েস্ট পাঠানো হয়েছে! অ্যাডমিনের অনুমোদনের অপেক্ষা করুন।' });
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর।' });
  }
};

// জয়েন রিকোয়েস্ট অ্যাপ্রুভ বা রিজেক্ট করা (শুধুমাত্র অ্যাডমিনের জন্য)
exports.handleJoinRequest = async (req, res) => {
  try {
    const { userId, action } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ message: 'গ্রুপ পাওয়া যায়নি!' });

    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'অনুমতি নেই! শুধুমাত্র গ্রুপের অ্যাডমিন মেম্বার অ্যাপ্রুভ করতে পারবেন।' });
    }

    if (action === 'accept') {
      group.members.push(userId);
      group.joinRequests = group.joinRequests.filter(id => id.toString() !== userId);
      await group.save();
      return res.status(200).json({ success: true, message: 'সদস্যকে গ্রুপ যুক্ত করা হয়েছে!' });
    } else if (action === 'reject') {
      group.joinRequests = group.joinRequests.filter(id => id.toString() !== userId);
      await group.save();
      return res.status(200).json({ success: true, message: 'রিকোয়েস্ট বাতিল করা হয়েছে।' });
    } else {
      return res.status(400).json({ message: 'সঠিক অ্যাকশন প্রদান করুন (accept/reject)।' });
    }
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর।' });
  }
};

// গ্রুপ আপডেট করা (রিসোর্স বা অন্যান্য ডেটা যোগ করার জন্য)
exports.updateGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'গ্রুপটি পাওয়া যায়নি!' });
    }

    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'অনুমতি নেই! শুধুমাত্র গ্রুপের অ্যাডমিন আপডেট করতে পারবেন।' });
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('admin', 'name email profilePic')
      .populate('members', 'name email profilePic')
      .populate('joinRequests', 'name email profilePic');

    res.status(200).json({ success: true, group: updatedGroup, message: 'গ্রুপ সফলভাবে আপডেট করা হয়েছে!' });
  } catch (error) {
    console.error('Group Update Error:', error);
    res.status(500).json({ success: false, message: 'গ্রুপ আপডেট করতে সমস্যা হয়েছে।' });
  }
};