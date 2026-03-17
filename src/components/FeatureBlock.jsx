import { useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect } from "react";

/* ─── Shimmer Title ─────────────────────────────────────────────── */
function ShimmerTitle({ children }) {
  return (
    <>
      <style>{`
        @keyframes shimmer-move {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #7B1FA2 0%,
            #9C4DCC 30%,
            #C9B6D3 50%,
            #9C4DCC 70%,
            #7B1FA2 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-move 3.5s linear infinite;
        }
      `}</style>
      <span className="shimmer-text">{children}</span>
    </>
  );
}

/* ─── FeatureBlock ──────────────────────────────────────────────── */
export default function FeatureBlock({ icon: Icon, title, description, isActive = false }) {
  const ref = useRef(null);
  const controls = useAnimation();

  /* ─ Initial entry animation (triggers on early visibility) ─ */
  const isInView = useInView(ref, { 
    amount: 0.25,
    once: false
  });

  useEffect(() => {
    if (isInView) {
      controls.start("enter");
    }
  }, [isInView, controls]);

  /* ─ Block variants: initial entry + active/inactive states ─ */
  const blockVariants = {
    initial: {
      scale: 0.95,
      opacity: 0,
      y: 40,
      filter: "blur(6px)",
    },
    enter: {
      scale: 1,
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    active: {
      scale: 1,
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      zIndex: 2,
      transition: {
        duration: 0.55,
        ease: "easeOut",
      },
    },
    inactive: {
      scale: 0.92,
      opacity: 0.5,
      y: -20,
      filter: "blur(4px)",
      boxShadow: "none",
      zIndex: 1,
      transition: {
        duration: 0.55,
        ease: "easeOut",
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? (isActive ? "active" : "inactive") : "initial"}
      variants={blockVariants}
      className="flex flex-col items-center justify-center text-center px-6 py-14 md:py-20 will-change-transform"
      style={{ 
        minHeight: "50vh",
        position: "relative",
      }}
    >
      {/* ── Icon with glow + float ─────────────────────────────── */}
      <motion.div 
        variants={childVariants} 
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mb-6 relative"
      >
        {/* Outer glow halo */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: "rgba(123,31,162,0.35)",
            filter: "blur(22px)",
            transform: "scale(1.5)",
          }}
          animate={isActive ? {
            opacity: [0.6, 1, 0.6],
            scale: [1.4, 1.8, 1.4],
          } : {
            opacity: [0.3, 0.5, 0.3],
            scale: [1.2, 1.4, 1.2],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Inner icon box */}
        <motion.div
          className="relative w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center will-change-transform"
          style={{
            background: "linear-gradient(135deg, #3B0046 0%, #7B1FA2 55%, #9C4DCC 100%)",
            border: "1.5px solid rgba(201,182,211,0.22)",
            boxShadow: "0 0 28px rgba(156,77,204,0.55), 0 0 60px rgba(123,31,162,0.3)",
          }}
          animate={isActive ? {
            y: [0, -10, 0],
          } : {
            y: 0,
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon size={32} color="#C9B6D3" strokeWidth={1.6} />
        </motion.div>

        {/* Border pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
          style={{ borderColor: "rgba(156,77,204,0.6)" }}
          animate={isActive ? {
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.12, 1],
          } : {
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.04, 1],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ── Title ─────────────────────────────────────────────────── */}
      <motion.h3
        variants={childVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight"
      >
        <ShimmerTitle>{title}</ShimmerTitle>
      </motion.h3>

      {/* ── Description ───────────────────────────────────────────── */}
      <motion.p
        variants={childVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-sm md:text-base leading-relaxed max-w-md will-change-transform"
        style={{ color: "#C9B6D3", opacity: 0.82 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
}
