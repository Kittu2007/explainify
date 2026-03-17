"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User, LogIn } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import ClickSparkButton from './ClickSparkButton'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  
  if (pathname.startsWith('/dashboard') || pathname === '/login' || pathname === '/register') return null;
  
  const isActive = (path) => pathname === path
  
  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }
  
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard/upload' },
  ]
  
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300">
      <div className="bg-[#0D0010]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-6 py-3">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="Explainify" 
              className="h-16 w-auto object-contain transition-all duration-300 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.4)] group-hover:scale-110" 
            />
            <span className="text-xl font-black text-white tracking-tighter group-hover:text-purple-400 transition-colors">
              Explainify <span className="text-purple-500">AI</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <User size={14} className="text-purple-400" />
                    <span className="text-xs font-medium text-gray-300 max-w-[120px] truncate">{user.email}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
                    title="Sign Out"
                  >
                    <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ) : (
                <ClickSparkButton 
                  onClick={() => router.push("/login")}
                  className="relative overflow-hidden flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-500/20 group"
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </ClickSparkButton>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400"
              >
                <LogOut size={20} />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-400 hover:bg-white/5 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-white/10 pt-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/login");
                }}
                className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-center shadow-lg mt-4"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
