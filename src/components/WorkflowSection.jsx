"use client";
import { motion } from "framer-motion";

const steps = [
  { label: "Document", color: "#A855F7" },
  { label: "AI Analysis", color: "#7C3AED" },
  { label: "Explanation", color: "#5B21B6" },
  { label: "Video", color: "#C4B5FD" },
];

export default function WorkflowSection() {
  return (
    <section className="relative py-32 bg-[#0D0010] flex flex-col items-center justify-center overflow-hidden">
      <motion.h2
        className="text-4xl md:text-6xl font-black text-white mb-24 text-center tracking-tight"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        How <span className="text-purple-500">Explainify</span> Works
      </motion.h2>

      <div className="relative w-full max-w-6xl px-10">
        {/* Background connector line for desktop */}
        <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0 hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          {steps.map((step, idx) => (
            <motion.div
              key={step.label}
              className="flex flex-col items-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
            >
              {/* Circle */}
              <div className="relative mb-8">
                <motion.div
                  className="w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)] border-2 border-white/10 group-hover:border-purple-500/50 transition-colors duration-500"
                  style={{ background: `linear-gradient(135deg, ${step.color}, #1E1E1E)` }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="text-white text-4xl font-black opacity-20 select-none">
                    0{idx + 1}
                  </span>
                </motion.div>
                
                {/* Floating Glow */}
                <div className="absolute -inset-4 bg-purple-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Label */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-purple-300 transition-colors">
                  {step.label}
                </h3>
                <div className="h-1.5 w-8 bg-purple-600 rounded-full mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]" />
    </section>
  );
}
