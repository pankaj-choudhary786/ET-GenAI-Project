import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import TopNavbar from '../components/layout/TopNavbar';

export default function AdminLayout() {
  const location = useLocation();
  
  const pathParts = location.pathname.split('/').filter(Boolean);
  let title = "Admin Dashboard";
  if (pathParts.length > 1) {
    const raw = pathParts[pathParts.length - 1];
    title = "Admin: " + raw.charAt(0).toUpperCase() + raw.slice(1).replace('-', ' ');
  }

  return (
    <div className="flex min-h-screen bg-[#F3F0F8] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-300/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] bg-fuchsia-300/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <AdminSidebar />
      <main className="flex-1 ml-64 flex flex-col w-[calc(100%-16rem)] min-h-screen relative z-10">
        <TopNavbar title={title} userName="Admin User" />
        <div className="flex-1 p-8 overflow-y-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}