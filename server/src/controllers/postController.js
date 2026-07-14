const Post = require('../models/Post');

// ১. নতুন পোস্ট বা অভিজ্ঞতা শেয়ার করা (ইউজারের ডাটা Populate সহ)
exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const newPost = await Post.create({
      title,
      content,
      category: category || 'General Discussion',
      author: req.user.id
    });

    // populate করা হচ্ছে যাতে ফ্রন্টএন্ডে সাথে সাথেই লেখকের নাম, রোল ও ছবি দেখায়
    const populatedPost = await Post.findById(newPost._id).populate('author', 'name profilePic role');

    res.status(201).json({ 
      success: true, 
      post: populatedPost, 
      message: 'আপনার অভিজ্ঞতা সফলভাবে প্রকাশিত হয়েছে!' 
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ success: false, message: 'পোস্ট প্রকাশ করার সময় সার্ভার এরর হয়েছে।' });
  }
};

// ২. সকল পোস্ট লোড করা (সার্চ ও ফিল্টার সহ)
exports.getAllPosts = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const posts = await Post.find(query)
      .populate('author', 'name profilePic role')
      .populate('comments.user', 'name profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পোস্ট লোড করতে সমস্যা হচ্ছে।' });
  }
};

// ৩. পোস্টে Upvote বা Downvote দেওয়া
exports.toggleVote = async (req, res) => {
  try {
    const { type } = req.body; // type হবে 'upvote' অথবা 'downvote'
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'পোস্টটি পাওয়া যায়নি!' });

    const userId = req.user.id;
    const hasUpvoted = post.upvotes.includes(userId);
    const hasDownvoted = post.downvotes.includes(userId);

    if (type === 'upvote') {
      if (hasUpvoted) {
        post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
      } else {
        post.upvotes.push(userId);
        post.downvotes = post.downvotes.filter(id => id.toString() !== userId);
      }
    } else if (type === 'downvote') {
      if (hasDownvoted) {
        post.downvotes = post.downvotes.filter(id => id.toString() !== userId);
      } else {
        post.downvotes.push(userId);
        post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
      }
    }

    await post.save();
    res.status(200).json({ success: true, upvotes: post.upvotes, downvotes: post.downvotes });
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর।' });
  }
};

// ৪. পোস্টে কমেন্ট বা উত্তর দেওয়া
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'কমেন্টের জন্য কিছু লিখুন!' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'পোস্টটি পাওয়া যায়নি!' });

    post.comments.push({
      user: req.user.id,
      text
    });

    await post.save();
    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'name profilePic role')
      .populate('comments.user', 'name profilePic');

    res.status(200).json({ success: true, post: updatedPost, message: 'কমেন্ট যুক্ত করা হয়েছে!' });
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর।' });
  }
};

// ৫. পোস্ট এডিট/আপডেট করা (২ মিনিটের সময়সীমা ও ইউজার সিকিউরিটি সহ)
exports.updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'পোস্টটি পাওয়া যায়নি!' });
    }

    // সিকিউরিটি চেক: ইউজার পোস্টের আসল লেখক কিনা
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'আপনি এই পোস্টটি এডিট করার অধিকারী নন!' });
    }

    // টাইম লিমিট চেক: সার্ভার সাইডে দেখা হচ্ছে ২ মিনিট (১২০ সেকেন্ড) পার হয়েছে কিনা (এডমিন বাদে)
    const diffInSeconds = (Date.now() - new Date(post.createdAt).getTime()) / 1000;
    if (diffInSeconds > 120 && req.user.role !== 'admin') {
      return res.status(400).json({ success: false, message: '২ মিনিট সময় পার হয়ে গেছে, আর এডিট করা সম্ভব নয়!' });
    }

    // তথ্য আপডেট
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    await post.save();

    // আপডেট করা পোস্টটি আবার populate করে পাঠানো হচ্ছে
    const populatedPost = await Post.findById(post._id).populate('author', 'name profilePic role');

    res.status(200).json({
      success: true,
      post: populatedPost,
      message: 'পোস্টটি সফলভাবে আপডেট করা হয়েছে!'
    });
  } catch (error) {
    console.error('Update Post Error:', error);
    res.status(500).json({ success: false, message: 'পোস্ট আপডেট করার সময় সার্ভার এরর হয়েছে।' });
  }
};

// ৬. পোস্ট ডিলিট করা
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'পোস্টটি পাওয়া যায়নি!' });
    }

    // চেক করা হচ্ছে যে ইউজার পোস্টটি ডিলিট করতে চাচ্ছেন তিনি আসলেই এর লেখক কিনা
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'আপনি এই পোস্টটি ডিলিট করার অধিকারী নন!' });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'পোস্টটি সফলভাবে ডিলিট করা হয়েছে!'
    });
  } catch (error) {
    console.error('Delete Post Error:', error);
    res.status(500).json({ success: false, message: 'পোস্ট ডিলিট করার সময় সার্ভার এরর হয়েছে।' });
  }
};