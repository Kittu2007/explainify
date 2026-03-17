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
export default function FeatureBlock({ icon: Icon, title, description }) {
  const ref = useRef(null);
  const controls = useAnimation();

  // Use a generous margin so the block "snaps" when it centres on screen
  const isInView = useInView(ref, { margin: "-25% 0px -25% 0px", once: false });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const blockVariants = {
    hidden: {
      scale: 0.85,
      opacity: 0,
      y: 80,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.12,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  return (
    <motion.div
      ref={ref}
      variants={blockVariants}
      initial="hidden"
      animate={controls}
      className="flex flex-col items-center justify-center text-center px-6 py-14 md:py-20"
      style={{ minHeight: "50vh" }}
    >
      {/* ── Icon with glow + float ─────────────────────────────── */}
      <motion.div variants={childVariants} className="mb-6 relative">
        {/* Outer glow halo */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "rgba(123,31,162,0.35)",
            filter: "blur(22px)",
            transform: "scale(1.5)",
          }}
          animate={{
            opacity: [0.5, 0.9, 0.5],
            scale: [1.4, 1.7, 1.4],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Inner icon box */}
        <motion.div
          className="relative w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #3B0046 0%, #7B1FA2 55%, #9C4DCC 100%)",
            border: "1.5px solid rgba(201,182,211,0.22)",
            boxShadow: "0 0 28px rgba(156,77,204,0.55), 0 0 60px rgba(123,31,162,0.3)",
          }}
          animate={{
            y: [0, -10, 0],
            boxShadow: [
              "0 0 28px rgba(156,77,204,0.55), 0 0 60px rgba(123,31,162,0.3)",
              "0 0 44px rgba(156,77,204,0.80), 0 0 90px rgba(123,31,162,0.5)",
              "0 0 28px rgba(156,77,204,0.55), 0 0 60px rgba(123,31,162,0.3)",
            ],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon size={32} color="#C9B6D3" strokeWidth={1.6} />
        </motion.div>

        {/* Border pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2"
          style={{ borderColor: "rgba(156,77,204,0.6)" }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ── Title ─────────────────────────────────────────────────── */}
      <motion.h3
        variants={childVariants}
        className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight"
      >
        <ShimmerTitle>{title}</ShimmerTitle>
      </motion.h3>

      {/* ── Description ───────────────────────────────────────────── */}
      <motion.p
        variants={childVariants}
        className="text-sm md:text-base leading-relaxed max-w-md"
        style={{ color: "#C9B6D3", opacity: 0.82 }}
      >
        {description}
      </motion.p>

      {/* ── Decorative separator ──────────────────────────────────── */}
      <motion.div
        variants={childVariants}
        className="mt-6 h-0.5 w-12 rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, #9C4DCC, transparent)",
        }}
      />
    </motion.div>
  );
}
