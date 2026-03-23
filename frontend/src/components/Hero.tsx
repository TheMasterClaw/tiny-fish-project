import React from 'react';
import { ArrowDown, Waves, Heart, Sparkles, Globe } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-cyan-300">Tiny Fish Hackathon 2026</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight">
          <span className="block text-white">Protecting Our</span>
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-teal-300 bg-clip-text text-transparent">
            Blue Planet
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
          CoralGuard combines <span className="text-cyan-400 font-medium">AI-powered monitoring</span> with 
          <span className="text-coral-400 font-medium"> blockchain transparency</span> to protect 
          and restore coral reef ecosystems worldwide.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => scrollToSection('dashboard')}
            className="coral-button inline-flex items-center gap-2 text-lg px-8 py-4 rounded-xl font-semibold"
          >
            <Waves className="w-5 h-5" />
            Explore Reefs
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="glass-button inline-flex items-center gap-2 text-lg px-8 py-4 rounded-xl font-semibold"
          >
            <Heart className="w-5 h-5" />
            Learn More
          </button>
        </div>

        {/* Hero Image/Visual */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <div className="relative rounded-3xl overflow-hidden glass-card p-2">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-ocean-800 via-ocean-700 to-teal-800 flex items-center justify-center relative overflow-hidden">
              {/* Animated Coral Visualization */}
              <div className="absolute inset-0">
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Coral Silhouettes */}
                <svg className="absolute bottom-0 left-0 w-full h-full opacity-30" viewBox="0 0 800 400" preserveAspectRatio="none">
                  <path d="M0,400 L0,300 Q50,250 100,320 Q150,200 200,350 Q250,280 300,340 Q350,220 400,360 Q450,290 500,330 Q550,240 600,350 Q650,280 700,340 Q750,260 800,320 L800,400 Z" fill="url(#coralGradient)" />
                  <defs>
                    <linearGradient id="coralGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ff9e9e" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* Center Content */}
              <div className="relative z-10 text-center">
                <Globe className="w-24 h-24 text-cyan-400 mx-auto mb-4 animate-pulse" />
                <p className="text-white/80 text-lg">Real-time Global Reef Monitoring</p>
              </div>

              {/* Live Indicator */}
              <div className="absolute top-4 left-4 glass-card px-4 py-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs text-white/60 uppercase tracking-wider">Blockchain Connected</p>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 glass-card px-4 py-3 rounded-xl">
                <p className="text-xs text-white/60 uppercase tracking-wider">Base Sepolia</p>
                <p className="text-sm font-medium text-cyan-400">Testnet Live</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <span className="text-sm text-white/50">Powered by:</span>
          {['Base', 'Ethereum', 'AI/ML', 'IPFS', 'Solidity'].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-full bg-white/10 text-sm font-medium hover:bg-white/20 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => scrollToSection('impact')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <span className="text-sm">Scroll to explore</span>
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
