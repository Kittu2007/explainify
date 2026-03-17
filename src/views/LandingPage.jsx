"use client";
import ParticlesBackground from "../components/ParticlesBackground";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import WorkflowSection from "../components/WorkflowSection";
import DemoSection from "../components/DemoSection";
import CircularText from "../components/ui/CircularText";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-x-hidden">
      {/* Animated Particles Background */}
      <ParticlesBackground />
      
      {/* Floating Circular Text Badge */}
      <div className="fixed bottom-10 right-10 z-50 hidden md:block">
        <CircularText 
          text="EXPLAINIFY * AI DOCUMENT LEARNING * " 
          radius={60} 
          className="hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Floating Lines for subtle accent */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Optionally add FloatingLinesBackground for extra depth */}
        {/* <FloatingLinesBackground /> */}
      </div>
      {/* Content layers above backgrounds */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <DemoSection />
      </div>
    </div>
  );
}
