"use client";
import { motion } from "framer-motion";

export default function DemoSection() {
  return (
    <section className="relative py-20 bg-[#020617] flex flex-col items-center justify-center">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        See Explainify in Action
      </motion.h2>
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Document Upload Preview */}
        <motion.div
          className="flex-1 bg-[#0B1120] rounded-2xl p-8 shadow-lg border border-[#7C3AED]/30"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="text-[#A855F7] text-xl font-bold mb-2">Upload Document</div>
          <div className="bg-[#020617] rounded-lg p-4 text-white text-sm">PDF, DOCX, TXT supported</div>
        </motion.div>
        {/* AI Explanation Preview */}
        <motion.div
          className="flex-1 bg-[#0B1120] rounded-2xl p-8 shadow-lg border border-[#7C3AED]/30"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="text-[#7C3AED] text-xl font-bold mb-2">AI Explanation</div>
          <div className="bg-[#020617] rounded-lg p-4 text-white text-sm">&quot;Explain the main idea of this document.&quot;</div>
        </motion.div>
        {/* Video Preview */}
        <motion.div
          className="flex-1 bg-[#0B1120] rounded-2xl p-8 shadow-lg border border-[#7C3AED]/30"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div className="text-[#C4B5FD] text-xl font-bold mb-2">Generated Video</div>
          <div className="bg-[#020617] rounded-lg p-4 text-white text-sm">Watch a personalized video summary</div>
        </motion.div>
      </div>
    </section>
  );
}
