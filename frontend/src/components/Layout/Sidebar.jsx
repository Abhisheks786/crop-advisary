import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../UI/Button';
import ButtonGroup from '../UI/ButtonGroup';
import { 
  LayoutDashboard, 
  Sprout, 
  History, 
  Droplets, 
  RefreshCw, 
  Package, 
  Shield, 
  Wheat, 
  Sparkles, 
  LogOut, 
  X,
  Compass,
  BarChart3
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  const sections = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      title: 'FARM TOOLS',
      items: [
        { name: 'Crop Advisor', path: '/recommend', icon: Sprout, badge: 'AI' },
        { name: 'Irrigation Planner', path: '/irrigation', icon: Droplets, badge: null },
        { name: 'Crop Rotation', path: '/rotation', icon: RefreshCw, badge: null },
        { name: 'Resource Planner', path: '/resources', icon: Package, badge: null },
      ]
    },
    {
      title: 'ACTIVITY',
      items: [
        { name: 'Advisory History', path: '/history', icon: History, badge: null },
      ]
    }
  ];

  const adminSections = [
    {
      title: 'MANAGEMENT',
      items: [
        { name: 'Admin Console', path: '/admin', icon: Shield, badge: null },
        { name: 'Crop Catalog', path: '/admin/crops', icon: Wheat, badge: null },
        { name: 'System Analytics', path: '/admin/statistics', icon: BarChart3, badge: null },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose} 
        />
      )}
      
      {/* Premium Dark AgriTech Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-[#12372A] text-slate-200 shadow-2xl w-72 flex flex-col z-50 transition-all duration-300 ease-in-out border-r border-[#1A1A11]/50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-[#262619]/60 bg-[#0E2C22]/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#6B6B47] to-lime-400 p-0.5 shadow-lg shadow-[#1A1A11]/50 flex items-center justify-center">
              <div className="w-full h-full bg-[#12372A] rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🌿</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-white tracking-tight font-display">SmartCrop</h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#9D9678]/20 text-[#D4CEBA] border border-[#9D9678]/30">AI</span>
              </div>
              <p className="text-[11px] font-medium text-[#B8B098]/80 tracking-wider uppercase">Precision AgriTech</p>
            </div>
          </div>
          
          <Button 
            variant="ghost"
            onClick={onClose} 
            className="lg:hidden p-1.5 rounded-lg text-[#B8B098] hover:bg-[#262619]/50 transition-colors"
          >
            <X size={20} />
          </Button>
        </div>
        
        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto py-5 px-3.5 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-2 text-[11px] font-bold tracking-wider text-[#B8B098]/60 uppercase">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) => 
                        `group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-[#4A4A2E]/80 to-[#333320]/90 text-white shadow-md shadow-[#1A1A11]/40 border border-[#9D9678]/30 font-semibold' 
                            : 'text-[#F5F4EE]/70 hover:bg-[#262619]/40 hover:text-white'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <item.icon 
                              size={19} 
                              className={`transition-colors ${
                                isActive ? 'text-lime-300' : 'text-[#B8B098]/70 group-hover:text-[#D4CEBA]'
                              }`} 
                            />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime-400/20 text-lime-300 border border-lime-400/30">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Admin Management Section */}
          {user?.role === 'admin' && adminSections.map((section) => (
            <div key={section.title} className="pt-2 border-t border-[#262619]/50">
              <p className="px-3 mb-2 text-[11px] font-bold tracking-wider text-amber-400/70 uppercase">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) => 
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                          isActive 
                            ? 'bg-amber-900/40 text-amber-200 border border-amber-500/30' 
                            : 'text-[#F5F4EE]/70 hover:bg-[#262619]/40 hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={19} className="text-amber-400/80" />
                        <span>{item.name}</span>
                      </div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Quick AI Pro Tip in Sidebar */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0E2C22] to-[#164434] border border-[#333320]/40 text-xs">
            <div className="flex items-center gap-2 text-lime-300 font-semibold mb-1">
              <Sparkles size={15} />
              <span>Smart Advisor Tip</span>
            </div>
            <p className="text-[#E8E6D5]/80 leading-relaxed text-[11px]">
              Rotating legumes after wheat or rice restores up to 40 kg/ha of natural nitrogen in soil.
            </p>
          </div>
        </nav>
        
        {/* User Profile Footer */}
        <div className="p-4 border-t border-[#262619]/60 bg-[#0E2C22]/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9D9678] to-lime-400 text-[#1A1A11] font-bold flex items-center justify-center shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || 'F'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'Abhishek Farmer'}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse"></span>
                  <p className="text-[11px] font-medium text-[#D4CEBA]/80 capitalize">{user?.role || 'Farmer'}</p>
                </div>
              </div>
            </div>
            
            <Button 
              variant="danger"
              onClick={onLogout}
              title="Logout"
              className="p-2.5 rounded-xl text-[#B8B098]/80 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-800/40 transition-all"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
