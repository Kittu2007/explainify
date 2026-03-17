import { FileText, MessageSquare, Play, Zap } from "lucide-react";
import FeatureBlock from "./FeatureBlock";

/* ─── Feature Data ──────────────────────────────────────────────── */
const features = [
  {
    icon: FileText,
    title: "Smart Document Upload",
    description:
      "Upload any document and let AI understand its content instantly.",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Interface",
    description:
      "Ask questions about your document and get intelligent responses.",
  },
  {
    icon: Play,
    title: "Video Learning",
    description:
      "Generate and watch personalized video explanations.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description:
      "Get instant results with our optimized AI pipeline.",
  },
];

/* ─── Aurora Background ─────────────────────────────────────────── */
function AuroraBackground() {
  return (
    <>
      <style>{`
        @keyframes aurora-drift-1 {
          0%   { transform: translate(0%, 0%) scale(1); }
          33%  { transform: translate(8%, -12%) scale(1.12); }
          66%  { transform: translate(-6%, 10%) scale(0.92); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes aurora-drift-2 {
          0%   { transform: translate(0%, 0%) scale(1.05); }
          40%  { transform: translate(-10%, 8%) scale(0.95); }
          70%  { transform: translate(7%, -8%) scale(1.1); }
          100% { transform: translate(0%, 0%) scale(1.05); }
        }
        @keyframes aurora-drift-3 {
          0%   { transform: translate(0%, 0%) scale(0.9); }
          50%  { transform: translate(5%, 14%) scale(1.08); }
          100% { transform: translate(0%, 0%) scale(0.9); }
        }
        .aurora-orb-1 {
          animation: aurora-drift-1 22s ease-in-out infinite;
        }
        .aurora-orb-2 {
          animation: aurora-drift-2 28s ease-in-out infinite;
        }
        .aurora-orb-3 {
          animation: aurora-drift-3 18s ease-in-out infinite;
        }
      `}</style>

      {/* Base layer */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, #0D0010, #1a0024, #0D0010)" }}
      />

      {/* Aurora orb 1 — top-left purple */}
      <div
        className="aurora-orb-1 absolute pointer-events-none"
        style={{
          top: "5%",
          left: "-10%",
          width: "70%",
          height: "60%",
          background:
            "radial-gradient(ellipse, rgba(123,31,162,0.22) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Aurora orb 2 — center-right magenta */}
      <div
        className="aurora-orb-2 absolute pointer-events-none"
        style={{
          top: "30%",
          right: "-15%",
          width: "65%",
          height: "70%",
          background:
            "radial-gradient(ellipse, rgba(156,77,204,0.18) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Aurora orb 3 — bottom dark violet */}
      <div
        className="aurora-orb-3 absolute pointer-events-none"
        style={{
          bottom: "0%",
          left: "20%",
          width: "60%",
          height: "55%",
          background:
            "radial-gradient(ellipse, rgba(59,0,70,0.35) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Subtle noise grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          opacity: 0.5,
        }}
      />
    </>
  );
}

/* ─── FeaturesSection ───────────────────────────────────────────── */
export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative w-full overflow-hidden text-white"
    >
      {/* Aurora background */}
      <AuroraBackground />

      {/* Section header */}
      <div className="relative z-10 pt-16 pb-4 text-center px-6">
        <p
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase border mb-6"
          style={{
            background: "rgba(123,31,162,0.16)",
            borderColor: "rgba(201,182,211,0.22)",
            color: "#C9B6D3",
            backdropFilter: "blur(10px)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#9C4DCC] animate-pulse" />
          What Explainify Can Do
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{ color: "rgba(201,182,211,0.7)" }}
        >
          Explore the Features
        </h2>
      </div>

      {/* Feature blocks */}
      <div className="relative z-10">
        {features.map((feature, index) => (
          <FeatureBlock
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

      {/* Bottom fade into next section */}
      <div
        className="relative z-10 h-20 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #0D0010)",
        }}
      />
    </section>
  );
}
