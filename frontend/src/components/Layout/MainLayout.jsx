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
    <div className="min-h-screen bg-[#F7FAF5] flex flex-col font-sans text-slate-800">
      {/* Top Demo Mode Banner */}
      <DemoModeBanner />
      
      <div className="flex flex-1 relative">
        {/* Modern Dark Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          user={user} 
          onLogout={logout} 
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
          {/* Header */}
          <Header 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            user={user} 
          />
          
          {/* Page View Container with bottom padding for mobile bar */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav user={user} />
    </div>
  );
};

export default MainLayout;
