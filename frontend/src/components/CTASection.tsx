import React from 'react';
import { ArrowRight, Waves, Heart, ExternalLink } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <>
      {/* Primary CTA - Join the Movement */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-coral-600 via-coral-500 to-orange-500" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
              <path d="M0,100 Q300,50 600,100 T1200,100 L1200,600 L0,600 Z" fill="rgba(255,255,255,0.1)" />
              <path d="M0,200 Q400,150 800,200 T1200,200 L1200,600 L0,600 Z" fill="rgba(255,255,255,0.05)" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-8">
            <Heart className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Join 12,500+ Ocean Guardians</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Make Waves?
          </h2>

          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Every contribution, no matter the size, helps protect coral reefs for future generations. 
            Join our decentralized network of ocean advocates today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#nft"
              className="inline-flex items-center gap-2 bg-white text-coral-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
            >
              <Waves className="w-5 h-5" />
              Support Conservation
              <ArrowRight className="w-5 h-5" />
            </a>
            
            <button
              className="inline-flex items-center gap-2 bg-white/20 text-white backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all border border-white/30"
            >
              Learn More
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/70 text-sm">
            <span>✓ No hidden fees</span>
            <span>✓ Transparent funding</span>
            <span>✓ Instant impact tracking</span>
            <span>✓ Tax deductible</span>
          </div>
        </div>
      </section>

      {/* Secondary CTA - Newsletter */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">
                  Stay in the Loop
                </h3>
                <p className="text-white/70 mb-6">
                  Get monthly updates on reef health, new conservation projects, 
                  and exclusive NFT drops. No spam, just ocean love.
                </p>
                
                <div className="flex items-center gap-4 text-sm text-white/50">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-reef-500" />
                    Monthly digest
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-reef-500" />
                    Unsubscribe anytime
                  </span>
                </div>
              </div>

              <div>
                <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="glass-input flex-1"
                  />
                  <button
                    type="submit"
                    className="coral-button whitespace-nowrap px-6 py-3"
                  >
                    Subscribe
                  </button>
                </form>
                
                <p className="text-xs text-white/40 mt-3">
                  Join 8,000+ subscribers. Read our{' '}
                  <button className="underline hover:text-white/60 transition-colors">Privacy Policy</button>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners/Sponsors CTA */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-white/50 uppercase tracking-wider mb-8">
            Backed by leading organizations
          </p>

          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {['Ethereum Foundation', 'Ocean Conservancy', 'Base', 'Chainlink', 'The Reef-World Foundation'].map((partner) => (
              <div 
                key={partner} 
                className="text-xl font-bold text-white/60 hover:text-white/80 transition-colors cursor-pointer"
              >
                {partner}
              </div>
            ))}
          </div>

          <div className="mt-12">
            <button
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Become a partner
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTASection;
