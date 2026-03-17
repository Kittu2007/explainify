"use client";
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import GooeyNav from './ui/GooeyNav';

export default function DashboardNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const navItems = [
    { label: 'Upload', href: '/dashboard/upload' },
    { label: 'AI Chat', href: '/dashboard/chat' },
    { label: 'Summary', href: '/dashboard/results' },
    { label: 'Visuals', href: '/dashboard/video' },
  ];

  const activeIndex = navItems.findIndex(item => pathname.startsWith(item.href));

  return (
    <header className="h-16 md:h-20 mt-12 md:mt-0 flex items-center justify-center sticky top-0 z-40 px-2 md:px-4">
      <div className="glass px-1 md:px-2 py-1 md:py-1.5 rounded-full flex items-center shadow-2xl border border-white/5 w-full max-w-[340px] md:max-w-2xl justify-center">
        <GooeyNav
          items={navItems.map(item => ({
            ...item,
            onClick: () => router.push(item.href)
          }))}
          initialActiveIndex={activeIndex !== -1 ? activeIndex : 0}
          particleCount={8}
          particleR={60}
          animationTime={500}
        />
      </div>
    </header>
  );
}
