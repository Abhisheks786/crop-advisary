import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, Sparkles, Droplets, CloudSun, CheckCircle2, ChevronRight, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import ButtonGroup from '../UI/ButtonGroup';

const Header = ({ onToggleSidebar, user }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const notifRef = useRef(null);

  // Close notifications dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
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
      title: '💧 Irrigation Stage Notice',
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
    } else if (q.includes('rotat') || q.includes('soil')) {
      navigate('/rotation');
    } else if (q.includes('resource') || q.includes('cost') || q.includes('yield')) {
      navigate('/resources');
    } else {
      navigate('/recommend');
    }
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#F5F4EE] shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Trigger & Dynamic Greeting */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-[#4A4A2E] hover:bg-[#FAFAF7] transition-colors border border-slate-200"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </Button>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-display flex items-center gap-2">
            <span>{getGreeting()}, {user?.name?.split(' ')[0] || 'Farmer'}</span>
            <span className="text-base sm:text-lg animate-bounce">👋</span>
          </h2>
          <p className="hidden sm:block text-xs font-medium text-slate-500">
            Precision AI Crop Planning & Resource Management Dashboard
          </p>
        </div>
      </div>

      {/* Right: Search, Weather pill & Notification center */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Global Quick Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
          <Search size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crops, irrigation, soil..."
            className="w-56 lg:w-72 pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#9D9678] focus:ring-2 focus:ring-[#E8E6D5] transition-all outline-none"
          />
        </form>

        {/* Live Weather & Region Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAFAF7] border border-[#E8E6D5]/70 text-xs text-[#262619] font-medium">
          <CloudSun size={16} className="text-amber-500" />
          <span>24°C • Punjab</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#9D9678]"></span>
          <span className="text-[#4A4A2E] text-[11px]">Rabi Season</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <Button
            variant="outline"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setHasUnread(false);
            }}
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-[#4A4A2E] hover:bg-[#FAFAF7] border border-slate-200 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#9D9678] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </Button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in slide-up">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 font-display">Farm Notifications</h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#F5F4EE] text-[#333320]">
                    3 New
                  </span>
                </div>
                <Button 
                  variant="ghost"
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X size={16} />
                </Button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate(notif.link);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      notif.unread
                        ? 'bg-[#FAFAF7]/60 border-[#E8E6D5]/80 hover:bg-[#F5F4EE]/60'
                        : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 text-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/recommend');
                  }}
                  className="text-xs font-semibold text-[#4A4A2E] hover:text-[#333320] flex items-center justify-center gap-1 w-full"
                >
                  <span>Start New Field Analysis</span>
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* User Mini Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6B6B47] to-lime-500 text-white font-bold text-sm flex items-center justify-center shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
