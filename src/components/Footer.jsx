import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()
  
  const features = [
    'Upload documents',
    'Ask questions from PDFs',
    'Get instant summaries',
    'Extract key insights'
  ]

  const handleGetStarted = () => {
    navigate('/upload')
  }

  return (
    <footer
      className="relative w-full overflow-hidden py-10 px-6"
      style={{
        background: 'linear-gradient(to top, #0B0014 0%, #1A0033 50%, #2D0B3A 100%)'
      }}
    >
      {/* Center radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08), transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Soft top border glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(168, 85, 247, 0.2), transparent)',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)'
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Main Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h3
            className="text-lg md:text-2xl font-bold leading-snug"
            style={{
              background: 'linear-gradient(90deg, #A855F7 0%, #E9D5FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.02em'
            }}
          >
            Transform documents into smart learning
          </h3>
        </motion.div>

        {/* What You Can Do Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h4
            className="text-center text-xs md:text-sm font-semibold mb-3 tracking-wide uppercase"
            style={{ color: 'rgba(201, 182, 211, 0.7)' }}
          >
            What you can do
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.15 + index * 0.06,
                  ease: 'easeOut'
                }}
                viewport={{ once: true }}
                className="will-change-transform"
              >
                <div
                  className="flex items-center justify-center gap-2 py-2 px-3 transition-all duration-300"
                  style={{ color: '#E9D5FF' }}
                >
                  {/* Glowing dot indicator */}
                  <div
                    className="relative flex-shrink-0"
                    style={{
                      width: '6px',
                      height: '6px',
                      background: 'linear-gradient(135deg, #A855F7, #E9D5FF)',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px rgba(168, 85, 247, 0.5)'
                    }}
                  />
                  
                  <p className="text-xs md:text-sm font-light">{feature}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Get Started Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="flex justify-center mb-5"
        >
          <motion.button
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="px-5 py-2 rounded-xl font-medium text-white text-sm transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #6A0DAD, #A855F7)',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 25px rgba(168, 85, 247, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.3)'
            }}
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Demo Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          viewport={{ once: true }}
          className="text-center mb-4"
          style={{ color: 'rgba(168, 85, 247, 0.5)' }}
        >
          <p className="text-xs font-light italic">
            Demo project built for hackathon
          </p>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
          style={{ color: 'rgba(201, 182, 211, 0.3)' }}
        >
          <p className="text-xs font-light tracking-wide">
            © 2026 Explainify
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
