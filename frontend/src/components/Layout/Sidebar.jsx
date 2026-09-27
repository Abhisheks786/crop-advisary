import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sprout, 
  History, 
  Droplets, 
  RefreshCw, 
  Package, 
  Shield, 
  Wheat, 
  LogOut, 
  X,
  BarChart3,
  FileText
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  const location = useLocation();

  const isItemActive = (item, isActive) => {
    if (item.path.includes('#analytics')) {
      return location.pathname === '/dashboard' && location.hash === '#analytics';
    }
    if (item.path === '/dashboard') {
      return isActive && location.hash !== '#analytics';
    }
    return isActive;
  };

  const sections = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'PLAN',
      items: [
        { name: 'Crop Advisor', path: '/recommend', icon: Sprout },
        { name: 'Farm Plan', path: '/plan', icon: FileText },
        { name: 'Crop Rotation', path: '/rotation', icon: RefreshCw },
      ]
    },
    {
      title: 'RESOURCES',
      items: [
        { name: 'Irrigation', path: '/irrigation', icon: Droplets },
        { name: 'Resource Budget', path: '/resources', icon: Package },
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { name: 'Advisory History', path: '/history', icon: History },
        { name: 'Analytics', path: '/dashboard#analytics', icon: BarChart3, end: false },
      ]
    }
  ];

  const adminSections = [
    {
      title: 'MANAGEMENT',
      items: [
        { name: 'Admin Console', path: '/admin', icon: Shield },
        { name: 'Crop Catalog', path: '/admin/crops', icon: Wheat },
        { name: 'System Analytics', path: '/admin/statistics', icon: BarChart3 },
      ]
    }
  ];

  const itemClass = (active) =>
    `relative flex items-center gap-3 pl-3.5 pr-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
      active
        ? 'bg-white/[0.07] text-white font-medium'
        : 'text-[#D4CEBA]/75 hover:bg-white/[0.04] hover:text-white'
    }`;

  const renderContent = (isMobile = false) => (
    <div className="flex flex-col h-full select-none">
      <div className="p-5 flex items-center justify-between border-b border-white/8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1A4A38] border border-white/10 flex items-center justify-center shrink-0">
            <span className="text-lg">🌿</span>
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-white tracking-tight font-display">SmartCrop AI</h1>
            <p className="text-[11px] text-[#B8B098]/70">Farmer assistant</p>
          </div>
        </div>
        
        {isMobile && (
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg text-[#B8B098] hover:text-white hover:bg-white/8 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-1.5 text-[10px] font-medium tracking-[0.16em] text-[#B8B098]/50 uppercase">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/dashboard'}
                    onClick={isMobile ? onClose : undefined}
                    className={({ isActive }) => itemClass(isItemActive(item, isActive))}
                  >
                    {({ isActive }) => {
                      const active = isItemActive(item, isActive);
                      return (
                      <>
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            active ? 'bg-[#86EFAC]' : 'bg-transparent ring-1 ring-[#B8B098]/40'
                          }`}
                          aria-hidden
                        />
                        <item.icon 
                          size={17} 
                          className={`shrink-0 ${active ? 'text-[#86EFAC]' : 'text-[#B8B098]/80'}`} 
                        />
                        <span>{item.name}</span>
                      </>
                      );
                    }}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        {user?.role === 'admin' && adminSections.map((section) => (
          <div key={section.title} className="pt-2 border-t border-white/8">
            <p className="px-3 mb-1.5 text-[10px] font-medium tracking-[0.16em] text-amber-400/60 uppercase">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={isMobile ? onClose : undefined}
                    className={({ isActive }) => itemClass(isActive)}
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isActive ? 'bg-amber-300' : 'bg-transparent ring-1 ring-[#B8B098]/40'
                          }`}
                          aria-hidden
                        />
                        <item.icon size={17} className={`shrink-0 ${isActive ? 'text-amber-300' : 'text-amber-400/70'}`} />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/8 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#1A4A38] text-[#86EFAC] text-sm font-semibold flex items-center justify-center border border-white/10 shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'F'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Demo Farmer'}</p>
              <p className="text-[11px] text-[#D4CEBA]/70 capitalize truncate">{user?.role || 'Farmer'}</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            title="Logout"
            className="p-2 rounded-lg text-[#B8B098]/80 hover:text-red-300 hover:bg-red-950/30 transition-colors shrink-0"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 bg-[#12372A] text-slate-200 border-r border-[#0A2018] sticky top-0 h-screen overflow-hidden z-20">
        {renderContent(false)}
      </aside>

      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none delay-200'
      }`}>
        <div 
          className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose} 
        />
        
        <aside className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#12372A] text-slate-200 shadow-2xl flex flex-col z-50 border-r border-[#0A2018] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {renderContent(true)}
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
