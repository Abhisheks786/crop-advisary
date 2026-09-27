import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, Sparkles, Droplets, CloudSun, CheckCircle2, ChevronRight, MapPin, X, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import ButtonGroup from '../UI/ButtonGroup';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';

const Header = ({ onToggleSidebar, user }) => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const notifRef = useRef(null);
  const langRef = useRef(null);

  // Close dropdowns on click outside
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const notifications = [
    {
      id: 1,
      type: 'irrigation',
      title: '💧 Irrigation Notice',
      message: 'Crown Root Initiation stage for Wheat reached (Day 21). Schedule 60mm irrigation.',
      time: '15m ago',
      unread: true,
      link: '/irrigation'
    },
    {
      id: 2,
      type: 'weather',
      title: '🌦 Weather Forecast Alert',
      message: 'Optimal temperatures (18°C - 24°C) expected across Punjab & Haryana for Rabi sowing.',
      time: '1h ago',
      unread: true,
      link: '/dashboard'
    },
    {
      id: 3,
      type: 'recommendation',
      title: '🌱 AI Advisory Plan Updated',
      message: 'Latest Loamy soil analysis computed 96% match for Wheat and 85% for Chickpea.',
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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E6D5] shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between font-sans">
      {/* Left: Mobile Trigger & Dynamic Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-[#4A4A2E] hover:bg-[#FAFAF7] transition-colors border border-[#E8E6D5] min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#262619] tracking-tight flex items-center gap-2">
            <span>{getGreeting()}, {user?.name?.split(' ')[0] || 'Farmer'}</span>
            <span className="text-base sm:text-lg">👋</span>
          </h2>
          <p className="hidden sm:block text-xs font-medium text-[#6B6B47]">
            {t('appSubtitle')}
          </p>
        </div>
      </div>

      {/* Right: Language, Search, Weather, Notifications */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Global Quick Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
          <Search size={16} className="absolute left-3.5 text-[#9D9678] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crops, water, rotation..."
            className="w-48 lg:w-64 pl-9 pr-4 py-2 text-xs rounded-xl bg-[#FAFAF7] border border-[#E8E6D5] focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] transition-all outline-none"
          />
        </form>

        {/* Live Weather & Region Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAFAF7] border border-[#E8E6D5] text-xs text-[#262619] font-medium">
          <CloudSun size={16} className="text-[#E6A900]" />
          <span>24°C • Punjab</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#5FA83D]"></span>
          <span className="text-[#4A4A2E] text-[11px] font-semibold">Rabi Season</span>
        </div>

        {/* Multilingual Selector: Direct 1-tap buttons + Dropdown */}
        <div className="flex items-center gap-1 bg-[#FAFAF7] p-1 rounded-2xl border border-[#E8E6D5]">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-[#5C7A3C] text-white shadow-xs'
                : 'text-[#4A4A2E] hover:bg-[#F5F4EE]'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              language === 'hi'
                ? 'bg-[#5C7A3C] text-white shadow-xs'
                : 'text-[#4A4A2E] hover:bg-[#F5F4EE]'
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => setLanguage('pa')}
            className={`hidden sm:block px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              language === 'pa'
                ? 'bg-[#5C7A3C] text-white shadow-xs'
                : 'text-[#4A4A2E] hover:bg-[#F5F4EE]'
            }`}
          >
            ਪੰਜਾਬੀ
          </button>

          {/* More languages dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-1.5 rounded-xl text-[#4A4A2E] hover:bg-[#F5F4EE] transition-colors"
              aria-label="More Languages"
              title="More Languages"
            >
              <Languages size={15} className="text-[#5C7A3C]" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-[#E8E6D5] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6B6B47] border-b border-[#E8E6D5] mb-1">
                  Select Language
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                      language === lang.code 
                        ? 'bg-[#5FA83D]/10 text-[#4A4A2E] font-bold' 
                        : 'text-[#262619] hover:bg-[#FAFAF7]'
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[10px] text-[#6B6B47] uppercase font-mono">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setHasUnread(false);
            }}
            className="relative p-2.5 rounded-xl text-[#4A4A2E] hover:bg-[#FAFAF7] border border-[#E8E6D5] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#5FA83D] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Drawer / Menu */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-[#E8E6D5] overflow-hidden z-50">
              <div className="p-4 bg-[#4A4A2E] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={16} />
                  <span className="font-bold text-sm">Farm Advisory Notices</span>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-white/80 hover:text-white p-1"
                  aria-label="Close notifications"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="divide-y divide-[#E8E6D5] max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      navigate(notif.link);
                      setShowNotifications(false);
                    }}
                    className={`p-4 hover:bg-[#FAFAF7] cursor-pointer transition-colors ${
                      notif.unread ? 'bg-[#FAFAF7]/70' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-[#262619]">{notif.title}</h4>
                      <span className="text-[10px] text-[#6B6B47]">{notif.time}</span>
                    </div>
                    <p className="text-xs text-[#6B6B47] leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#F5F4EE] border-t border-[#E8E6D5] text-center">
                <button 
                  onClick={() => {
                    navigate('/dashboard');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-bold text-[#5C7A3C] hover:underline"
                >
                  View All Field Alerts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
