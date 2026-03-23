import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { Heart, Crown, Star, Gem, Loader2, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { ConservationNFTABI } from '../contracts/abis';
import { CONTRACTS, CHAIN_NAMES } from '../contracts/addresses';

interface NFTMintingProps {
  connectedAddress?: string;
  chainId?: number;
}

const NFTMinting: React.FC<NFTMintingProps> = ({ connectedAddress, chainId }) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tierStats, setTierStats] = useState<Record<number, { price: bigint; maxSupply: bigint; minted: bigint; remaining: bigint }>>({});
  const [loadingStats, setLoadingStats] = useState(false);
  const [totalDonations, setTotalDonations] = useState<bigint>(BigInt(0));

  const tiers = useMemo(() => [
    {
      tier: 0,
      name: 'Coral Supporter',
      price: '0.01',
      description: 'Join the movement with our entry-level supporter badge',
      benefits: ['Digital supporter badge', 'Newsletter access', 'Community Discord'],
      icon: Heart,
      color: 'from-coral-400 to-coral-500',
    },
    {
      tier: 1,
      name: 'Reef Guardian',
      price: '0.05',
      description: 'Show your commitment with rare coral artwork',
      benefits: ['Limited edition artwork', 'Quarterly impact reports', 'Guardian Discord channel', 'Voting on small projects'],
      icon: Star,
      color: 'from-reef-400 to-reef-500',
    },
    {
      tier: 2,
      name: 'Ocean Champion',
      price: '0.25',
      description: 'Exclusive marine life art with real impact',
      benefits: ['Exclusive artwork', 'Monthly dive footage', 'Direct scientist access', 'Project naming rights'],
      icon: Crown,
      color: 'from-ocean-400 to-ocean-500',
    },
    {
      tier: 3,
      name: 'Marine Savior',
      price: '1.0',
      description: 'Legendary status with maximum impact and governance',
      benefits: ['Legendary animated NFT', 'Full governance rights', 'Annual retreat invitation', 'Direct reef adoption', 'Lifetime impact updates'],
      icon: Gem,
      color: 'from-purple-400 to-pink-500',
    },
  ], []);

  const loadTierStats = useCallback(async () => {
    if (!chainId) return;
    
    const contractAddress = CONTRACTS[chainId as keyof typeof CONTRACTS]?.ConservationNFT;
    if (!contractAddress) return;

    try {
      setLoadingStats(true);
      const provider = new ethers.JsonRpcProvider(
        chainId === 84532 ? 'https://sepolia.base.org' : 'http://127.0.0.1:8545'
      );
      const contract = new ethers.Contract(contractAddress, ConservationNFTABI, provider);

      const stats: Record<number, { price: bigint; maxSupply: bigint; minted: bigint; remaining: bigint }> = {};
      
      for (let i = 0; i < 4; i++) {
        try {
          const tierStat = await contract.getTierStats(i);
          stats[i] = {
            price: tierStat.price,
            maxSupply: tierStat.maxSupply,
            minted: tierStat.minted,
            remaining: tierStat.remaining,
          };
        } catch (e) {
          // Use default values if call fails
          stats[i] = {
            price: ethers.parseEther(tiers[i].price),
            maxSupply: BigInt([10000, 2000, 500, 100][i]),
            minted: BigInt(0),
            remaining: BigInt([10000, 2000, 500, 100][i]),
          };
        }
      }

      setTierStats(stats);

      try {
        const donations = await contract.getTotalDonations();
        setTotalDonations(donations);
      } catch (e) {
        setTotalDonations(BigInt(0));
      }
    } catch (err) {
      console.error('Failed to load tier stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, [chainId, tiers]);

  useEffect(() => {
    loadTierStats();
  }, [loadTierStats]);

  const handleMint = async (tier: number, reefId: string = 'general') => {
    if (!connectedAddress || !chainId) {
      setError('Please connect your wallet first');
      return;
    }

    const contractAddress = CONTRACTS[chainId as keyof typeof CONTRACTS]?.ConservationNFT;
    
    if (!contractAddress) {
      setError(`ConservationNFT contract not deployed on ${CHAIN_NAMES[chainId]}. Please switch to a supported network.`);
      return;
    }

    if (!window.ethereum) {
      setError('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsMinting(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ConservationNFTABI, signer);

      const price = ethers.parseEther(tiers[tier].price);
      const tx = await contract.mintConservationNFT(tier, reefId, { value: price });
      const receipt = await tx.wait();

      setMintSuccess(receipt?.hash || 'success');
      loadTierStats(); // Refresh stats after mint
    } catch (err: any) {
      console.error('Mint failed:', err);
      setError(err.reason || err.message || 'Minting failed. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  const formatPercent = (minted: bigint, supply: bigint) => {
    if (supply === BigInt(0)) return 0;
    return Math.round((Number(minted) / Number(supply)) * 100);
  };

  const formatEther = (wei: bigint) => {
    return ethers.formatEther(wei);
  };

  const NotConnectedState = () => (
    <div className="ocean-card text-center py-16">
      <Heart className="w-16 h-16 mx-auto mb-4 text-white/30" />
      <h3 className="text-2xl font-bold mb-2">Connect Your Wallet</h3>
      <p className="text-white/60 mb-6">
        Please connect your wallet to view NFT tiers and mint conservation tokens.
      </p>
    </div>
  );

  const WrongNetworkState = () => (
    <div className="ocean-card text-center py-16">
      <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
      <h3 className="text-2xl font-bold mb-2">Unsupported Network</h3>
      <p className="text-white/60 mb-4">
        Please switch to Base Sepolia (84532) or Hardhat Local (31337) to mint NFTs.
      </p>
      <p className="text-sm text-white/40">
        Current: {chainId ? `Chain ID ${chainId}` : 'Not connected'}
      </p>
    </div>
  );

  const isWrongNetwork = chainId && !CONTRACTS[chainId as keyof typeof CONTRACTS];

  return (
    <section id="nft" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral-500/20 border border-coral-500/30 mb-6">
            <Heart className="w-4 h-4 text-coral-400" />
            <span className="text-sm font-medium text-coral-300">100% of proceeds fund conservation</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Support <span className="text-coral-gradient">Ocean Conservation</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Mint a conservation NFT and directly fund reef restoration projects. Every purchase creates real impact on the ground.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-16 max-w-3xl mx-auto">
          {[
            { label: 'Total Raised', value: `${formatEther(totalDonations)} ETH`, subtext: loadingStats ? 'Loading...' : 'On-chain verified' },
            { label: 'Reefs Funded', value: 'Coming Soon', subtext: 'Project tracking in development' },
            { label: 'NFT Holders', value: loadingStats ? '...' : Object.values(tierStats).reduce((acc, s) => acc + Number(s.minted), 0).toString(), subtext: 'Global supporters' },
          ].map((stat, index) => (
            <div key={index} className="text-center ocean-card">
              <p className="text-2xl md:text-3xl font-bold text-coral-400">{stat.value}</p>
              <p className="text-sm font-medium text-white/80">{stat.label}</p>
              <p className="text-xs text-white/50">{stat.subtext}</p>
            </div>
          ))}
        </div>

        {/* Success Message */}
        {mintSuccess && (
          <div className="mb-8 p-6 rounded-2xl bg-reef-500/20 border border-reef-500/30 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-reef-400" />
            <h3 className="text-xl font-semibold mb-2">NFT Minted Successfully!</h3>
            <p className="text-white/70 mb-4">Thank you for supporting marine conservation!</p>
            {mintSuccess.startsWith('0x') ? (
              <a
                href={`https://sepolia.basescan.org/tx/${mintSuccess}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
              >
                View Transaction <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <p className="text-sm text-white/50">Transaction confirmed</p>
            )}
            <button
              onClick={() => setMintSuccess(null)}
              className="mt-4 text-sm text-white/60 hover:text-white block mx-auto"
            >
              Mint another
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-center">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-white/60 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Wallet/Network States */}
        {!connectedAddress && <NotConnectedState />}
        {connectedAddress && isWrongNetwork && <WrongNetworkState />}

        {/* NFT Tiers - only show if connected to right network */}
        {connectedAddress && !isWrongNetwork && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              const isSelected = selectedTier === tier.tier;
              const stats = tierStats[tier.tier];
              const percentMinted = stats ? formatPercent(stats.minted, stats.maxSupply) : 0;
              
              return (
                <div
                  key={tier.tier}
                  onClick={() => !isMinting && setSelectedTier(tier.tier)}
                  className={`nft-card p-6 cursor-pointer ${isSelected ? 'ring-2 ring-coral-400' : ''}`}
                >
                  {/* Header */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-center mb-2">{tier.name}</h3>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-coral-400">{tier.price}</span>
                    <span className="text-white/60"> ETH</span>
                  </div>
                  
                  <p className="text-sm text-white/70 text-center mb-4">{tier.description}</p>
                  
                  {/* Benefits */}
                  <ul className="space-y-2 mb-6">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-reef-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Supply Info */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Minted: {stats ? `${stats.minted}/${stats.maxSupply}` : 'Loading...'}</span>
                      <span>{percentMinted}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${tier.color}`}
                        style={{ width: `${percentMinted}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Mint Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMint(tier.tier);
                    }}
                    disabled={isMinting}
                    className="w-full coral-button flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isMinting && selectedTier === tier.tier ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      <>Mint {tier.name}</>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Impact Note */}
        <div className="mt-12 text-center">
          <p className="text-white/60">
            All funds are transparently tracked on-chain and go directly to verified conservation partners.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NFTMinting;
