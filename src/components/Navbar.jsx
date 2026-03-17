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
    <nav className="bg-dark text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <img src="/logo.png" alt="Explainify" className="h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-lg transition-all ${
                  isActive(link.path)
                    ? 'bg-primary text-white font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="ml-4 pl-4 border-l border-gray-700 flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full border border-gray-700">
                    <User size={14} className="text-primary" />
                    <span className="text-xs font-medium text-gray-300 max-w-[120px] truncate">{user.email}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-white hover:bg-red-500/10 rounded-lg transition-all group"
                    title="Sign Out"
                  >
                    <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ) : (
                <ClickSparkButton 
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-secondary text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 group"
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
              className="p-2 rounded-lg hover:bg-gray-700"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  isActive(link.path)
                    ? 'bg-primary text-white font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <ClickSparkButton
                onClick={() => {
                  setIsOpen(false);
                  router.push("/login");
                }}
                className="block w-[95%] px-4 py-3 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-xl text-center shadow-lg mx-2 mt-4"
              >
                Sign In
              </ClickSparkButton>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
