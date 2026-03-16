"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StaggeredMenu from './ui/StaggeredMenu';
import { useAuth } from '@/context/AuthContext';
import { useDocument } from '@/context/DocumentContext';

export default function DashboardSidebar() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { document, clearContext, loadChat } = useDocument();
  
  const [chats, setChats] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch chats and profile
  const fetchData = async () => {
    if (!user?.uid) return;
    
    try {
      // Fetch Profile
      const profileRes = await fetch(`/api/profile?userId=${user.uid}`);
      const profileData = await profileRes.json();
      setProfile(profileData);

      // Fetch Chats
      const chatsRes = await fetch(`/api/chats?userId=${user.uid}`);
      const chatsData = await chatsRes.json();
      setChats(chatsData);
    } catch (err) {
      console.error("Failed to fetch sidebar data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Simple polling for "real-time" sync if needed, 
    // or we could use a more sophisticated approach.
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, [user]);

  const handleNewChat = () => {
    clearContext();
    router.push('/dashboard/upload');
  };

  const handleChatSelect = (chat) => {
    console.log("[Sidebar] Selected chat:", chat.id);
    loadChat(chat);
    router.push('/dashboard/chat');
  };

  const handleProfileUpdate = async (newName) => {
    if (!user?.uid) return;
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, displayName: newName })
      });
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 z-50 pointer-events-none">
      <StaggeredMenu 
        position="left"
        items={chats}
        onNewChat={handleNewChat}
        onSignOut={signOut}
        onChatSelect={handleChatSelect}
        onProfileUpdate={handleProfileUpdate}
        user={user}
        profile={profile}
      />
    </div>
  );
}
