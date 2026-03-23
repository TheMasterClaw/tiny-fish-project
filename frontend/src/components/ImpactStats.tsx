import React, { useEffect, useRef, useState } from 'react';
import { Fish, Globe, Heart, TrendingUp, Users, Leaf } from 'lucide-react';

interface StatItemProps {
  icon: React.ElementType;
  value: string;
  label: string;
  suffix?: string;
  color: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, value, label, suffix = '', color, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`glass-card p-6 rounded-2xl text-center transition-all duration-700 hover:scale-105 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mx-auto mb-4`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div className="text-4xl md:text-5xl font-bold mb-2">
        <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {value}
        </span>
        {suffix && <span className="text-cyan-400">{suffix}</span>}
      </div>
      <p className="text-white/60 text-sm">{label}</p>
    </div>
  );
};

const ImpactStats: React.FC = () => {
  // These will be dynamic once we have real data sources
  // For now, showing "Coming Soon" to indicate these are planned features
  const stats = [
    {
      icon: Globe,
      value: '—',
      label: 'Reefs Monitored',
      color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    },
    {
      icon: Fish,
      value: '—',
      label: 'AI Sensors Active',
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    },
    {
      icon: Users,
      value: '—',
      label: 'Guardians Worldwide',
      suffix: '',
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    },
    {
      icon: Heart,
      value: '—',
      label: 'Raised for Conservation',
      suffix: '',
      color: 'bg-gradient-to-br from-coral-500 to-pink-600',
    },
    {
      icon: Leaf,
      value: '—',
      label: 'Restoration Projects',
      color: 'bg-gradient-to-br from-reef-500 to-emerald-600',
    },
    {
      icon: TrendingUp,
      value: '—',
      label: 'Reefs Recovering',
      suffix: '',
      color: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    },
  ];

  return (
    <section id="impact" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">Our Impact</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Making a <span className="text-cyan-400">Real Difference</span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Every action on CoralGuard contributes to measurable conservation outcomes. 
            Real-time statistics will appear here once data flows from deployed sensors and AI agents.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              {...stat}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Impact Story */}
        <div className="mt-16 glass-card rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                Why Coral Reefs Matter
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Coral reefs support 25% of all marine life despite covering less than 1% of the ocean floor. 
                They protect coastlines from storms, provide food for billions, and generate 
                $375 billion annually in ecosystem services.
              </p>
              <p className="text-white/70 mb-6 leading-relaxed">
                But they're dying. Climate change has killed 50% of the world's reefs since 1950. 
                Without intervention, we could lose 90% by 2050.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-coral-500 to-orange-500 rounded-full" />
                </div>
                <span className="text-sm text-coral-400 font-medium">50% Lost</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-ocean-800 to-teal-900 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/30 flex items-center justify-center mb-6 animate-pulse">
                  <Heart className="w-16 h-16 text-coral-400" />
                </div>
                <blockquote className="text-xl italic text-white/80 mb-4">
                  "We won't save what we don't love, and we can't love what we don't know."
                </blockquote>
                <cite className="text-sm text-white/50">— Jacques Cousteau</cite>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
