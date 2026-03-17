"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ParticlesBackground from "./ParticlesBackground";

export default function HeroSection() {
  const router = useRouter();

  const phrases = [
    "AI-powered document learning",
    "Instant explanations & video",
    "Ask questions, get answers",
    "Your knowledge, supercharged",
  ];

  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (fadeOut) {
      const timeout = setTimeout(() => {
        setFadeOut(false);
        setDisplayedText("");
        setIsTyping(true);
        setIndex((prev) => (prev + 1) % phrases.length);
      }, 400);
      return () => clearTimeout(timeout);
    }
    if (!isTyping) {
      const timeout = setTimeout(() => {
        setFadeOut(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
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
    <div className="relative min-h-screen w-full text-white overflow-hidden flex items-center justify-center">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <ParticlesBackground />
      </div>
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/80 via-[#020617]/60 to-[#0B1120]/90 pointer-events-none z-5" />
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full pt-32 pb-24 px-6">
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8 bg-gradient-to-r from-[#A855F7] via-[#7C3AED] to-[#5B21B6] bg-clip-text text-transparent drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Explainify: AI Document Learning
        </motion.h1>
        {/* Typing Animation */}
        <div className="h-12 md:h-16 mb-12 flex items-center justify-center">
          <motion.div
            className="text-lg md:text-xl text-[#C4B5FD] font-light text-center min-h-[2rem]"
            animate={fadeOut ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            key={index}
          >
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block ml-0.5 text-[#A855F7]"
              >
                |
              </motion.span>
            )}
          </motion.div>
        </div>
        {/* Glowing CTA Button */}
        <motion.button
          onClick={() => router.push("/dashboard/upload")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ scale: 1.08, boxShadow: "0 0 40px #A855F7, 0 0 80px #7C3AED" }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-5 bg-gradient-to-r from-[#A855F7] via-[#7C3AED] to-[#5B21B6] rounded-xl font-semibold text-2xl transition-all duration-300 shadow-2xl text-white border border-[#C4B5FD]/30 hover:shadow-[0_0_40px_#A855F7,0_0_80px_#7C3AED]"
        >
          Upload Document
        </motion.button>
        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-[#C4B5FD] text-base md:text-lg tracking-wide"
        >
          Upload documents &bull; Ask questions &bull; Learn with AI
        </motion.p>
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg
            className="w-6 h-6 text-[#C4B5FD]"
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
    </div>
  );
}
