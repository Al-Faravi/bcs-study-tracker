import React, { useState } from 'react';
import { BookOpen, Video, Plus, Download, ExternalLink, Play, Sparkles, User, Tag } from 'lucide-react';

const initialBooks = [
  {
    id: 1,
    title: "এমপিথ্রি (MP3) - বাংলাদেশ বিষয়াবলি",
    author: "জর্জ সিরিজ",
    category: "বাংলাদেশ বিষয়াবলি",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
    pdfLink: "#"
  },
  {
    id: 2,
    title: "এসুরেন্স (Assurance) - বিসিএস প্রিলিমিনারি ডাইজেস্ট",
    author: "এসুরেন্স প্রকাশনী",
    category: "কম্বাইন্ড ডাইজেস্ট",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop&q=80",
    pdfLink: "#"
  },
  {
    id: 3,
    title: "ইংলিশ ফর কমপিটিটিভ এক্সামস",
    author: "মো. ফজলুল হক",
    category: "ইংরেজি ভাষা ও সাহিত্য",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&auto=format&fit=crop&q=80",
    pdfLink: "#"
  }
];

const initialVideos = [
  {
    id: 101,
    title: "বাংলাদেশের সংবিধান মনে রাখার সহজ টেকনিক",
    channel: "BCS Preparation Tech",
    videoId: "dQw4w9WgXcQ", 
    category: "বাংলাদেশ বিষয়াবলি"
  },
  {
    id: 102,
    title: "ইংরেজি সাহিত্যের যুগ বিভাগ (English Periodization)",
    channel: "English With Faravi",
    videoId: "M7lc1UVf-VE",
    category: "ইংরেজি সাহিত্য"
  }
];

const ResourceHub = () => {
  const [books, setBooks] = useState(initialBooks);
  const [videos, setVideos] = useState(initialVideos);
  const [activeSubTab, setActiveSubTab] = useState('books');

  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookCategory, setNewBookCategory] = useState('সাধারণ জ্ঞান');

  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    const newBook = {
      id: Date.now(),
      title: newBookTitle,
      author: newBookAuthor,
      category: newBookCategory,
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80",
      pdfLink: "#"
    };
    setBooks([newBook, ...books]);
    setNewBookTitle('');
    setNewBookAuthor('');
    document.getElementById('add_resource_modal').close();
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    const videoId = extractVideoId(newVideoUrl);
    if (!videoId) {
      alert("সঠিক ইউটিউব ভিডিও লিংক প্রদান করুন!");
      return;
    }

    const newVideo = {
      id: Date.now(),
      title: newVideoTitle,
      channel: "Group Member Share",
      videoId: videoId,
      category: "সাধারণ লেকচার"
    };
    setVideos([newVideo, ...videos]);
    setNewVideoTitle('');
    setNewVideoUrl('');
    document.getElementById('add_resource_modal').close();
  };

  return (
    <div className="space-y-8">
      
      {/* ================= SUB-NAVIGATION & ACTIONS ================= */}
      <div className="neu-card p-4 sm:p-5 border border-white/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setActiveSubTab('books')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'books' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                : 'neu-btn text-slate-600 hover:text-indigo-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>বুকস লাইব্রেরি ({books.length})</span>
          </button>
          
          <button 
            onClick={() => setActiveSubTab('videos')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'videos' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                : 'neu-btn text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>ইউটিউব ক্লাস হাব ({videos.length})</span>
          </button>
        </div>

        <button 
          onClick={() => document.getElementById('add_resource_modal').showModal()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-glow flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন {activeSubTab === 'books' ? 'বই' : 'ভিডিও'} যুক্ত করুন</span>
        </button>
      </div>

      {/* ================= BOOKS LIBRARY GRID ================= */}
      {activeSubTab === 'books' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book.id} className="neu-card overflow-hidden border border-white/60 flex flex-col justify-between group">
              <div className="p-4 pb-0">
                <div className="h-52 w-full rounded-xl overflow-hidden neu-inset p-1 relative">
                  <img src={book.cover} alt={book.title} className="object-cover h-full w-full rounded-lg group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-sm">
                    {book.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-1">{book.title}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>লেখক: {book.author}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60">
                  <a 
                    href={book.pdfLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full py-2.5 rounded-xl neu-btn text-xs font-bold text-indigo-600 flex items-center justify-center gap-1.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF ডাউনলোড / পড়ুন</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= YOUTUBE VIDEO HUB GRID ================= */}
      {activeSubTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="neu-card overflow-hidden border border-white/60 space-y-4 p-4">
              <div className="aspect-video w-full rounded-xl overflow-hidden neu-inset p-1 bg-slate-900">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="px-2 pb-2 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {video.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-indigo-600" />
                    YouTube Class
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">{video.title}</h3>
                <p className="text-xs font-medium text-slate-500">শেয়ার করেছেন / চ্যানেল: <span className="font-semibold text-slate-700">{video.channel}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: ADD RESOURCE ================= */}
      <dialog id="add_resource_modal" className="modal backdrop-blur-sm">
        <div className="modal-box neu-card p-6 border border-white/80 max-w-md bg-[#f0f4f8]">
          <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-200/60 pb-3 flex items-center gap-2">
            {activeSubTab === 'books' ? <BookOpen className="w-5 h-5 text-indigo-600" /> : <Video className="w-5 h-5 text-indigo-600" />}
            <span>নতুন {activeSubTab === 'books' ? 'বই' : 'ভিডিও'} যুক্ত করুন</span>
          </h3>
          
          {activeSubTab === 'books' ? (
            <form onSubmit={handleAddBook} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">বইয়ের নাম</label>
                <input type="text" placeholder="যেমন: এমপিথ্রি বাংলাদেশ" className="w-full px-3.5 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newBookTitle} onChange={(e)=>setNewBookTitle(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">লেখক / প্রকাশনী</label>
                <input type="text" placeholder="যেমন: জর্জ সিরিজ" className="w-full px-3.5 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newBookAuthor} onChange={(e)=>setNewBookAuthor(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">ক্যাটাগরি</label>
                <select className="w-full px-3 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newBookCategory} onChange={(e)=>setNewBookCategory(e.target.value)}>
                  <option>বাংলাদেশ বিষয়াবলি</option>
                  <option>আন্তর্জাতিক বিষয়াবলি</option>
                  <option>বাংলা সাহিত্য</option>
                  <option>ইংরেজি ব্যাকরণ</option>
                  <option>গণিত ও মানসিক দক্ষতা</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/60">
                <button type="button" className="px-5 py-2 rounded-xl neu-btn text-xs font-semibold text-slate-600" onClick={()=>document.getElementById('add_resource_modal').close()}>Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl btn-glow text-xs font-semibold">Save Book</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddVideo} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">ভিডিওর শিরোনাম</label>
                <input type="text" placeholder="যেমন: শতকরা অংকের ম্যাজিক শর্টকাট" className="w-full px-3.5 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newVideoTitle} onChange={(e)=>setNewVideoTitle(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">ইউটিউব লিংক (YouTube URL)</label>
                <input type="url" placeholder="https://www.youtube.com/watch?v=..." className="w-full px-3.5 py-2 neu-inset rounded-xl text-sm focus:outline-none" value={newVideoUrl} onChange={(e)=>setNewVideoUrl(e.target.value)} required />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/60">
                <button type="button" className="px-5 py-2 rounded-xl neu-btn text-xs font-semibold text-slate-600" onClick={()=>document.getElementById('add_resource_modal').close()}>Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl btn-glow text-xs font-semibold">Add Video</button>
              </div>
            </form>
          )}
        </div>
      </dialog>

    </div>
  );
};

export default ResourceHub;