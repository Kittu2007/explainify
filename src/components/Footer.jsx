"use client";
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()
  
  if (pathname.startsWith('/dashboard')) return null;
  
  return (
    <footer className="bg-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="Explainify" className="h-8 w-auto object-contain" />
            </div>
            <p className="text-gray-400 text-sm">
              Transform your documents into interactive learning experiences powered by AI.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          
          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#blog" className="hover:text-white transition">Blog</a></li>
              <li><a href="#docs" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#support" className="hover:text-white transition">Support</a></li>
            </ul>
          </div>
          
          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © {currentYear} Explainify. All rights reserved. | 
            <a href="#privacy" className="hover:text-white ml-2 transition">Privacy Policy</a> | 
            <a href="#terms" className="hover:text-white ml-2 transition">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
