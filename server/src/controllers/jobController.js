const Job = require('../models/Job');

// ১. নতুন চাকরির সার্কুলার পোস্ট করা (অ্যাডমিন বা ভেরিফাইড ইউজার)
exports.createJob = async (req, res) => {
  try {
    const { title, organization, category, vacancies, deadline, applicationLink, description } = req.body;

    const newJob = await Job.create({
      title,
      organization,
      category,
      vacancies,
      deadline,
      applicationLink,
      description,
      postedBy: req.user.id
    });

    res.status(201).json({ success: true, job: newJob, message: 'চাকরির বিজ্ঞপ্তি সফলভাবে প্রকাশিত হয়েছে!' });
  } catch (error) {
    console.error('Create Job Error:', error);
    res.status(500).json({ success: false, message: 'বিজ্ঞপ্তি প্রকাশ করার সময় সার্ভার এরর হয়েছে।' });
  }
};

// ২. সকল সার্কুলার লোড করা (সার্চ ও ক্যাটাগরি ফিল্টার সহ)
exports.getAllJobs = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    // শেষ তারিখ অনুযায়ী সাজানো হবে (যেটার সময় কম সেটা আগে দেখাবে)
    const jobs = await Job.find(query)
      .populate('postedBy', 'name profilePic')
      .sort({ deadline: 1 });

    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'সার্কুলার লোড করতে সমস্যা হচ্ছে।' });
  }
};

// ৩. চাকরিতে আবেদন করেছি (Applied) হিসেবে মার্ক বা আনমার্ক করা
exports.toggleApplyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'সার্কুলারটি পাওয়া যায়নি!' });

    const isApplied = job.appliedUsers.includes(req.user.id);

    if (isApplied) {
      // ইতোমধ্যে অ্যাপ্লাইড থাকলে লিস্ট থেকে রিমুভ করবে
      job.appliedUsers = job.appliedUsers.filter(id => id.toString() !== req.user.id);
      await job.save();
      return res.status(200).json({ success: true, isApplied: false, message: 'ট্র্যাকার থেকে রিমুভ করা হয়েছে।' });
    } else {
      // নতুন করে অ্যাপ্লাইড লিস্টে যোগ করবে
      job.appliedUsers.push(req.user.id);
      await job.save();
      return res.status(200).json({ success: true, isApplied: true, message: 'আপনার অ্যাপ্লিকেশান ট্র্যাকারে যুক্ত করা হয়েছে!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর।' });
  }
};