import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { 
  Upload, Trash2, Award, Users, Wallet, Shield, 
  Loader2, CheckCircle, Leaf, Target, TrendingUp, AlertCircle 
} from 'lucide-react';
import { GuardianRewardsABI } from '../contracts/abis';
import { CONTRACTS } from '../contracts/addresses';

interface ConservationActionsProps {
  connectedAddress?: string;
  chainId?: number;
}

interface ActionType {
  id: number;
  name: string;
  description: string;
  points: number;
  reward: string;
  icon: React.ElementType;
  color: string;
  cooldown: string;
}

const ConservationActions: React.FC<ConservationActionsProps> = ({ connectedAddress, chainId }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCompleting, setIsCompleting] = useState<number | null>(null);
  const [isStaking, setIsStaking] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('0.1');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);

  const actions: ActionType[] = [
    {
      id: 0,
      name: 'Submit Data',
      description: 'Upload verified reef health data, photos, or observations',
      points: 10,
      reward: '0.001 ETH',
      icon: Upload,
      color: 'from-blue-400 to-cyan-400',
      cooldown: '1 hour',
    },
    {
      id: 1,
      name: 'Join Cleanup',
      description: 'Participate in organized beach or ocean cleanup events',
      points: 50,
      reward: '0.005 ETH',
      icon: Trash2,
      color: 'from-green-400 to-emerald-400',
      cooldown: '1 day',
    },
    {
      id: 2,
      name: 'Complete Project',
      description: 'Finish a conservation project or educational course',
      points: 100,
      reward: '0.01 ETH',
      icon: Award,
      color: 'from-purple-400 to-pink-400',
      cooldown: '7 days',
    },
    {
      id: 3,
      name: 'Invite Friend',
      description: 'Refer new guardians to the CoralGuard network',
      points: 25,
      reward: '0.002 ETH',
      icon: Users,
      color: 'from-orange-400 to-red-400',
      cooldown: 'No cooldown',
    },
    {
      id: 5,
      name: 'AI Verification',
      description: 'Verify AI-generated reef health assessments',
      points: 20,
      reward: '0.002 ETH',
      icon: Shield,
      color: 'from-indigo-400 to-violet-400',
      cooldown: 'No cooldown',
    },
    {
      id: 6,
      name: 'Emergency Response',
      description: 'Rapid response to reef emergencies or bleaching events',
      points: 200,
      reward: '0.02 ETH',
      icon: Target,
      color: 'from-red-400 to-rose-500',
      cooldown: 'On demand',
    },
  ];

  const checkRegistration = useCallback(async () => {
    if (!connectedAddress || !chainId) {
      setIsRegistered(false);
      return;
    }

    const contractAddress = CONTRACTS[chainId as keyof typeof CONTRACTS]?.GuardianRewards;
    if (!contractAddress) {
      setIsRegistered(false);
      return;
    }

    try {
      setCheckingRegistration(true);
      const provider = new ethers.JsonRpcProvider(
        chainId === 84532 ? 'https://sepolia.base.org' : 'http://127.0.0.1:8545'
      );
      const contract = new ethers.Contract(contractAddress, GuardianRewardsABI, provider);
      
      const guardianData = await contract.guardians(connectedAddress);
      setIsRegistered(guardianData.isActive);
    } catch (err) {
      setIsRegistered(false);
    } finally {
      setCheckingRegistration(false);
    }
  }, [connectedAddress, chainId]);

  useEffect(() => {
    checkRegistration();
  }, [checkRegistration]);

  const handleRegister = async () => {
    if (!connectedAddress) {
      setError('Please connect your wallet first');
      return;
    }

    if (!chainId || !CONTRACTS[chainId as keyof typeof CONTRACTS]) {
      setError(`GuardianRewards not deployed on this network. Please switch to a supported network.`);
      return;
    }

    if (!window.ethereum) {
      setError('Please install MetaMask or another Web3 wallet');
      return;
    }

    const contractAddress = CONTRACTS[chainId as keyof typeof CONTRACTS]?.GuardianRewards;
    if (!contractAddress) {
      setError('Contract address not found');
      return;
    }

    setIsRegistering(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, GuardianRewardsABI, signer);

      const tx = await contract.registerGuardian(ethers.ZeroAddress);
      await tx.wait();

      setSuccess('registered');
      setIsRegistered(true);
    } catch (err: any) {
      setError(err.reason || err.message || 'Registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCompleteAction = async (actionId: number) => {
    if (!connectedAddress) {
      setError('Please connect your wallet first');
      return;
    }

    if (!chainId || !CONTRACTS[chainId as keyof typeof CONTRACTS]) {
      setError(`Please switch to a supported network`);
      return;
    }

    if (!window.ethereum) {
      setError('Please install MetaMask');
      return;
    }

    if (!isRegistered) {
      setError('Please register as a Guardian first');
      return;
    }

    const contractAddress = CONTRACTS[chainId as keyof typeof CONTRACTS]?.GuardianRewards;
    if (!contractAddress) {
      setError('Contract not found');
      return;
    }

    setIsCompleting(actionId);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, GuardianRewardsABI, signer);

      const tx = await contract.completeAction(actionId);
      await tx.wait();

      setSuccess(`action-${actionId}`);
    } catch (err: any) {
      setError(err.reason || err.message || 'Action completion failed');
    } finally {
      setIsCompleting(null);
    }
  };

  const handleStake = async () => {
    if (!connectedAddress) {
      setError('Please connect your wallet first');
      return;
    }

    if (!chainId || !CONTRACTS[chainId as keyof typeof CONTRACTS]) {
      setError(`Please switch to a supported network`);
      return;
    }

    if (!window.ethereum) {
      setError('Please install MetaMask');
      return;
    }

    if (!isRegistered) {
      setError('Please register as a Guardian first');
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount < 0.1) {
      setError('Minimum stake is 0.1 ETH');
      return;
    }

    const contractAddress = CONTRACTS[chainId as keyof typeof CONTRACTS]?.GuardianRewards;
    if (!contractAddress) {
      setError('Contract not found');
      return;
    }

    setIsStaking(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, GuardianRewardsABI, signer);

      const tx = await contract.stakeForReef({ value: ethers.parseEther(stakeAmount) });
      await tx.wait();

      setSuccess('staked');
    } catch (err: any) {
      setError(err.reason || err.message || 'Staking failed');
    } finally {
      setIsStaking(false);
    }
  };

  const NotConnectedState = () => (
    <div className="ocean-card text-center py-12">
      <Shield className="w-16 h-16 mx-auto mb-4 text-ocean-400" />
      <h3 className="text-2xl font-bold mb-2">Become a CoralGuard Guardian</h3>
      <p className="text-white/70 mb-6">Connect your wallet to start earning rewards for conservation</p>
    </div>
  );

  const WrongNetworkState = () => (
    <div className="ocean-card text-center py-12">
      <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
      <h3 className="text-2xl font-bold mb-2">Wrong Network</h3>
      <p className="text-white/70 mb-4">
        Please switch to Base Sepolia (84532) or Hardhat Local (31337)
      </p>
    </div>
  );

  const isWrongNetwork = chainId && !CONTRACTS[chainId as keyof typeof CONTRACTS];

  return (
    <section id="actions" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-reef-500/20 border border-reef-500/30 mb-6">
            <Leaf className="w-4 h-4 text-reef-400" />
            <span className="text-sm font-medium text-reef-300">Earn rewards while saving reefs</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Take <span className="text-reef-gradient">Conservation Action</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Complete real-world conservation actions and earn rewards. Every action helps protect our oceans and earns you Guardian points.
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-8 p-4 rounded-xl bg-reef-500/20 border border-reef-500/30 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-reef-400" />
            <p className="text-reef-200">
              {success === 'registered' ? 'Welcome, Guardian! You are now registered.' :
               success === 'staked' ? `Successfully staked ${stakeAmount} ETH for reef protection!` :
               'Action completed successfully!'}
            </p>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-white/60 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3">
            <span className="text-red-300">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-white/60 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {/* Wallet/Network States */}
        {!connectedAddress && <NotConnectedState />}
        {connectedAddress && isWrongNetwork && <WrongNetworkState />}

        {connectedAddress && !isWrongNetwork && (
          <>
            {/* Registration CTA */}
            {!isRegistered && !checkingRegistration && (
              <div className="ocean-card mb-12 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-reef-400 to-ocean-400 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">New to CoralGuard?</h3>
                    <p className="text-sm text-white/60">Register as a Guardian to start earning rewards</p>
                  </div>
                </div>
                <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="reef-button"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Registering...
                    </>
                  ) : (
                    'Register as Guardian'
                  )}
                </button>
              </div>
            )}

            {/* Action Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {actions.map((action) => {
                const Icon = action.icon;
                const isCompletingThis = isCompleting === action.id;
                
                return (
                  <div
                    key={action.id}
                    className="ocean-card group hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{action.name}</h3>
                        <p className="text-sm text-white/70 mb-3">{action.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm mb-4">
                          <span className="flex items-center gap-1 text-reef-400">
                            <TrendingUp className="w-4 h-4" />
                            +{action.points} pts
                          </span>
                          <span className="text-coral-400">{action.reward}</span>
                        </div>
                        
                        <p className="text-xs text-white/50 mb-4">Cooldown: {action.cooldown}</p>
                        
                        <button
                          onClick={() => handleCompleteAction(action.id)}
                          disabled={isCompletingThis || !isRegistered}
                          className="w-full glass-button text-sm disabled:opacity-50"
                        >
                          {isCompletingThis ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                              Processing...
                            </>
                          ) : !isRegistered ? (
                            'Register First'
                          ) : (
                            'Complete Action'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Staking Section */}
            <div className="mt-12 ocean-card">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ocean-400 to-blue-500 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Stake for Reef Protection</h3>
                  <p className="text-white/60">Lock ETH to directly fund emergency reef protection efforts</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <label className="block text-sm text-white/60 mb-2">Stake Amount (min 0.1 ETH)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      min="0.1"
                      step="0.1"
                      disabled={!isRegistered}
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-ocean-400 disabled:opacity-50"
                    />
                    <span className="px-4 py-2 bg-white/10 rounded-xl text-white/60">ETH</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">30-day lock period • 0.1% daily reward</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-white/60">Your stake directly funds:</p>
                    <ul className="text-sm text-white/80 mt-1 space-y-1">
                      <li>• Emergency bleaching response</li>
                      <li>• Coral nursery programs</li>
                      <li>• Local ranger salaries</li>
                    </ul>
                  </div>
                  
                  <button
                    onClick={handleStake}
                    disabled={isStaking || !isRegistered || parseFloat(stakeAmount) < 0.1}
                    className="reef-button"
                  >
                    {isStaking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                        Staking...
                      </>
                    ) : (
                      'Stake ETH'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ConservationActions;
