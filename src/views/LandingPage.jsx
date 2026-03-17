"use client";
import ParticlesBackground from "../components/ParticlesBackground";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import WorkflowSection from "../components/WorkflowSection";
import DemoSection from "../components/DemoSection";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-x-hidden">
      {/* Animated Particles Background */}
      <ParticlesBackground />
      {/* Floating Lines for subtle accent */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Optionally add FloatingLinesBackground for extra depth */}
        {/* <FloatingLinesBackground /> */}
      </div>
      {/* Content layers above backgrounds */}
      <div className="relative z-10">
        <HeroSection />
        <FeatureSection />
        <WorkflowSection />
        <DemoSection />
      </div>
    </div>
  );
}
