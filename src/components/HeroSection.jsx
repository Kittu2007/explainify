import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  const phrases = [
    "Learn through AI explanations",
    "Learn through AI videos",
    "Learn through AI insights",
    "Learn through AI summaries",
  ];

  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (fadeOut) {
      // After fade out, switch phrase and start typing
      const timeout = setTimeout(() => {
        setFadeOut(false);
        setDisplayedText("");
        setIsTyping(true);
        setIndex((prev) => (prev + 1) % phrases.length);
      }, 400); // fade out duration
      return () => clearTimeout(timeout);
    }

    if (!isTyping) {
      // After typing, keep phrase for 2 seconds then fade out
      const timeout = setTimeout(() => {
        setFadeOut(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }

    // Typing animation
    const currentPhrase = phrases[index];
    let charIndex = 0;
    setDisplayedText("");
    const typingInterval = setInterval(() => {
      if (charIndex <= currentPhrase.length) {
        setDisplayedText(currentPhrase.slice(0, charIndex));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 60);
    return () => clearInterval(typingInterval);
  }, [index, isTyping, fadeOut, phrases]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-6 overflow-hidden pt-20">
      {/* Subtle radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/30 to-gray-950/60 pointer-events-none" />

      {/* Glow Effects */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 -z-10 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 -z-10 animate-pulse" />

      {/* Main Content */}
      <motion.div
        className="text-center max-w-4xl z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Main Headline - Reduced Size */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
          Transform Documents into
          <span className="block bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Knowledge
          </span>
        </h1>

        {/* Rotating Text with Typing Animation & Smooth Fade */}
        <div className="h-12 md:h-16 mb-12 flex items-center justify-center">
          <motion.div
            className="text-lg md:text-xl text-gray-300 font-light text-center"
            animate={fadeOut ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            key={index}
          >
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block ml-0.5"
              >
                |
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={() => navigate("/upload")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-2xl"
        >
          Start Learning Now
        </motion.button>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 text-gray-400 text-sm md:text-base"
        >
          Upload documents • Ask questions • Learn with AI
        </motion.p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </div>
  );
}