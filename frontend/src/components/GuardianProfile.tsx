import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { 
  Trophy, Star, Target, Award, Users, Activity,
  Leaf, Shield, Crown, Sprout, Gem,
  Loader2
} from 'lucide-react';
import { GuardianRewardsABI, ConservationNFTABI } from '../contracts/abis';
import { CONTRACTS, RPC_URLS, CHAIN_NAMES } from '../contracts/addresses';

interface GuardianProfileProps {
  connectedAddress?: string;
  chainId?: number;
}

interface GuardianStats {
  totalPoints: number;
  actionsCompleted: number;
  stakedAmount: string;
  currentTier: number;
  referralCount: number;
  achievements: string[];
  isActive: boolean;
}

const GuardianProfile: React.FC<GuardianProfileProps> = ({ connectedAddress, chainId }) => {
  const [stats, setStats] = useState<GuardianStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadGuardianData = useCallback(async () => {
    if (!connectedAddress || !chainId) {
      setLoading(false);
      setStats(null);
      return;
    }

    const contractAddress = CONTRACTS[chainId as keyof typeof CONTRACTS]?.GuardianRewards;
    if (!contractAddress) {
      setLoading(false);
      setStats(null);
      setError(`GuardianRewards not deployed on ${CHAIN_NAMES[chainId]}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const rpcUrl = RPC_URLS[chainId] || 'https://sepolia.base.org';
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      
      const contract = new ethers.Contract(contractAddress, GuardianRewardsABI, provider);
      
      try {
        const guardianData = await contract.guardians(connectedAddress);
        const referralStats = await contract.referralCount(connectedAddress);
        
        // Get achievements from events (simplified - would need event filtering in production)
        const achievements: string[] = [];
        
        setStats({
          totalPoints: Number(guardianData.totalPoints),
          actionsCompleted: Number(guardianData.actionsCompleted),
          stakedAmount: ethers.formatEther(guardianData.stakedAmount),
          currentTier: Number(guardianData.currentTier),
          referralCount: Number(referralStats),
          achievements,
          isActive: guardianData.isActive,
        });
      } catch (contractErr) {
        // Guardian not registered
        setStats({
          totalPoints: 0,
          actionsCompleted: 0,
          stakedAmount: '0',
          currentTier: 0,
          referralCount: 0,
          achievements: [],
          isActive: false,
        });
      }

      // Load user's NFTs
      const nftContractAddress = CONTRACTS[chainId as keyof typeof CONTRACTS]?.ConservationNFT;
      if (nftContractAddress) {
        try {
          const nftContract = new ethers.Contract(nftContractAddress, ConservationNFTABI, provider);
          const balance = await nftContract.balanceOf(connectedAddress);
          
          const nfts = [];
          for (let i = 0; i < Number(balance); i++) {
            try {
              const tokenId = await nftContract.tokenOfOwnerByIndex(connectedAddress, i);
              const metadata = await nftContract.nftMetadata(tokenId);
              nfts.push({
                tokenId: Number(tokenId),
                tier: Number(metadata.tier),
                reefId: metadata.reefId,
                mintTimestamp: Number(metadata.mintTimestamp),
              });
            } catch (e) {
              // Skip if error fetching individual NFT
            }
          }
          setUserNFTs(nfts);
        } catch (e) {
          setUserNFTs([]);
        }
      }
    } catch (err: any) {
      console.error('Failed to load guardian data:', err);
      setError(err.message || 'Failed to load profile data');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [connectedAddress, chainId]);

  useEffect(() => {
    loadGuardianData();
  }, [loadGuardianData]);

  const getTierInfo = (tier: number) => {
    const tiers = [
      { name: 'Seedling', icon: Sprout, color: 'from-green-400 to-emerald-500', minPoints: 0 },
      { name: 'Coral Polyp', icon: Leaf, color: 'from-teal-400 to-cyan-500', minPoints: 100 },
      { name: 'Reef Keeper', icon: Shield, color: 'from-cyan-400 to-blue-500', minPoints: 500 },
      { name: 'Ocean Defender', icon: Crown, color: 'from-blue-400 to-indigo-500', minPoints: 1500 },
      { name: 'Guardian Legend', icon: Gem, color: 'from-purple-400 to-pink-500', minPoints: 5000 },
    ];
    return tiers[tier] || tiers[0];
  };

  const getTierProgress = (points: number) => {
    const thresholds = [0, 100, 500, 1500, 5000];
    const currentTierIdx = thresholds.findIndex(t => points < t) - 1;
    const nextThreshold = thresholds[currentTierIdx + 1] || 5000;
    const prevThreshold = thresholds[currentTierIdx] || 0;
    if (nextThreshold === prevThreshold) return 100;
    const progress = ((points - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getNFTTierName = (tier: number) => {
    const names = ['Coral Supporter', 'Reef Guardian', 'Ocean Champion', 'Marine Savior'];
    return names[tier] || 'Unknown';
  };

  const getNFTTierColor = (tier: number) => {
    const colors = ['from-coral-400 to-coral-500', 'from-reef-400 to-reef-500', 'from-ocean-400 to-ocean-500', 'from-purple-400 to-pink-500'];
    return colors[tier] || colors[0];
  };

  if (!connectedAddress) {
    return (
      <section id="profile" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <h2 className="text-3xl font-bold mb-4">Guardian Profile</h2>
          <p className="text-white/60">Connect your wallet to view your Guardian stats and achievements</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section id="profile" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading Guardian data...</p>
        </div>
      </section>
    );
  }

  // Not registered state
  if (stats && !stats.isActive) {
    return (
      <section id="profile" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="ocean-card p-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <h2 className="text-3xl font-bold mb-4">Guardian Profile</h2>
            <p className="text-white/60 mb-6">No guardian data found for this wallet</p>
            <button 
              onClick={() => window.location.href = '#actions'}
              className="coral-button inline-flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Start Your Journey
            </button>
            {error && (
              <p className="text-sm text-white/40 mt-4">{error}</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  const tier = stats ? getTierInfo(stats.currentTier) : null;
  const TierIcon = tier?.icon || Sprout;

  return (
    <section id="profile" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Guardian <span className="text-ocean-gradient">Profile</span>
          </h2>
          <p className="text-lg text-white/70">Your impact and achievements in ocean conservation</p>
          {chainId && (
            <p className="text-sm text-white/40 mt-2">
              Network: {CHAIN_NAMES[chainId] || `Chain ${chainId}`}
            </p>
          )}
        </div>

        {stats && tier && (
          <>
            {/* Tier Card */}
            <div className="ocean-card mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Tier Badge */}
                <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${tier.color} flex flex-col items-center justify-center shadow-2xl`}>
                  <TierIcon className="w-12 h-12 text-white mb-2" />
                  <span className="text-xs font-medium text-white/90">{tier.name}</span>
                </div>
                
                {/* Stats */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">{connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}</h3>
                  <p className="text-white/60 mb-4">
                    Current Tier: <span className={`font-semibold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>{tier.name}</span>
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Progress to next tier</span>
                      <span className="font-medium">{stats.totalPoints} points</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${tier.color}`}
                        style={{ width: `${getTierProgress(stats.totalPoints)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Trophy className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                    <p className="text-2xl font-bold">{stats.totalPoints}</p>
                    <p className="text-xs text-white/60">Total Points</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Activity className="w-6 h-6 mx-auto mb-1 text-reef-400" />
                    <p className="text-2xl font-bold">{stats.actionsCompleted}</p>
                    <p className="text-xs text-white/60">Actions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="ocean-card">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-coral-400" />
                  <h3 className="font-semibold">Impact Stats</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Projects Completed</span>
                    <span className="font-medium">{stats.actionsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Data Submissions</span>
                    <span className="font-medium">—</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Cleanups Joined</span>
                    <span className="font-medium">—</span>
                  </div>
                </div>
              </div>

              <div className="ocean-card">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-ocean-400" />
                  <h3 className="font-semibold">Community</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Referrals</span>
                    <span className="font-medium">{stats.referralCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Friends Joined</span>
                    <span className="font-medium">{stats.referralCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Network Rank</span>
                    <span className="font-medium">—</span>
                  </div>
                </div>
              </div>

              <div className="ocean-card">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <h3 className="font-semibold">Staking</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Amount Staked</span>
                    <span className="font-medium">{stats.stakedAmount} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Staking Rewards</span>
                    <span className="font-medium">—</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Days Staked</span>
                    <span className="font-medium">—</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="ocean-card mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-reef-400" />
                <h3 className="font-semibold text-lg">Achievements</h3>
              </div>
              
              {stats.achievements.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {stats.achievements.map((achievement, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-reef-500/20 to-ocean-500/20 
                                 border border-reef-400/30 text-reef-300 flex items-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      {achievement}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/50 mb-4">No achievements yet. Start completing actions to earn badges!</p>
                  <button 
                    onClick={() => window.location.href = '#actions'}
                    className="text-coral-400 hover:text-coral-300 text-sm"
                  >
                    View Available Actions →
                  </button>
                </div>
              )}
            </div>

            {/* NFT Collection */}
            {userNFTs.length > 0 && (
              <div className="ocean-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Gem className="w-6 h-6 text-purple-400" />
                    <h3 className="font-semibold text-lg">Conservation NFTs</h3>
                  </div>
                  <span className="text-sm text-white/60">{userNFTs.length} collected</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {userNFTs.map((nft, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-colors"
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getNFTTierColor(nft.tier)} mb-3`} />
                      <p className="font-medium text-sm">{getNFTTierName(nft.tier)}</p>
                      <p className="text-xs text-white/50">#{nft.tokenId} • {nft.reefId}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default GuardianProfile;
