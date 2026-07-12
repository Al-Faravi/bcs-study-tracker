import React, { useState } from 'react';
import { BookOpen, Video, Plus, ExternalLink, FileText, Download, Trash2, Search, PlayCircle } from 'lucide-react';

const ResourceHub = ({ isAdmin, currentUserId }) => {
  const [activeTab, setActiveTab] = useState('books');
  const [searchTerm, setSearchTerm] = useState('');

  // ডেমো রিসোর্স ডেটা (পরবর্তীতে ব্যাকএন্ড থেকে আসবে)
  const [resources, setResources] = useState([
    {
      id: 1,
      title: 'MP3 বাংলা ভাষা ও সাহিত্য (সর্বশেষ সংস্করণ)',
      category: 'books',
      type: 'PDF Guide',
      url: 'https://example.com/mp3-bangla.pdf',
      addedBy: 'শাকাওয়াত হোসেন',
      date: '১২ জুলাই, ২০২৬'
    },
    {
      id: 2,
      title: 'BCS Preliminary English Grammar Full Playlist',
      category: 'youtube',
      type: 'YouTube Playlist',
      url: 'https://youtube.com/playlist?list=example',
      addedBy: 'রহিম উদ্দিন',
      date: '১১ জুলাই, ২০২৬'
    },
    {
      id: 3,
      title: 'প্রফেসরস বাংলাদেশ বিষয়াবলী ডাইজেস্ট',
      category: 'books',
      type: 'Lecture Sheet',
      url: 'https://example.com/digest.pdf',
      addedBy: 'শাকাওয়াত হোসেন',
      date: '১০ জুলাই, ২০২৬'
    },
    {
      id: 4,
      title: 'মানসিক দক্ষতা ও গাণিতিক যুক্তি শটকাট টেকনিক',
      category: 'youtube',
      type: 'Video Lecture',
      url: 'https://youtube.com/watch?v=example',
      addedBy: 'তানিয়া আক্তার',
      date: '০৯ জুলাই, ২০২৬'
    }
  ]);

  // নতুন রিসোর্স যোগ করার স্টেট
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('PDF Guide');
  const [newUrl, setNewUrl] = useState('');

  const handleAddResource = (e) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newRes = {
      id: Date.now(),
      title: newTitle,
      category: activeTab,
      type: newType,
      url: newUrl,
      addedBy: 'আপনি',
      date: new Date().toLocaleDateString('bn-BD')
    };

    setResources([newRes, ...resources]);
    setNewTitle('');
    setNewUrl('');
    document.getElementById('add_resource_modal').close();
  };

  const filteredResources = resources.filter(res => 
    res.category === activeTab && 
    res.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* টপ বার: ক্যাটাগরি ট্যাব ও বাটন */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-200/60 pb-4">
        <div className="flex items-center gap-2 p-1.5 neu-inset rounded-2xl bg-white/40 border border-white/60 w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'books' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>বই ও লেকচার শিট</span>
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'youtube' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>ইউটিউব টিউটোরিয়াল</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              placeholder="রিসোর্স খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl neu-inset bg-white/50 border border-white/60 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <button
            onClick={() => document.getElementById('add_resource_modal').showModal()}
            className="px-4 py-2 rounded-xl btn-glow font-bold text-xs text-white flex items-center gap-1.5 shadow-md flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* রিসোর্স কার্ড গ্রিড */}
      {filteredResources.length === 0 ? (
        <div className="py-16 text-center neu-card rounded-3xl border border-white/80 space-y-2">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-500">এই ক্যাটাগরিতে কোনো রিসোর্স পাওয়া যায়নি। আপনি নতুন রিসোর্স যুক্ত করতে পারেন!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((res) => (
            <div key={res.id} className="p-5 rounded-2xl neu-card bg-white/40 border border-white/80 flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-2xl neu-inset flex-shrink-0 ${
                    res.category === 'youtube' ? 'text-rose-600 bg-rose-50/50' : 'text-indigo-600 bg-indigo-50/50'
                  }`}>
                    {res.category === 'youtube' ? <Video className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 uppercase tracking-wider">
                      {res.type}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {res.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      শেয়ার করেছেন: <span className="text-slate-700 font-bold">{res.addedBy}</span> ({res.date})
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <a 
                  href={res.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl neu-btn transition-all ${
                    res.category === 'youtube' ? 'text-rose-600 hover:bg-rose-50' : 'text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <span>{res.category === 'youtube' ? 'ভিডিও দেখুন' : 'ডাউনলোড করুন'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {isAdmin && (
                  <button 
                    onClick={() => setResources(resources.filter(r => r.id !== res.id))}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="রিসোর্স মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* মডাল: নতুন রিসোর্স যুক্ত করার ফর্ম */}
      <dialog id="add_resource_modal" className="modal backdrop-blur-sm">
        <div className="modal-box neu-card p-6 border border-white/80 max-w-md bg-[#f0f4f8]">
          <h3 className="font-extrabold text-lg text-slate-900 mb-4">
            নতুন {activeTab === 'books' ? 'বই/শিট' : 'ইউটিউব ভিডিও'} যুক্ত করুন
          </h3>
          <form onSubmit={handleAddResource} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">টাইটেল বা নাম</label>
              <input 
                type="text" 
                placeholder="যেমন: MP3 বাংলা ডাইজেস্ট পিডিএফ" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl neu-inset text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">রিসোর্সের ধরন</label>
              <select 
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl neu-inset text-xs font-bold text-slate-800"
              >
                {activeTab === 'books' ? (
                  <>
                    <option value="PDF Guide">PDF Guide</option>
                    <option value="Lecture Sheet">Lecture Sheet</option>
                    <option value="Handnote">Handnote</option>
                  </>
                ) : (
                  <>
                    <option value="YouTube Playlist">YouTube Playlist</option>
                    <option value="Video Lecture">Video Lecture</option>
                    <option value="Shortcut Technique">Shortcut Technique</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">লিংক (URL)</label>
              <input 
                type="url" 
                placeholder="https://..." 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl neu-inset text-xs font-medium text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
              <button 
                type="button" 
                onClick={() => document.getElementById('add_resource_modal').close()}
                className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-slate-600"
              >
                বাতিল
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 rounded-xl btn-glow text-xs font-bold text-white shadow-md"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      </dialog>

    </div>
  );
};

export default ResourceHub;