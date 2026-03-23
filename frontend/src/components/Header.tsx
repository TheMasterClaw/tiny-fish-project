import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, Waves, Menu, X, ExternalLink } from 'lucide-react';
import { useContract } from '../hooks/useContract';
import { CHAIN_NAMES, EXPLORERS } from '../contracts/addresses';

interface HeaderProps {
  onConnect: (address: string, chainId: number) => void;
  connectedAddress?: string;
  chainId?: number;
}

const Header: React.FC<HeaderProps> = ({ onConnect, connectedAddress, chainId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const { connectWallet, isConnecting, error } = useContract();

  useEffect(() => {
    if (connectedAddress && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      provider.getBalance(connectedAddress).then(bal => {
        setBalance(ethers.formatEther(bal).slice(0, 6));
      });
    }
  }, [connectedAddress]);

  const handleConnect = async () => {
    try {
      const result = await connectWallet();
      onConnect(result.address, result.chainId);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card m-4 rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Waves className="w-8 h-8 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 bg-cyan-400/30 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Coral
                <span className="text-coral-400">Guard</span>
              </h1>
              <p className="text-xs text-white/60 hidden sm:block">AI + Blockchain for Ocean Conservation</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'nft', label: 'Support' },
              { id: 'actions', label: 'Take Action' },
              { id: 'profile', label: 'Profile' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* Wallet Section */}
          <div className="flex items-center gap-4">
            {connectedAddress ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-white">{formatAddress(connectedAddress)}</span>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <span>{balance ? `${balance} ETH` : '...'}</span>
                    <span className="text-cyan-400">{chainId ? CHAIN_NAMES[chainId] : ''}</span>
                  </div>
                </div>
                <a
                  href={chainId ? `${EXPLORERS[chainId]}/address/${connectedAddress}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-white" />
                </a>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="coral-button flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-col gap-2">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'nft', label: 'Support' },
                { id: 'actions', label: 'Take Action' },
                { id: 'profile', label: 'Profile' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
            {error}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
