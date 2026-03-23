import React from 'react';
import { 
  Cpu, 
  Shield, 
  Coins, 
  Globe2, 
  Zap, 
  BarChart3,
  Users,
  Award,
  ArrowRight
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  color: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  color,
  delay 
}) => (
  <div 
    className="glass-card rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-white/60 mb-6 leading-relaxed">{description}</p>
    
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
          </div>
          <span className="text-sm text-white/70">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Features: React.FC = () => {
  const mainFeatures = [
    {
      icon: Cpu,
      title: 'AI-Powered Monitoring',
      description: 'Computer vision and sensor networks continuously analyze reef health indicators.',
      features: [
        'Real-time bleaching detection',
        'Species identification AI',
        'Water quality sensors',
        'Satellite imagery analysis'
      ],
      color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    },
    {
      icon: Shield,
      title: 'Blockchain Transparency',
      description: 'Every conservation action recorded on-chain for complete accountability.',
      features: [
        'Immutable impact records',
        'Donation tracking',
        'Smart contract automation',
        'Decentralized governance'
      ],
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    },
    {
      icon: Coins,
      title: 'NFT Conservation Fund',
      description: 'Support reefs with collectible digital art that funds real restoration.',
      features: [
        'Limited edition reef NFTs',
        'Direct funding to projects',
        'Guardian rewards program',
        'Exclusive community access'
      ],
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
    },
    {
      icon: Globe2,
      title: 'Global Network',
      description: 'Connect with conservation efforts across 40+ countries and territories.',
      features: [
        'Local conservation partners',
        'Community-driven projects',
        'Cross-border collaboration',
        'Indigenous stewardship'
      ],
      color: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    },
    {
      icon: Zap,
      title: 'Instant Impact',
      description: 'See the direct results of your contributions with real-time updates.',
      features: [
        'Live project dashboards',
        'Before/after comparisons',
        'Species recovery tracking',
        'Community leaderboards'
      ],
      color: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    },
    {
      icon: BarChart3,
      title: 'Data for Science',
      description: 'Open reef data advancing marine biology and climate research worldwide.',
      features: [
        'Open API access',
        'Research partnerships',
        'Climate modeling data',
        'Academic collaboration'
      ],
      color: 'bg-gradient-to-br from-reef-500 to-emerald-600',
    },
  ];

  const benefits = [
    { icon: Users, text: 'Join 12,500+ Ocean Guardians' },
    { icon: Award, text: 'UN Sustainable Development Goals Partner' },
    { icon: Shield, text: 'Audited Smart Contracts' },
    { icon: Globe2, text: '40+ Countries Supported' },
  ];

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">Platform Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built for <span className="text-cyan-400">Real Impact</span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Cutting-edge technology meets conservation expertise. Every feature designed 
            to maximize your contribution to ocean health.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {mainFeatures.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={index * 100}
            />
          ))}
        </div>

        {/* How It Works */}
        <div className="glass-card rounded-3xl p-8 md:p-12 mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Connect',
                description: 'Link your wallet to join the CoralGuard network',
                icon: '🔗'
              },
              {
                step: '02',
                title: 'Explore',
                description: 'Browse reef projects and real-time health data',
                icon: '🌊'
              },
              {
                step: '03',
                title: 'Support',
                description: 'Mint NFTs or donate directly to conservation',
                icon: '💚'
              },
              {
                step: '04',
                title: 'Track',
                description: 'Watch your impact grow with on-chain proof',
                icon: '📈'
              },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center">
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full">
                    <ArrowRight className="w-6 h-6 text-white/20" />
                  </div>
                )}
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-ocean-700 to-ocean-800 flex items-center justify-center border border-white/10">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <span className="text-sm text-cyan-400 font-mono mb-2 block">{item.step}</span>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-white/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Bar */}
        <div className="flex flex-wrap justify-center items-center gap-8 py-8 border-t border-white/10">
          {benefits.map((benefit) => (
            <div key={benefit.text} className="flex items-center gap-3 text-white/60">
              <benefit.icon className="w-5 h-5 text-cyan-400" />
              <span className="text-sm">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
