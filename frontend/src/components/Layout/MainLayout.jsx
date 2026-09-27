import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import DemoModeBanner from '../Auth/DemoModeBanner';
import { useAuth } from '../../hooks/useAuth';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F7FAF5] flex font-sans text-slate-800">
      {/* Modern Dark Sidebar: Flex sibling on desktop, Drawer on mobile */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        user={user} 
        onLogout={logout} 
      />
      
      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Demo Mode Banner */}
        <DemoModeBanner />
        
        {/* Header */}
        <Header 
          onToggleSidebar={() => setSidebarOpen(prev => !prev)} 
          user={user} 
        />
        
        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav user={user} />
    </div>
  );
};

export default MainLayout;
