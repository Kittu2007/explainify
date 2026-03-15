import Footer from "../components/Footer";
import ParticlesBackground from "../components/ParticlesBackground";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";

export default function LandingPage() {
  return (
    <div className="relative bg-gray-950 text-white overflow-hidden">
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
