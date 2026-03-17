"use client";
import ParticlesBackground from "../components/ParticlesBackground";
import Hero from "../components/Hero";
import FeaturesSection from "../components/FeaturesSection";
import WorkflowSection from "../components/WorkflowSection";
import DemoSection from "../components/DemoSection";
import YouAskWeAnswer from "../components/YouAskWeAnswer";
import CircularText from "../components/ui/CircularText";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-x-hidden">
      {/* Animated Particles Background (Static Background Layer) */}
      <ParticlesBackground />
      
      {/* Floating Circular Text Badge */}
      <div className="fixed bottom-10 right-10 z-50 hidden md:block">
        <CircularText 
          text="EXPLAINIFY * AI DOCUMENT LEARNING * " 
          radius={60} 
          className="hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content layers */}
      <div className="relative z-10">
        <Hero />
        <FeaturesSection />
        <WorkflowSection />
        <YouAskWeAnswer />
        <DemoSection />
      </div>
    </div>
  );
}
