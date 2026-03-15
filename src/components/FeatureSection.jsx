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
  // Use a high threshold so feature is considered "in view" when centered on screen
  const isInView = useInView(ref, { threshold: 0.5, margin: "0px" });

  // Determine if this is the active/focused feature
  const animationVariants = {
    active: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    inactive: {
      scale: 0.85,
      opacity: 0.5,
      filter: "blur(6px)",
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      animate={isInView ? "active" : "inactive"}
      variants={animationVariants}
      className="py-10 border-b border-gray-800 last:border-b-0"
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Icon with Pop Effect */}
        <motion.div
          className="mb-6 inline-block"
          whileHover={isInView ? { scale: 1.15, rotate: 8 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center"
            animate={isInView ? { boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" } : { boxShadow: "0 0 10px rgba(139, 92, 246, 0.2)" }}
            transition={{ duration: 0.4 }}
          >
            <Icon size={32} className="text-white" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {title}
        </h3>

        {/* Description */}
        <p className="text-lg text-gray-400 leading-relaxed mb-6">
          {description}
        </p>

        {/* Visual Separator */}
        <motion.div
          className="h-1 w-16 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"
          initial={{ width: 0, opacity: 0 }}
          animate={isInView ? { width: 64, opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
}

export default function FeatureSection() {
  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white py-6">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-indigo-900/10 pointer-events-none" />

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
