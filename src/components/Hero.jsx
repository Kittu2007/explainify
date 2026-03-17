import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import LiquidEther from "./LiquidEther";
import GlowCursor from "./GlowCursor";
import FeaturesSection from "./FeaturesSection";

/* ─────────────────────────────────────────────────────────────────
   Framer Motion Variants
───────────────────────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "backOut" },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─────────────────────────────────────────────────────────────────
   Hero Component
───────────────────────────────────────────────────────────────── */
export default function Hero() {
  const navigate = useNavigate();

  return (
    <>
    <div className="relative h-screen w-full overflow-hidden bg-[#0D0010]">

      {/* ── 1. Liquid Ether Background ─────────────────────────── */}
      <div className="absolute inset-0 z-0" style={{ opacity: 0.82 }}>
        <LiquidEther
          colors={["#3B0046", "#7B1FA2", "#9C4DCC", "#C9B6D3"]}
          autoDemo={true}
          autoSpeed={0.3}
          autoIntensity={2.2}
          mouseForce={20}
          cursorSize={100}
          resolution={0.5}
          BFECC={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* ── 2. Dark Overlay — keeps text legible ───────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,0,18,0.75) 0%, rgba(18,0,32,0.52) 45%, rgba(10,0,18,0.82) 100%)",
        }}
      />

      {/* ── 3. Ambient Radial Glow ─────────────────────────────── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 68% 52% at 50% 44%, rgba(123,31,162,0.16) 0%, transparent 68%)",
        }}
      />

      {/* ── 4. Glow Cursor (React Bits) ────────────────────────── */}
      {/*
          GlowCursor must live INSIDE the positioned container so its
          parentElement is this div (z-[3]).
          pointer-events: none is already set inside the component.
      */}
      <div className="absolute inset-0 z-[3] overflow-hidden">
        <GlowCursor color="#9C4DCC" size={380} opacity={0.15} blur={55} />
      </div>

      {/* ── 5. Hero Content ────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
      >
        {/* ─ Badge ─ */}
        <motion.div variants={badgeVariants} className="mb-5">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase border"
            style={{
              background: "rgba(123,31,162,0.16)",
              borderColor: "rgba(201,182,211,0.22)",
              color: "#C9B6D3",
              backdropFilter: "blur(10px)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#9C4DCC] animate-pulse" />
            AI-Powered Document Learning
          </span>
        </motion.div>

        {/* ─ Headline ─ */}
        <motion.h1
          variants={fadeUpVariants}
          className="text-[2.1rem] sm:text-[2.6rem] md:text-[3rem] lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight mb-4"
          style={{ color: "#FFFFFF", maxWidth: "820px" }}
        >
          Transform Documents{" "}
          <br className="hidden sm:block" />
          into{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #7B1FA2 0%, #9C4DCC 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 24px rgba(156,77,204,0.55))",
            }}
          >
            Knowledge
          </span>
        </motion.h1>

        {/* ─ Typing Animation (React Bits / react-type-animation) ─ */}
        <motion.div
          variants={fadeUpVariants}
          className="mb-8 h-10 flex items-center justify-center"
        >
          {/*
              TypeAnimation from react-type-animation:
              sequence = alternating [text, pause-ms, ...]
              The constant prefix "Learn through " is rendered as a plain
              span; only the changing part is animated.
          */}
          <p className="text-base sm:text-lg md:text-xl font-medium"
            style={{ color: "rgba(201,182,211,0.82)" }}
          >
            <span className="mr-1">Learn through</span>
            <TypeAnimation
              sequence={[
                "AI chat",          1800,
                "smart summaries",  1800,
                "AI generated videos", 1800,
                "interactive explanations", 1800,
              ]}
              wrapper="span"
              repeat={Infinity}
              speed={55}
              deletionSpeed={70}
              style={{
                background: "linear-gradient(90deg, #9C4DCC, #C9B6D3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 600,
              }}
            />
          </p>
        </motion.div>

        {/* ─ CTA Button ─ */}
        <motion.button
          variants={buttonVariants}
          whileHover={{
            scale: 1.06,
            boxShadow:
              "0 0 40px rgba(156,77,204,0.70), 0 0 80px rgba(123,31,162,0.38)",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/upload")}
          className="relative group px-10 py-4 rounded-xl font-semibold text-base md:text-lg text-white overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #7B1FA2 0%, #9C4DCC 55%, #7B1FA2 100%)",
            boxShadow:
              "0 0 22px rgba(123,31,162,0.42), 0 4px 24px rgba(59,0,70,0.5)",
            border: "1px solid rgba(201,182,211,0.18)",
          }}
        >
          {/* Shimmer on hover */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
            style={{
              background:
                "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.13) 50%, transparent 80%)",
            }}
          />
          <span className="relative flex items-center gap-2">
            Start Learning Now
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </motion.button>

        {/* ─ Trust Indicators ─ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs"
          style={{ color: "rgba(201,182,211,0.48)" }}
        >
          {["No credit card required", "Instant results", "100% Private"].map(
            (text) => (
              <span key={text} className="flex items-center gap-1.5">
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  style={{ color: "#9C4DCC" }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {text}
              </span>
            )
          )}
        </motion.div>
      </motion.div>

      {/* ── 6. Scroll Indicator ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
      >
        <span
          className="text-[9px] tracking-[0.2em] uppercase mb-2"
          style={{ color: "rgba(201,182,211,0.32)" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-4 h-7 border rounded-full flex justify-center pt-1.5"
          style={{ borderColor: "rgba(201,182,211,0.18)" }}
        >
          <div
            className="w-0.5 h-1.5 rounded-full"
            style={{
              background: "linear-gradient(to bottom, #9C4DCC, rgba(156,77,204,0))",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
    <FeaturesSection />
    </>
  );
}
