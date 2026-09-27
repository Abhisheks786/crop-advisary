import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sprout, Droplets, History, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Mobile Bottom Navigation Bar
 * Optimized for farmers on smartphones with >=48px touch targets,
 * visual icon indicators, and multilingual label translation.
 */
const MobileNav = ({ user }) => {
  const { t } = useLanguage();

  const navItems = [
    { name: t('home'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('advisory'), path: '/recommend', icon: Sprout, highlight: true },
    { name: t('irrigation'), path: '/irrigation', icon: Droplets },
    { name: t('farmPlan'), path: '/plan', icon: FileText },
    { name: t('history'), path: '/history', icon: History }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A11]/95 backdrop-blur-md border-t border-[#4A4A2E]/50 px-2 py-1 shadow-2xl safe-area-bottom">
      <nav className="flex items-center justify-around" aria-label="Mobile Navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            aria-label={item.name}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-h-[48px] px-2.5 py-1 rounded-xl transition-all duration-150 select-none ${
                isActive
                  ? 'text-[#8BC563] font-extrabold'
                  : 'text-[#D4CEBA] hover:text-white font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-transform ${
                  item.highlight && !isActive
                    ? 'bg-[#5FA83D] text-white shadow-xs'
                    : isActive 
                      ? 'bg-[#333320] text-[#8BC563] scale-110 shadow-xs' 
                      : ''
                }`}>
                  <item.icon size={20} aria-hidden="true" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight font-sans">
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileNav;
