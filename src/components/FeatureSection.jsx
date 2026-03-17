import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, MessageSquare, Play, Zap, Users, Shield } from "lucide-react";

const featureData = [
  {
    icon: FileText,
    title: "Smart Document Upload",
    description: "Upload any document and let AI understand its content instantly.",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Interface",
    description: "Ask questions about your documents and get intelligent responses.",
  },
  {
    icon: Play,
    title: "Video Learning",
    description: "Generate and watch personalized video explanations.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Get instant results with our optimized AI pipeline.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Share insights and learning materials with your team.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your documents are encrypted and stored securely.",
  },
];

function FeatureItem({ icon: Icon, title, description, index }) {
  const ref = useRef(null);
  // Use a threshold so feature is considered "in view" when centered on screen
  const isInView = useInView(ref, { threshold: 0.5, margin: "-50px" });

  // Pop-up animation variants
  const popVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0.3,
      filter: "blur(10px)",
    },
    visible: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    blurred: {
      scale: 0.85,
      opacity: 0.4,
      filter: "blur(8px)",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={popVariants}
      initial="hidden"
      animate={isInView ? "visible" : "blurred"}
      className="py-16 px-4 border-b border-gray-800/50 last:border-b-0 relative"
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Glow background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent rounded-3xl pointer-events-none"
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        />

        {/* Icon with Pop Effect */}
        <motion.div
          className="mb-8 inline-block relative z-10"
          animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0.9, rotate: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center relative"
            animate={
              isInView
                ? {
                    boxShadow: [
                      "0 0 20px rgba(139, 92, 246, 0.4)",
                      "0 0 40px rgba(139, 92, 246, 0.7)",
                      "0 0 60px rgba(139, 92, 246, 0.5)",
                    ],
                  }
                : { boxShadow: "0 0 10px rgba(139, 92, 246, 0.2)" }
            }
            transition={{
              duration: 2,
              repeat: isInView ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={isInView ? { y: [0, -4, 0] } : { y: 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon size={40} className="text-white" />
            </motion.div>
          </motion.div>

          {/* Border glow */}
          <motion.div
            className="absolute inset-0 w-20 h-20 rounded-3xl border-2 border-purple-400"
            animate={isInView ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.2 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10"
          animate={isInView ? { y: 0, opacity: 1 } : { y: 10, opacity: 0.5 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-lg text-gray-300 leading-relaxed mb-8 relative z-10"
          animate={isInView ? { y: 0, opacity: 1 } : { y: 10, opacity: 0.4 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {description}
        </motion.p>

        {/* Visual Separator with animation */}
        <motion.div
          className="h-1.5 w-20 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 mx-auto rounded-full relative z-10"
          animate={isInView ? { width: 80, opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

export default function FeatureSection() {
  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950 text-white py-20 overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-indigo-900/5 pointer-events-none"
        animate={{
          backgroundPosition: ["0% 0%", "0% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Floating orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-10"
          animate={{
            y: [0, 100, 0],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-10"
          animate={{
            y: [0, -100, 0],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {featureData.map((feature, index) => (
          <FeatureItem
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
