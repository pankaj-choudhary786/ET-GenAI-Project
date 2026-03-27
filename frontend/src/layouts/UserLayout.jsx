import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UserSidebar from '../components/layout/UserSidebar';
import TopNavbar from '../components/layout/TopNavbar';

export default function UserLayout() {
  const location = useLocation();
  
  // Format the path into a title
  const pathParts = location.pathname.split('/').filter(Boolean);
  let title = "Dashboard";
  if (pathParts.length > 1) {
    const raw = pathParts[pathParts.length - 1];
    title = raw.charAt(0).toUpperCase() + raw.slice(1).replace('-', ' ');
  }

  return (
    <div className="flex min-h-screen bg-[#F0F4F8] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] bg-indigo-300/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <UserSidebar />
      <main className="flex-1 ml-64 flex flex-col w-[calc(100%-16rem)] min-h-screen relative z-10">
        <TopNavbar title={title} />
        <div className="flex-1 p-8 overflow-y-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}