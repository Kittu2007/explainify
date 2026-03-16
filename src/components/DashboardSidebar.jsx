"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import StaggeredMenu from './ui/StaggeredMenu';
import { useAuth } from '@/context/AuthContext';
import { useDocument } from '@/context/DocumentContext';

export default function DashboardSidebar() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { document, clearContext } = useDocument();

  // Derived history from current session if exists
  const historyItems = document ? [
    { label: document.name, link: '/dashboard/chat', date: 'Active Session' },
    { label: 'Quantum Physics Analysis', link: '/dashboard/chat', date: '2 hours ago' },
    { label: 'Marketing Strategy Doc', link: '/dashboard/chat', date: '5 hours ago' },
  ] : [
    { label: 'Quantum Physics Analysis', link: '/dashboard/chat', date: '2 hours ago' },
    { label: 'Marketing Strategy Doc', link: '/dashboard/chat', date: '5 hours ago' },
    { label: 'User Research Synthesis', link: '/dashboard/chat', date: 'Yesterday' },
  ];

  const handleNewChat = () => {
    clearContext();
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
      />
    </div>
  );
}
