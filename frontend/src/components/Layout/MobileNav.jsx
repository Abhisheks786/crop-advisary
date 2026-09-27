import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sprout, Droplets, History, Shield, User } from 'lucide-react';

const MobileNav = ({ user }) => {
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Advisor', path: '/recommend', icon: Sprout, highlight: true },
    { name: 'Water', path: '/irrigation', icon: Droplets },
    { name: 'History', path: '/history', icon: History },
    { 
      name: user?.role === 'admin' ? 'Admin' : 'Me', 
      path: user?.role === 'admin' ? '/admin' : '/dashboard', 
      icon: user?.role === 'admin' ? Shield : User 
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#12372A]/95 backdrop-blur-md border-t border-[#262619]/80 px-2 py-1.5 shadow-2xl">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-lime-400 font-bold scale-105'
                  : 'text-[#D4CEBA]/70 hover:text-[#F5F4EE] font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl ${
                  item.highlight && !isActive
                    ? 'bg-[#6B6B47]/50 text-lime-300'
                    : isActive 
                      ? 'bg-[#333320]/80 text-lime-300 shadow-sm' 
                      : ''
                }`}>
                  <item.icon size={20} />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileNav;
