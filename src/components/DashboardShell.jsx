"use client";
import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardNavbar from './DashboardNavbar';

export default function DashboardShell({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-dark overflow-hidden relative">
      {/* Silk Background Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full animate-blob [animation-delay:2s]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-accent/10 blur-[100px] rounded-full animate-blob [animation-delay:4s]" />
      </div>

      {/* Sidebar */}
      <DashboardSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-500 relative z-10 ${
          isSidebarCollapsed ? 'ml-24' : 'ml-72'
        }`}
      >
        <div className="p-6 h-screen flex flex-col">
          <DashboardNavbar />
          
          <main className="flex-1 mt-6 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full pb-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
