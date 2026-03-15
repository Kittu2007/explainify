"use client";
import Link from "next/link";
import { FileText, MessageSquare, Play, Zap, Users, Shield } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: FileText,
      title: 'Smart Document Upload',
      description: 'Upload any document and let AI understand its content instantly.'
    },
    {
      icon: MessageSquare,
      title: 'AI Chat Interface',
      description: 'Ask questions about your documents and get intelligent responses.'
    },
    {
      icon: Play,
      title: 'Video Learning',
      description: 'Generate and watch personalized video explanations.'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Get instant results with our optimized AI pipeline.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Share insights and learning materials with your team.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your documents are encrypted and stored securely.'
    }
  ]
  
  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-dark via-gray-900 to-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              Transform Documents into
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Knowledge
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Upload any document, ask intelligent questions, and learn through AI-powered explanations and videos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/upload" className="btn-primary">
                Get Started
              </Link>
              <a href="#features" className="btn-outline">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-16">
            Powerful Features for Learning
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="card group">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Upload', desc: 'Select and upload your document' },
              { step: '2', title: 'Ask', desc: 'Ask questions about the content' },
              { step: '3', title: 'Learn', desc: 'Get AI-powered explanations' },
              { step: '4', title: 'Master', desc: 'Watch video summaries' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8 opacity-90">Start uploading documents and discovering insights in seconds.</p>
          <Link href="/upload" className="inline-block px-8 py-4 bg-white text-primary rounded-lg font-bold hover:scale-105 transition-transform">
            Start Now
          </Link>
        </div>
      </section>
    </div>
  )
}
