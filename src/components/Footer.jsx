import { Github, Linkedin, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'FAQ', href: '#faq' }
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Blog', href: '#blog' },
        { label: 'Documentation', href: '#docs' },
        { label: 'Support', href: '#support' }
      ]
    },
    {
      title: 'Follow Us',
      social: true,
      links: [
        { icon: Github, href: '#github' },
        { icon: Linkedin, href: '#linkedin' },
        { icon: Twitter, href: '#twitter' }
      ]
    }
  ]
  
  return (
    <footer className="bg-gray-950 text-white border-t border-gray-800/50 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-indigo-900/5 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 8 }}
              >
                <span className="font-bold text-lg">E</span>
              </motion.div>
              <span className="text-2xl font-bold">Explainify</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transform your documents into interactive learning experiences powered by AI.
            </p>
          </motion.div>
          
          {/* Links */}
          {footerLinks.slice(0, 2).map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (idx + 1) }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-6 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <motion.a
                      href={link.href}
                      className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                      whileHover={{ x: 4 }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
          
          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-6 text-white">Follow Us</h4>
            <div className="flex space-x-4">
              {footerLinks[2].links.map((link, i) => {
                const Icon = link.icon
                return (
                  <motion.a
                    key={i}
                    href={link.href}
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-indigo-600 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                    whileHover={{ scale: 1.2, rotate: 8 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={20} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </div>
        
        {/* Divider */}
        <motion.div
          className="border-t border-gray-800/50 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-center text-gray-500 text-sm">
            © {currentYear} Explainify. All rights reserved. | 
            <motion.a href="#privacy" className="hover:text-purple-400 ml-2 transition-colors" whileHover={{ x: 2 }}>
              Privacy Policy
            </motion.a>
            {' '} | 
            <motion.a href="#terms" className="hover:text-purple-400 ml-2 transition-colors" whileHover={{ x: 2 }}>
              Terms of Service
            </motion.a>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
