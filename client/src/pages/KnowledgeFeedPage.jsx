import React, { useEffect, useState } from 'react';
import { 
  MessageSquare, Search, Filter, Plus, ThumbsUp, ThumbsDown, Send, 
  User as UserIcon, AlertCircle, Loader2, Award, BookOpen, HelpCircle, 
  Share2, Edit3, Clock, X, CheckCircle2 
} from 'lucide-react';
import usePostStore from '../store/usePostStore';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const KnowledgeFeedPage = () => {
  const { posts, isLoading, error, loadPosts, createPost, updatePost, votePost, addComment } = usePostStore();
  const { user } = useAuthStore();

  // সার্চ ও ফিল্টার স্টেট
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // নতুন পোস্ট তৈরির মডাল স্টেট
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Viva Experience');
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // এডিট করার জন্য স্টেট
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // কমেন্ট বক্সের জন্য স্টেট
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // ২ মিনিটের রিয়েল-টাইম টাইমার স্টেট
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    loadPosts(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory, loadPosts]);

  // প্রতি ৩ সেকেন্ড পর পর সময় আপডেট হবে ২ মিনিটের (১২০ সেকেন্ড) হিসাব রাখার জন্য
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // পোস্টটি ২ মিনিটের (১২০ সেকেন্ড) পুরনো কিনা তা চেক করার ফাংশন
  const canEditPost = (createdAt) => {
    if (!createdAt) return true;
    const postTime = new Date(createdAt).getTime();
    if (isNaN(postTime)) return true;
    const diffInSeconds = (currentTime - postTime) / 1000;
    return diffInSeconds <= 120; // ১২০ সেকেন্ড বা ২ মিনিটের কম হলে true
  };

  // তারিখ সুন্দর ফরম্যাটে দেখানোর হেল্পার
  const formatDate = (dateString) => {
    if (!dateString) return 'এইমাত্র';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'এইমাত্র';
    return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // ================= ১. নতুন পোস্ট সাবমিট হ্যান্ডলার =================
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!title || !content) {
      setCreateError('অনুগ্রহ করে শিরোনাম এবং বিস্তারিত লিখুন।');
      return;
    }

    setCreateLoading(true);
    const result = await createPost({ title, content, category });
    setCreateLoading(false);

    if (result.success) {
      document.getElementById('create_post_modal').close();
      setTitle(''); setContent('');
      toast.success('অভিনন্দন! আপনার অভিজ্ঞতা সফলভাবে প্রকাশিত হয়েছে। (২ মিনিট পর্যন্ত এডিট করতে পারবেন)');
    } else {
      setCreateError(result.message || 'পোস্ট প্রকাশ করা যায়নি!');
      toast.error(result.message || 'পোস্ট প্রকাশ ব্যর্থ হয়েছে!');
    }
  };

  // ================= ২. পোস্ট এডিট হ্যান্ডলার =================
  const openEditModal = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
    document.getElementById('edit_post_modal').showModal();
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editTitle || !editContent) return;

    setEditLoading(true);
    const result = await updatePost(editingPost._id, {
      title: editTitle,
      content: editContent,
      category: editCategory
    });
    setEditLoading(false);

    if (result.success) {
      document.getElementById('edit_post_modal').close();
      setEditingPost(null);
      toast.success('পোস্টটি সফলভাবে আপডেট করা হয়েছে!');
    } else {
      toast.error(result.message || 'আপডেট ব্যর্থ হয়েছে! হয়তো ২ মিনিট সময় পার হয়ে গেছে।');
    }
  };

  // ================= ৩. কমেন্ট সাবমিট হ্যান্ডলার =================
  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    const result = await addComment(postId, commentText);
    setCommentLoading(false);
    if (result.success) {
      setCommentText('');
      toast.success('আপনার উত্তর যুক্ত হয়েছে!');
    } else {
      toast.error(result.message || 'কমেন্ট করা যায়নি!');
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Viva Experience':
        return { text: cat, color: 'text-purple-600 bg-purple-50 border-purple-200', icon: Award };
      case 'Preparation Strategy':
        return { text: cat, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: BookOpen };
      case 'Question & Solution':
        return { text: cat, color: 'text-amber-600 bg-amber-50 border-amber-200', icon: HelpCircle };
      default:
        return { text: cat, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: MessageSquare };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* হেডার ব্যানার */}
      <div className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 bg-white/40 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-xs font-bold text-indigo-600 bg-white/60 shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 animate-bounce" />
            <span>কমিউনিটি নলেজ শেয়ারিং হাব</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            অভিজ্ঞতা ফোরাম ও প্রশ্নোত্তর
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
            আপনার বিসিএস ও ভাইভার অভিজ্ঞতা শেয়ার করুন, কঠিন প্রশ্নের সমাধান জানুন এবং সফল প্রার্থীদের গাইডলাইন থেকে প্রস্তুতিকে শাণিত করুন।
          </p>
        </div>

        <button 
          onClick={() => { setCreateError(''); document.getElementById('create_post_modal').showModal(); }}
          className="px-6 py-3.5 rounded-2xl btn-glow font-bold text-sm text-white flex items-center gap-2 shadow-lg hover:scale-105 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>অভিজ্ঞতা শেয়ার করুন</span>
        </button>
      </div>

      {/* সার্চ ও ফিল্টার বার */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="পোস্টের শিরোনাম বা বিষয়বস্তু দিয়ে খুঁজুন..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl neu-inset bg-white/60 border border-white/80 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
          />
        </div>

        <div className="relative flex items-center">
          <Filter className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl neu-inset bg-white/60 border border-white/80 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer transition-all"
          >
            <option value="All">সকল ক্যাটাগরি</option>
            <option value="Viva Experience">Viva Experience (ভাইভা অভিজ্ঞতা)</option>
            <option value="Preparation Strategy">Preparation Strategy (প্রস্তুতি কৌশল)</option>
            <option value="Question & Solution">Question & Solution (প্রশ্নোত্তর)</option>
            <option value="General Discussion">General Discussion (সাধারণ আলোচনা)</option>
          </select>
        </div>
      </div>

      {/* এরর বা লোডিং স্টেট */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">ফোরাম লোড করা হচ্ছে...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="neu-card p-12 text-center rounded-3xl border border-white/80 space-y-4 bg-white/30">
          <div className="w-16 h-16 rounded-full neu-inset flex items-center justify-center text-slate-400 mx-auto">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-slate-800">কোনো পোস্ট পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">আপনার অনুসন্ধানের সাথে মিলে এমন কোনো পোস্ট নেই। আপনি নিজেই প্রথম অভিজ্ঞতা বা প্রশ্ন পোস্ট করতে পারেন!</p>
          </div>
        </div>
      ) : (
        /* পোস্ট লিস্ট */
        <div className="space-y-6">
          {posts.map((post) => {
            const currentUserId = user?._id || user?.id;
            const isAuthor = (post.author?._id || post.author)?.toString() === currentUserId?.toString();
            const hasUpvoted = post.upvotes?.some(id => (id?._id || id).toString() === currentUserId?.toString());
            const hasDownvoted = post.downvotes?.some(id => (id?._id || id).toString() === currentUserId?.toString());
            const badgeInfo = getCategoryBadge(post.category);
            const BadgeIcon = badgeInfo.icon;
            const isCommentOpen = openCommentPostId === post._id;
            const isWithinTwoMinutes = canEditPost(post.createdAt || Date.now());

            return (
              <div key={post._id} className="neu-card p-6 sm:p-8 rounded-3xl border border-white/80 bg-white/40 space-y-5 hover:shadow-xl transition-all duration-300">
                
                {/* পোস্ট হেডার: লেখক, ক্যাটাগরি এবং ২ মিনিটের এডিট বাটন */}
                <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-200/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl neu-inset p-0.5 overflow-hidden flex-shrink-0 bg-white flex items-center justify-center shadow-inner">
                      {post.author?.profilePic ? (
                        <img src={post.author.profilePic} alt={post.author.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>{post.author?.name || user?.name || 'শিক্ষার্থী ইউজার'}</span>
                        {post.author?.role === 'admin' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-extrabold">অ্যাডমিন</span>
                        )}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-400">
                          {formatDate(post.createdAt)}
                        </span>
                        {post.updatedAt && post.updatedAt !== post.createdAt && (
                          <span className="text-[9px] font-semibold text-slate-400 italic">(এডিটেড)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ক্যাটাগরি ও এডিট বাটন */}
                  <div className="flex items-center gap-2.5 ml-auto">
                    <span className={`px-3 py-1 rounded-xl text-[11px] font-extrabold border flex items-center gap-1.5 ${badgeInfo.color}`}>
                      <BadgeIcon className="w-3.5 h-3.5" />
                      <span>{badgeInfo.text}</span>
                    </span>

                    {/* নিজের পোস্ট হলে শুধুমাত্র এডিট বাটন দেখাবে (কোনো ডিলিট বাটন থাকবে না) */}
                    {isAuthor && (
                      <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-slate-200/60 shadow-sm">
                        {isWithinTwoMinutes ? (
                          <button
                            onClick={() => openEditModal(post)}
                            className="px-2.5 py-1 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-1.5 font-extrabold text-xs"
                            title="২ মিনিটের মধ্যে এডিট করা সম্ভব"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit (2m)</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold px-2 py-1 flex items-center gap-1" title="২ মিনিট সময় পার হয়ে গেছে, তাই আর এডিট করা যাবে না">
                            <Clock className="w-3 h-3 text-slate-400" /> Locked
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* শিরোনাম ও বিস্তারিত */}
                <div className="space-y-2.5 pt-1">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium bg-white/40 p-4 rounded-2xl border border-white/60">
                    {post.content}
                  </p>
                </div>

                {/* ভোটিং ও কমেন্ট বাটন বার */}
                <div className="pt-3 flex items-center justify-between gap-4 flex-wrap">
                  
                  {/* Upvote ও Downvote */}
                  <div className="flex items-center gap-2 p-1 neu-inset rounded-2xl bg-white/50 border border-white/80">
                    <button
                      onClick={() => votePost(post._id, 'upvote')}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                        hasUpvoted ? 'bg-indigo-600 text-white shadow-md scale-105' : 'text-slate-600 hover:text-indigo-600'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.upvotes?.length || 0}</span>
                    </button>
                    <div className="w-[1px] h-4 bg-slate-300"></div>
                    <button
                      onClick={() => votePost(post._id, 'downvote')}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                        hasDownvoted ? 'bg-rose-600 text-white shadow-md scale-105' : 'text-slate-600 hover:text-rose-600'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{post.downvotes?.length || 0}</span>
                    </button>
                  </div>

                  {/* কমেন্ট টগল বাটন */}
                  <button
                    onClick={() => {
                      setOpenCommentPostId(isCommentOpen ? null : post._id);
                      setCommentText('');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl neu-btn text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span>উত্তর ও আলোচনা ({post.comments?.length || 0})</span>
                  </button>
                </div>

                {/* ================= কমেন্ট সেকশন ================= */}
                {isCommentOpen && (
                  <div className="pt-4 border-t border-slate-200/60 space-y-4 animate-fadeIn">
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="আপনার উত্তর বা পরামর্শ লিখুন..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                        className="flex-grow px-4 py-3 rounded-2xl neu-inset bg-white/70 border border-white/80 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        disabled={commentLoading || !commentText.trim()}
                        className="p-3 rounded-2xl btn-glow text-white shadow-md hover:scale-105 transition-all disabled:opacity-50 flex-shrink-0"
                      >
                        {commentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {post.comments?.length === 0 ? (
                        <p className="text-[11px] font-bold text-slate-400 text-center py-3">এখনো কোনো উত্তর আসেনি। আপনিই প্রথম উত্তর দিন!</p>
                      ) : (
                        post.comments?.map((comment, idx) => (
                          <div key={idx} className="p-3.5 rounded-2xl neu-inset bg-white/50 border border-white/80 flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg neu-card p-0.5 overflow-hidden flex-shrink-0 bg-white flex items-center justify-center mt-0.5">
                              {comment.user?.profilePic ? (
                                <img src={comment.user.profilePic} alt="User" className="w-full h-full object-cover rounded" />
                              ) : (
                                <span className="font-bold text-[10px] text-indigo-600">{comment.user?.name?.charAt(0) || 'U'}</span>
                              )}
                            </div>
                            <div className="space-y-0.5 flex-grow">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold text-slate-800">{comment.user?.name || 'ইউজার'}</span>
                                <span className="text-[9px] text-slate-400 font-semibold">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 font-medium leading-relaxed">{comment.text}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL ১: নতুন অভিজ্ঞতা শেয়ার ================= */}
      <dialog id="create_post_modal" className="modal backdrop-blur-sm">
        <div className="modal-box neu-card p-6 sm:p-8 border border-white/80 max-w-lg bg-[#f0f4f8]">
          
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl neu-inset text-indigo-600">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-slate-900">অভিজ্ঞতা ও প্রশ্ন শেয়ার করুন</h3>
                <p className="text-xs text-slate-500">প্রকাশের পর ২ মিনিট পর্যন্ত এডিট করতে পারবেন</p>
              </div>
            </div>
            <button onClick={() => document.getElementById('create_post_modal').close()} className="p-2 rounded-full hover:bg-slate-200/60 text-slate-500 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {createError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{createError}</span>
            </div>
          )}

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block ml-1">শিরোনাম</label>
              <input 
                type="text" 
                placeholder="যেমন: ৪৪তম বিসিএস ভাইভার বাস্তব অভিজ্ঞতা বা গণিত প্রস্তুতির সেরা কৌশল"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/60 border border-white/80 text-sm font-medium text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block ml-1">ক্যাটাগরি</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/60 border border-white/80 text-sm font-bold text-slate-800 cursor-pointer"
              >
                <option value="Viva Experience">Viva Experience (ভাইভা অভিজ্ঞতা)</option>
                <option value="Preparation Strategy">Preparation Strategy (প্রস্তুতি কৌশল)</option>
                <option value="Question & Solution">Question & Solution (প্রশ্নোত্তর)</option>
                <option value="General Discussion">General Discussion (সাধারণ আলোচনা)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block ml-1">বিস্তারিত বিবরণ বা প্রশ্ন</label>
              <textarea 
                rows="5"
                placeholder="আপনার অভিজ্ঞতা বা প্রশ্নটি এখানে বিস্তারিতভাবে লিখুন..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/60 border border-white/80 text-sm font-medium text-slate-800 resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
              <button 
                type="button" 
                onClick={() => document.getElementById('create_post_modal').close()}
                className="px-5 py-2.5 rounded-xl neu-btn text-xs font-bold text-slate-600"
              >
                বাতিল
              </button>
              <button 
                type="submit" 
                disabled={createLoading}
                className="px-6 py-2.5 rounded-xl btn-glow text-xs font-bold text-white flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>{createLoading ? 'প্রকাশিত হচ্ছে...' : 'পোস্ট প্রকাশ করুন'}</span>
              </button>
            </div>
          </form>

        </div>
      </dialog>


      {/* ================= MODAL ২: পোস্ট এডিট মডাল ================= */}
      <dialog id="edit_post_modal" className="modal backdrop-blur-sm">
        <div className="modal-box neu-card p-6 sm:p-8 border border-white/80 max-w-lg bg-[#f0f4f8]">
          
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl neu-inset text-amber-600 bg-amber-50">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-slate-900">পোস্ট এডিট করুন</h3>
                <p className="text-xs text-amber-600 font-bold flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" /> ২ মিনিটের সময়সীমার মধ্যে দ্রুত পরিবর্তন সম্পন্ন করুন
                </p>
              </div>
            </div>
            <button onClick={() => document.getElementById('edit_post_modal').close()} className="p-2 rounded-full hover:bg-slate-200/60 text-slate-500 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleUpdatePost} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block ml-1">শিরোনাম</label>
              <input 
                type="text" 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/60 border border-white/80 text-sm font-medium text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block ml-1">ক্যাটাগরি</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/60 border border-white/80 text-sm font-bold text-slate-800 cursor-pointer"
              >
                <option value="Viva Experience">Viva Experience (ভাইভা অভিজ্ঞতা)</option>
                <option value="Preparation Strategy">Preparation Strategy (প্রস্তুতি কৌশল)</option>
                <option value="Question & Solution">Question & Solution (প্রশ্নোত্তর)</option>
                <option value="General Discussion">General Discussion (সাধারণ আলোচনা)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block ml-1">বিস্তারিত বিবরণ বা প্রশ্ন</label>
              <textarea 
                rows="5"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/60 border border-white/80 text-sm font-medium text-slate-800 resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
              <button 
                type="button" 
                onClick={() => document.getElementById('edit_post_modal').close()}
                className="px-5 py-2.5 rounded-xl neu-btn text-xs font-bold text-slate-600"
              >
                বাতিল
              </button>
              <button 
                type="submit" 
                disabled={editLoading}
                className="px-6 py-2.5 rounded-xl btn-glow text-xs font-bold text-white flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{editLoading ? 'আপডেট হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
              </button>
            </div>
          </form>

        </div>
      </dialog>

    </div>
  );
};

export default KnowledgeFeedPage;