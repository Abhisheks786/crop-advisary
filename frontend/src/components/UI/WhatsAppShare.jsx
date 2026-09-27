import React from 'react';
import { Share2, MessageCircle } from 'lucide-react';

/**
 * WhatsApp Share Button for Farmers
 * Enables 1-click sharing of crop advisories, water schedules, and tasks
 * to family, farm partners, or labor via WhatsApp.
 */
const WhatsAppShare = ({ 
  text, 
  title = "व्हाट्सएप पर भेजें", 
  size = "md",
  className = "" 
}) => {
  const handleShare = (e) => {
    e.stopPropagation();
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-1 text-xs gap-1.5' 
    : size === 'lg'
      ? 'px-4 py-2.5 text-sm gap-2.5 font-bold'
      : 'px-3.5 py-2 text-xs sm:text-sm gap-2 font-semibold';

  return (
    <button
      onClick={handleShare}
      type="button"
      className={`inline-flex items-center justify-center rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white border border-[#1EAA50] shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 ${sizeClasses} ${className}`}
      title="Share advisory on WhatsApp"
      aria-label="Share on WhatsApp"
    >
      <MessageCircle size={size === 'sm' ? 14 : 17} className="fill-current" />
      <span>{title}</span>
    </button>
  );
};

export default WhatsAppShare;
