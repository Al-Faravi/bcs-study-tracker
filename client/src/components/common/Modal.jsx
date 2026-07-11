import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = "max-w-lg",
  showCloseButton = true 
}) => {

  // ESC কি (Key) চাপলে মডাল বন্ধ হওয়ার লজিক
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* ব্যাকড্রপ ব্লার ওভারলে */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* ৩ডি সফট মডাল বক্স */}
      <div className={`w-full ${maxWidth} neu-card p-6 sm:p-8 border border-white/80 relative z-10 bg-[#f0f4f8] shadow-2xl transform transition-all duration-300 animate-scaleUp my-8`}>
        
        {/* মডাল হেডার */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200/60">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h3>
          
          {showCloseButton && (
            <button 
              type="button" 
              onClick={onClose}
              className="p-2 rounded-xl neu-btn text-slate-500 hover:text-rose-600 transition-colors focus:outline-none"
              title="বন্ধ করুন (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* মডাল বডি (Children Content) */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;