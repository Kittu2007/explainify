"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import StaggeredMenu from './ui/StaggeredMenu';
import { useAuth } from '@/context/AuthContext';

export default function DashboardSidebar({ isCollapsed, onToggle }) {
  const router = useRouter();
  const { signOut, user } = useAuth();

  // Placeholder history items
  const historyItems = [
    { label: 'Quantum Physics Analysis', link: '/dashboard/chat', date: '2 hours ago' },
    { label: 'Marketing Strategy Doc', link: '/dashboard/chat', date: '5 hours ago' },
    { label: 'User Research Synthesis', link: '/dashboard/chat', date: 'Yesterday' },
  ];

  const handleNewChat = () => {
    router.push('/dashboard/upload');
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 z-50 pointer-events-none">
      <StaggeredMenu 
        position="left"
        items={historyItems}
        onNewChat={handleNewChat}
        onSignOut={signOut}
        user={user}
        colors={['#2E073F', '#7A1CAC']}
        accentColor="#AD49E1"
      />
    </div>
  );
}
