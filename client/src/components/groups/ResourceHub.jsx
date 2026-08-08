import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FileText, Youtube, Link as LinkIcon, Plus, Loader2, 
  Trash2, ExternalLink, PlayCircle, BookOpen, X, Maximize2 
} from 'lucide-react';
import useGroupStore from '../../store/useGroupStore';
import toast from 'react-hot-toast';

const ResourceHub = ({ isAdmin }) => {
  const { groupId } = useParams();
  const { currentGroup, updateGroup } = useGroupStore();
  
  // স্টেটস
  const [resources, setResources] = useState(currentGroup?.resources || []);
  const [loading, setLoading] = useState(false);
  const [viewingResource, setViewingResource] = useState(null); // ইন-অ্যাপ ভিউয়ারের জন্য

  // নতুন রিসোর্স ফর্ম
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('video'); // video, pdf, link

  // কারেন্ট গ্রুপ আপডেট হলে রিসোর্সগুলো সিঙ্ক করা
  useEffect(() => {
    if (currentGroup?.resources) {
      setResources(currentGroup.resources);
    }
  }, [currentGroup]);

  // নতুন রিসোর্স অ্যাড করা (শুধুমাত্র অ্যাডমিন)
  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!title || !url) return toast.error('টাইটেল এবং লিংক দেওয়া বাধ্যতামূলক!');

    try {
      setLoading(true);
      const newResource = { title, url, type, addedAt: new Date() };
      const updatedResources = [...resources, newResource];
      
      // Zustand store-এর আপডেট ফাংশন কল করা (তোমার ব্যাকএন্ডের API অনুযায়ী মানিয়ে নেবে)
      // ধরে নিচ্ছি updateGroup ফাংশনটি পুরো গ্রুপ ডেটা আপডেট করতে পারে
      await updateGroup(groupId, { resources: updatedResources });
      
      setResources(updatedResources);
      toast.success('নতুন রিসোর্স যুক্ত করা হয়েছে!');
      
      // ফর্ম রিসেট
      setTitle('');
      setUrl('');
      document.getElementById('add_resource_modal').close();
    } catch (error) {
      toast.error('রিসোর্স যুক্ত করতে সমস্যা হয়েছে!');
    } finally {
      setLoading(false);
    }
  };

  // রিসোর্স ডিলিট করা
  const handleDelete = async (indexToDelete) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই রিসোর্সটি মুছে ফেলতে চান?')) return;
    
    try {
      const updatedResources = resources.filter((_, idx) => idx !== indexToDelete);
      await updateGroup(groupId, { resources: updatedResources });
      setResources(updatedResources);
      toast.success('রিসোর্স মুছে ফেলা হয়েছে!');
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে!');
    }
  };

  // ✅ ম্যাজিক ফাংশন: ইউটিউব এবং ড্রাইভ লিংকগুলোকে এমবেড (Embed) ফরমেটে কনভার্ট করা
  const getEmbedUrl = (resource) => {
    let finalUrl = resource.url;
    
    if (resource.type === 'video') {
      // ইউটিউব লিংক থেকে Video ID বের করে Embed লিংকে রূপান্তর
      let videoId = '';
      if (finalUrl.includes('youtube.com/watch?v=')) {
        videoId = finalUrl.split('v=')[1]?.split('&')[0];
      } else if (finalUrl.includes('youtu.be/')) {
        videoId = finalUrl.split('youtu.be/')[1]?.split('?')[0];
      }
      if (videoId) finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    } 
    else if (resource.type === 'pdf') {
      // গুগল ড্রাইভের ভিউ লিংককে প্রিভিউ লিংকে রূপান্তর
      if (finalUrl.includes('drive.google.com/file/d/')) {
        const fileId = finalUrl.split('/d/')[1].split('/')[0];
        finalUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    return finalUrl;
  };

  // আইকন রেন্ডার হেল্পার
  const getResourceIcon = (type) => {
    if (type === 'video') return <Youtube className="w-5 h-5 text-rose-500" />;
    if (type === 'pdf') return <FileText className="w-5 h-5 text-emerald-500" />;
    return <LinkIcon className="w-5 h-5 text-indigo-500" />;
  };

  return (
    <div className="space-y-6 relative">
      
      {/* হেডার অংশ */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h3 className="font-extrabold text-lg text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>স্টাডি ম্যাটেরিয়ালস ও বই</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            গুরুত্বপূর্ণ ভিডিও লেকচার এবং পিডিএফ বইগুলো সরাসরি এখান থেকেই পড়ুন।
          </p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => document.getElementById('add_resource_modal').showModal()}
            className="px-5 py-2.5 rounded-xl btn-glow text-white text-xs font-bold flex items-center gap-2 shadow-md hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন রিসোর্স যোগ করুন</span>
          </button>
        )}
      </div>

      {/* রিসোর্স লিস্ট */}
      {resources.length === 0 ? (
        <div className="py-12 text-center space-y-3 neu-inset rounded-2xl bg-white/30 border border-white/50">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-extrabold text-sm text-slate-600">কোনো রিসোর্স পাওয়া যায়নি!</h4>
          {isAdmin && <p className="text-xs text-slate-500">উপরের বাটন থেকে লেকচার ভিডিও বা পিডিএফ যুক্ত করুন।</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((res, index) => (
            <div key={index} className="neu-card p-4 rounded-2xl border border-white/80 bg-white/40 flex items-center justify-between gap-4 hover:border-indigo-300 transition-all group">
              <div className="flex items-center gap-3.5 overflow-hidden">
                <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center bg-white flex-shrink-0">
                  {getResourceIcon(res.type)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-extrabold text-sm text-slate-800 truncate" title={res.title}>{res.title}</h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {res.type === 'video' ? 'ভিডিও লেকচার' : res.type === 'pdf' ? 'পিডিএফ বই' : 'ওয়েব লিংক'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* 🎯 ইন-অ্যাপ ভিউয়ার বাটন */}
                {res.type !== 'link' ? (
                  <button 
                    onClick={() => setViewingResource(res)}
                    className="p-2 rounded-xl neu-btn text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center"
                    title="সরাসরি দেখুন"
                  >
                    <PlayCircle className="w-5 h-5" />
                  </button>
                ) : (
                  <a 
                    href={res.url} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-xl neu-btn text-indigo-600 hover:bg-indigo-50 transition-all"
                    title="লিংকে যান"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(index)}
                    className="p-2 rounded-xl neu-btn text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                    title="ডিলিট করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= 🎬 IN-APP VIEWER OVERLAY ================= */}
      {viewingResource && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-black w-full max-w-5xl h-[80vh] sm:h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-700 relative">
            
            {/* ভিউয়ার হেডার */}
            <div className="px-4 py-3 bg-slate-800/80 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2.5 text-white">
                {getResourceIcon(viewingResource.type)}
                <h3 className="font-bold text-sm truncate max-w-[200px] sm:max-w-md">{viewingResource.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={viewingResource.url} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
                  title="নতুন ট্যাবে খুলুন"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Open Original</span>
                </a>
                <button 
                  onClick={() => setViewingResource(null)}
                  className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 🎬 আইফ্রেম (Iframe) প্লেয়ার */}
            <div className="flex-grow bg-slate-900 w-full h-full relative">
              <iframe
                src={getEmbedUrl(viewingResource)}
                title={viewingResource.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

          </div>
        </div>
      )}

      {/* ================= ➕ MODAL: নতুন রিসোর্স অ্যাড (Admin) ================= */}
      <dialog id="add_resource_modal" className="modal backdrop-blur-sm">
        <div className="modal-box neu-card p-6 sm:p-8 border border-white/80 max-w-md bg-[#f0f4f8]">
          <h3 className="font-extrabold text-xl text-slate-900 border-b border-slate-200/60 pb-4 mb-5 flex items-center gap-2">
            <Plus className="w-6 h-6 text-indigo-600" />
            নতুন রিসোর্স যোগ করুন
          </h3>

          <form onSubmit={handleAddResource} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">রিসোর্সের ধরন</label>
              <select 
                value={type} onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm font-bold text-slate-800 focus:outline-none"
              >
                <option value="video">ভিডিও লেকচার (YouTube)</option>
                <option value="pdf">পিডিএফ বই (Google Drive)</option>
                <option value="link">অন্যান্য ওয়েবসাইট লিংক</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">শিরোনাম</label>
              <input 
                type="text" required placeholder="যেমন: বাংলাদেশ বিষয়াবলি - ক্লাস ১"
                value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">লিংক (URL)</label>
              <input 
                type="url" required placeholder="https://youtube.com/... অথবা গুগল ড্রাইভ লিংক"
                value={url} onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-white/50 border border-white/60 text-sm focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">💡 গুগল ড্রাইভের পিডিএফ লিংকের ক্ষেত্রে অবশ্যই 'Anyone with the link' (Viewer) অন করে দেবেন।</span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
              <button type="button" onClick={() => document.getElementById('add_resource_modal').close()} className="px-5 py-2.5 rounded-xl neu-btn text-xs font-bold text-slate-600">
                বাতিল
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl btn-glow text-xs font-bold text-white flex items-center gap-2 shadow-md">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>যোগ করুন</span>
              </button>
            </div>
          </form>
        </div>
      </dialog>

    </div>
  );
};

export default ResourceHub;