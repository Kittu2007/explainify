"use client";
import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardNavbar from './DashboardNavbar';
import Silk from './ui/Silk';

export default function DashboardShell({ children }) {
  return (
    <div className="flex min-h-screen overflow-hidden relative">
      {/* Dynamic Silk Background */}
      <Silk 
        speed={5} 
        scale={1} 
        color="#7A1CAC" 
        noiseIntensity={1.5} 
        rotation={0} 
      />

      {/* Sidebar (Overlay) */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 w-full overflow-x-hidden">
        <div className="p-4 md:p-10 min-h-screen flex flex-col">
          <DashboardNavbar />
          
          <main className="flex-1 mt-4 md:mt-10 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full pb-20 md:pb-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
