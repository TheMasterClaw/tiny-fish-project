import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ImpactStats from './components/ImpactStats';
import Features from './components/Features';
import CoralReefVisualization from './components/CoralReefVisualization';
import AICoralDetection from './components/AICoralDetection';
import DonationImpactDashboard from './components/DonationImpactDashboard';
import NFTGallery from './components/NFTGallery';
import GuardianLeaderboard from './components/GuardianLeaderboard';
import SmartContractDemo from './components/SmartContractDemo';
import RealTimeAnalytics from './components/RealTimeAnalytics';
import ReefHealthDashboard from './components/ReefHealthDashboard';
import NFTMinting from './components/NFTMinting';
import ConservationActions from './components/ConservationActions';
import GuardianProfile from './components/GuardianProfile';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import Bubbles from './components/Bubbles';
import { analytics } from './utils/analytics';

function App() {
  const [connectedAddress, setConnectedAddress] = useState<string | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);

  const handleConnect = (address: string, chain: number) => {
    setConnectedAddress(address);
    setChainId(chain);
    // Track wallet connection
    analytics.setUserId(address);
    analytics.trackWalletConnect('metamask');
  };

  // Track page views on mount
  useEffect(() => {
    analytics.trackPageView('landing');
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <Bubbles />
      
      {/* Content */}
      <div className="relative z-10">
        <Header
          onConnect={handleConnect}
          connectedAddress={connectedAddress}
          chainId={chainId}
        />
        
        <main>
          {/* Landing Page Sections */}
          <Hero />
          
          <ImpactStats />
          
          <Features />
          
          {/* 3D Coral Reef Visualization */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <CoralReefVisualization />
            </div>
          </section>

          {/* AI Coral Detection Demo */}
          <section className="py-16 px-4 bg-gradient-to-b from-transparent to-cyan-950/30">
            <div className="max-w-7xl mx-auto">
              <AICoralDetection />
            </div>
          </section>

          {/* Donation Impact Dashboard */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <DonationImpactDashboard />
            </div>
          </section>

          {/* NFT Gallery */}
          <section className="py-16 px-4 bg-gradient-to-b from-transparent to-purple-950/30">
            <div className="max-w-7xl mx-auto">
              <NFTGallery />
            </div>
          </section>

          {/* Guardian Leaderboard */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <GuardianLeaderboard />
            </div>
          </section>

          {/* Smart Contract Demo */}
          <section className="py-16 px-4 bg-gradient-to-b from-transparent to-indigo-950/30">
            <div className="max-w-7xl mx-auto">
              <SmartContractDemo />
            </div>
          </section>

          {/* Real-Time Analytics */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <RealTimeAnalytics />
            </div>
          </section>

          {/* Platform Sections */}
          
          <ReefHealthDashboard
            connectedAddress={connectedAddress}
            chainId={chainId}
          />
          
          <NFTMinting
            connectedAddress={connectedAddress}
            chainId={chainId}
          />
          
          <ConservationActions
            connectedAddress={connectedAddress}
            chainId={chainId}
          />
          
          <GuardianProfile
            connectedAddress={connectedAddress}
            chainId={chainId}
          />
          
          {/* CTA Sections */}
          
          <CTASection />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;
