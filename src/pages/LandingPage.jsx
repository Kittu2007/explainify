import ParticlesBackground from "../components/ParticlesBackground";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";

export default function LandingPage() {
  return (
    <div className="relative bg-gray-950 text-white overflow-x-hidden">
      {/* Fixed particle canvas sits behind everything */}
      <ParticlesBackground />

      {/* Content layers above particles */}
      <div className="relative z-10">
        <HeroSection />
        <FeatureSection />
      </div>
    </div>
  );
}
