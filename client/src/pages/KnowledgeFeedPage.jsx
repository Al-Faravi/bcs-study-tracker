import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, Send, Tag, Filter, Plus, User, CheckCircle2, HelpCircle, Lightbulb, Sparkles, BookOpen } from 'lucide-react';

const initialPosts = [
  {
    id: 1,
    author: "Md. Shakawat Hossain Faravi",
    avatarInitials: "MF",
    role: "Admin & Developer",
    time: "২ ঘণ্টা আগে",
    tag: "Tips & Tricks",
    content: "বিসিএস প্রিলিমিনারির জন্য বাংলাদেশ বিষয়াবলির সংবিধান অংশ মনে রাখার সবচেয়ে সহজ উপায় হলো ১ থেকে ৪৭ অনুচ্ছেদ গল্প বানিয়ে পড়া। কেউ চাইলে আমার তৈরি করা হ্যান্ডনোটটি নিচের কমেন্ট থেকে দেখে নিতে পারেন।",
    likes: 24,
    isLiked: false,
    comments: [
      { id: 101, author: "Sajjad", text: "ভাই, আপনার নোটটা দারুণ হয়েছে! অনেক ধন্যবাদ।" },
      { id: 102, author: "Nafis", text: "৪৫ নম্বর অনুচ্ছেদটা একটু কনফিউজিং ছিল, এখন ক্লিয়ার।" }
    ]
  },
  {
    id: 2,
    author: "Tanvir Ahmed",
    avatarInitials: "TA",
    role: "BCS Aspirant",
    time: "৫ ঘণ্টা আগে",
    tag: "Question / Doubt",
    content: "কেউ কি বলতে পারবেন—সম্প্রতি চালু হওয়া 'সর্বজনীন পেনশন স্কিম'-এর ৪টি প্যাকেজের নাম এবং চাঁদার হারগুলো সহজে মনে রাখার কোনো শর্টকাট আছে কিনা?",
    likes: 12,
    isLiked: true,
    comments: [
      { id: 103, author: "Rakib", text: "প্রবাস, প্রগতি, সুরক্ষা আর সমতা—এই ৪টা নাম সিরিয়ালি মনে রাখেন ভাই।" }
    ]
  },
  {
    id: 3,
    author: "Sadia Islam",
    avatarInitials: "SI",
    role: "Bank Aspirant",
    time: "গতকাল",
    tag: "Motivation",
    content: "ধারাবাহিকতা (Consistency) হলো সাফল্যের চাবিকাঠি। প্রতিদিন ১০ ঘণ্টা পড়ার চেয়ে প্রতিদিন ৪ ঘণ্টা করে ৩৬৫ দিন পড়া অনেক বেশি কার্যকর। সবাই নিজের সর্বোচ্চ চেষ্টা চালিয়ে যান!",
    likes: 45,
    isLiked: false,
    comments: []
  }
];

const KnowledgeFeedPage = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedTag, setSelectedTag] = useState('All');
  
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('Tips & Tricks');
  const [commentInputs, setCommentInputs] = useState({});

  const handleLikeToggle = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleAddComment = (e, postId) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || commentText.trim() === '') return;

    const newComment = {
      id: Date.now(),
      author: "You (Faravi)",
      text: commentText
    };

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });

    setPosts(updatedPosts);
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (newPostContent.trim() === '') return;

    const newPostObj = {
      id: Date.now(),
      author: "Md. Shakawat Hossain Faravi",
      avatarInitials: "MF",
      role: "You (Admin)",
      time: "এইমাত্র",
      tag: newPostTag,
      content: newPostContent,
      likes: 0,
      isLiked: false,
      comments: []
    };

    setPosts([newPostObj, ...posts]);
    setNewPostContent('');
  };

  const filteredPosts = selectedTag === 'All' 
    ? posts 
    : posts.filter(p => p.tag === selectedTag);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f0f4f8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* ================= HEADER & FILTER ================= */}
        <div className="neu-card p-6 border border-white/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl neu-inset text-indigo-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span>অভিজ্ঞতা শেয়ারিং ও ফোরাম</span>
            </h1>
            <p className="text-sm text-slate-600">
              পড়াশোনার টিপস, কঠিন প্রশ্নের সমাধান ও রেফারেন্স শেয়ার করুন হাজারো চাকরিপ্রার্থীর সাথে।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['All', 'Tips & Tricks', 'Question / Doubt', 'Motivation', 'Resource Share'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedTag === tag 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'neu-btn text-slate-600 hover:text-indigo-600'
                }`}
              >
                {tag === 'All' ? 'সকল পোস্ট' : tag}
              </button>
            ))}
          </div>
        </div>

        {/* ================= CREATE POST BOX ================= */}
        <div className="neu-card p-6 border border-white/60 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>আপনার কোনো টিপস বা প্রশ্ন শেয়ার করতে চান?</span>
          </div>
          
          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea 
              placeholder="এখানে আপনার প্রশ্ন, পড়ার টেকনিক বা অভিজ্ঞতা বিস্তারিত লিখুন..." 
              className="w-full p-4 neu-inset rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 h-28 leading-relaxed"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              required
            ></textarea>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-1">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  ট্যাগ:
                </span>
                <select 
                  className="px-3 py-1.5 neu-inset rounded-xl text-xs font-bold text-indigo-600 focus:outline-none"
                  value={newPostTag}
                  onChange={(e) => setNewPostTag(e.target.value)}
                >
                  <option>Tips & Tricks</option>
                  <option>Question / Doubt</option>
                  <option>Motivation</option>
                  <option>Resource Share</option>
                </select>
              </div>
              
              <button type="submit" className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-glow text-xs font-bold flex items-center justify-center gap-2">
                <span>Post to Community</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* ================= POSTS FEED ================= */}
        {filteredPosts.length === 0 ? (
          <div className="neu-card p-16 text-center text-slate-400 border border-white/50 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-base">এই ক্যাটাগরিতে এখনো কোনো পোস্ট করা হয়নি।</p>
            <p className="text-xs">আপনিই প্রথম পোস্ট করুন!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="neu-card p-6 border border-white/60 space-y-5">
                
                {/* Post Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl neu-inset flex items-center justify-center font-extrabold text-indigo-600 text-sm shadow-inner">
                      {post.avatarInitials}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 leading-snug">{post.author}</h4>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">{post.role} • <span className="italic">{post.time}</span></p>
                    </div>
                  </div>
                  
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {post.tag}
                  </span>
                </div>

                {/* Post Body */}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line neu-inset p-4 bg-white/40 border border-white/60 font-normal">
                  {post.content}
                </p>

                {/* Like & Comment Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <button 
                    onClick={() => handleLikeToggle(post.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      post.isLiked ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'neu-btn text-slate-600 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-white' : ''}`} />
                    <span>{post.likes} {post.isLiked ? 'Liked' : 'Like'}</span>
                  </button>
                  
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span>{post.comments.length} Comments</span>
                  </span>
                </div>

                {/* Comments Section */}
                <div className="neu-inset p-4 space-y-4 border border-white/40 bg-white/20">
                  {post.comments.length > 0 && (
                    <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                      {post.comments.map((cmt) => (
                        <div key={cmt.id} className="p-3.5 rounded-xl bg-white/70 border border-white/80 shadow-2sm space-y-1">
                          <div className="font-bold text-xs text-indigo-600 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>{cmt.author}</span>
                          </div>
                          <p className="text-xs font-medium text-slate-700 leading-normal">{cmt.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="আপনার মতামত বা উত্তরটি লিখুন..." 
                      className="flex-grow px-3.5 py-2 neu-inset rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    />
                    <button type="submit" className="px-5 py-2 rounded-xl btn-glow text-xs font-bold">
                      Reply
                    </button>
                  </form>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default KnowledgeFeedPage;