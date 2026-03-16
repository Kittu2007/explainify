"use client";
import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardNavbar from './DashboardNavbar';
import Silk from './ui/Silk';

export default function DashboardShell({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-dark overflow-hidden relative">
      {/* Dynamic Silk Background */}
      <Silk 
        speed={5} 
        scale={1} 
        color="#7B7481" 
        noiseIntensity={1.5} 
        rotation={0} 
      />

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
