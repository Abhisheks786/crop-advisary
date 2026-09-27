import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, CloudSun, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import DemoModeBanner from '../Auth/DemoModeBanner';

const Header = ({ onToggleSidebar, user }) => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const notifRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      type: 'irrigation',
      title: 'Irrigation notice',
      message: 'Crown Root Initiation stage for Wheat reached (Day 21). Schedule irrigation.',
      time: '15m ago',
      unread: true,
      link: '/irrigation'
    },
    {
      id: 2,
      type: 'weather',
      title: 'Weather',
      message: 'Optimal temperatures (18°C–24°C) expected across Punjab for Rabi sowing.',
      time: '1h ago',
      unread: true,
      link: '/dashboard'
    },
    {
      id: 3,
      type: 'recommendation',
      title: 'AI advisory updated',
      message: 'Loamy soil analysis: 96% match for Wheat.',
      time: '3h ago',
      unread: false,
      link: '/results'
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('water') || q.includes('irrig')) {
      navigate('/irrigation');
    } else if (q.includes('plan') || q.includes('farm')) {
      navigate('/plan');
    } else if (q.includes('rotat') || q.includes('soil')) {
      navigate('/rotation');
    } else if (q.includes('resource') || q.includes('cost') || q.includes('yield')) {
      navigate('/resources');
    } else {
      navigate('/recommend');
    }
    setSearchQuery('');
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E6E4D7] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 font-sans">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-[#4A4A2E] hover:bg-[#FAFAF7] transition-colors border border-[#E6E4D7] min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
          <Search size={15} className="absolute left-3 text-[#9D9678] pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crops, water, rotation..."
            className="w-56 lg:w-72 pl-9 pr-3 py-2 text-sm rounded-xl bg-[#FAFAF7] border border-[#E6E4D7] focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56330] transition-all outline-none"
          />
        </form>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <DemoModeBanner />

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm text-[#1C3824]">
          <CloudSun size={16} className="text-[#E6A900]" />
          <span className="font-medium">24°C</span>
        </div>

        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#4A4A2E] hover:bg-[#FAFAF7] border border-transparent hover:border-[#E6E4D7] min-h-[40px]"
            aria-label="Language"
          >
            {currentLangObj.code.toUpperCase()}
            <ChevronDown size={12} className="text-[#9D9678]" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-lg border border-[#E6E4D7] py-1.5 z-50">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between ${
                    language === lang.code 
                      ? 'bg-[#5FA83D]/10 text-[#274D27]' 
                      : 'text-[#1C3824] hover:bg-[#FAFAF7]'
                  }`}
                >
                  <span>{lang.native}</span>
                  <span className="text-[10px] text-[#6B6B47] uppercase">{lang.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setHasUnread(false);
            }}
            className="relative p-2 rounded-xl text-[#4A4A2E] hover:bg-[#FAFAF7] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#5FA83D] rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-lg border border-[#E6E4D7] overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-[#E6E4D7] flex items-center justify-between">
                <span className="font-medium text-sm text-[#1C3824]">Notices</span>
                <button 
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-[#6B6B47] hover:text-[#1C3824] p-1"
                  aria-label="Close notifications"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="divide-y divide-[#E6E4D7] max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <button
                    type="button"
                    key={notif.id}
                    onClick={() => {
                      navigate(notif.link);
                      setShowNotifications(false);
                    }}
                    className={`w-full text-left p-4 hover:bg-[#FAFAF7] transition-colors ${
                      notif.unread ? 'bg-[#FAFAF7]/80' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-medium text-[#1C3824]">{notif.title}</h4>
                      <span className="text-[10px] text-[#6B6B47]">{notif.time}</span>
                    </div>
                    <p className="text-xs text-[#6B6B47] leading-relaxed">{notif.message}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
