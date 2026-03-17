import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Home, Upload } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dock, DockItem } from './ui/dock'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path
  
  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Upload', path: '/upload', icon: Upload }
  ]
  
  return (
    <nav className="bg-gray-950 text-white shadow-lg sticky top-0 z-50 border-b border-gray-800 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.15, rotate: 8 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="font-bold text-lg">E</span>
            </motion.div>
            <span className="text-2xl font-bold hidden sm:inline">Explainify</span>
          </Link>
          
          {/* Desktop Navigation - Dock Style */}
          <div className="hidden md:flex items-center">
            <motion.div
              className="flex gap-2 bg-gray-900 bg-opacity-50 px-3 py-2 rounded-full border border-gray-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Dock className="gap-1">
                {navLinks.map(link => {
                  const Icon = link.icon
                  const active = isActive(link.path)
                  return (
                    <Link key={link.path} to={link.path}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                          active
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                        }`}
                      >
                        <Icon size={18} />
                        <span className="font-semibold">{link.label}</span>
                      </motion.div>
                    </Link>
                  )
                })}
              </Dock>
            </motion.div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden pb-4 space-y-2"
          >
            {navLinks.map(link => {
              const Icon = link.icon
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    active
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              )
            })}
          </motion.div>
        )}
      </div>
    </nav>
  )
}
