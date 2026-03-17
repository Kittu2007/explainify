import { motion } from "framer-motion";

const steps = [
  { label: "Document", color: "#A855F7" },
  { label: "AI Analysis", color: "#7C3AED" },
  { label: "Explanation", color: "#5B21B6" },
  { label: "Video", color: "#C4B5FD" },
];

export default function WorkflowSection() {
  return (
    <section className="relative py-20 bg-[#0B1120] flex flex-col items-center justify-center">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        How Explainify Works
      </motion.h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={step.label}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: idx * 0.2 }}
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg"
              style={{ background: step.color }}
            >
              <span className="text-white text-2xl font-semibold drop-shadow-lg">
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-2 h-12 bg-gradient-to-b from-[#A855F7] via-[#7C3AED] to-[#5B21B6] rounded-full" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
