import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Star, 
  Flame,
  Target,
  Zap,
  Globe,
  Fish,
  TreePine,
  Users,
  TrendingUp,
  Award,
  Crown,
  Shield,
  Heart,
  Share2,
  ChevronUp,
  CheckCircle
} from 'lucide-react';

interface Guardian {
  id: string;
  rank: number;
  address: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  totalDonated: number;
  coralsPlanted: number;
  reportsSubmitted: number;
  streak: number;
  badges: string[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  impact: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  expiresIn: string;
  category: 'daily' | 'weekly' | 'special';
}

const BADGES: Badge[] = [
  { id: '1', name: 'First Step', description: 'Made your first donation', icon: Heart, color: 'text-pink-400', rarity: 'common' },
  { id: '2', name: 'Coral Keeper', description: 'Planted 10 coral fragments', icon: TreePine, color: 'text-green-400', rarity: 'common' },
  { id: '3', name: 'Reef Reporter', description: 'Submitted 5 reef health reports', icon: Target, color: 'text-blue-400', rarity: 'rare' },
  { id: '4', name: 'Ocean Advocate', description: 'Referred 3 friends', icon: Users, color: 'text-purple-400', rarity: 'rare' },
  { id: '5', name: 'Marine Protector', description: 'Top 10 donor for 3 months', icon: Shield, color: 'text-yellow-400', rarity: 'epic' },
  { id: '6', name: 'Coral Legend', description: 'Planted 1000 coral fragments', icon: Crown, color: 'text-orange-400', rarity: 'legendary' },
];

const GUARDIANS: Guardian[] = [
  { id: '1', rank: 1, address: '0x8f2a...4e9b', name: 'OceanGuardian_X', avatar: '👑', level: 42, xp: 8750, totalDonated: 45.5, coralsPlanted: 1245, reportsSubmitted: 89, streak: 156, badges: ['1', '2', '3', '5', '6'], tier: 'diamond', impact: 9876 },
  { id: '2', rank: 2, address: '0x3c7d...1f8a', name: 'ReefDefender', avatar: '🐋', level: 38, xp: 7200, totalDonated: 32.8, coralsPlanted: 987, reportsSubmitted: 67, streak: 89, badges: ['1', '2', '3', '5'], tier: 'platinum', impact: 7654 },
  { id: '3', rank: 3, address: '0x9e4b...6c2d', name: 'CoralQueen', avatar: '🌊', level: 35, xp: 6500, totalDonated: 28.2, coralsPlanted: 876, reportsSubmitted: 54, streak: 67, badges: ['1', '2', '4', '5'], tier: 'platinum', impact: 6543 },
  { id: '4', rank: 4, address: '0x1f5a...8c3e', name: 'BlueGuard', avatar: '🐢', level: 31, xp: 5400, totalDonated: 21.5, coralsPlanted: 654, reportsSubmitted: 43, streak: 45, badges: ['1', '2', '3'], tier: 'gold', impact: 5432 },
  { id: '5', rank: 5, address: '0x7a2f...9b4c', name: 'SeaProtector', avatar: '🦈', level: 28, xp: 4800, totalDonated: 18.9, coralsPlanted: 543, reportsSubmitted: 38, streak: 34, badges: ['1', '2', '4'], tier: 'gold', impact: 4321 },
  { id: '6', rank: 6, address: '0x2b7c...9d3e', name: 'WaveKeeper', avatar: '🐠', level: 25, xp: 3900, totalDonated: 15.2, coralsPlanted: 432, reportsSubmitted: 29, streak: 23, badges: ['1', '2'], tier: 'silver', impact: 3456 },
  { id: '7', rank: 7, address: '0x4e9d...2a5f', name: 'TideGuard', avatar: '🦑', level: 22, xp: 3200, totalDonated: 12.8, coralsPlanted: 321, reportsSubmitted: 21, streak: 15, badges: ['1', '3'], tier: 'silver', impact: 2847 },
  { id: '8', rank: 8, address: '0x6a3b...7e1c', name: 'AquaFriend', avatar: '🦐', level: 18, xp: 2400, totalDonated: 8.5, coralsPlanted: 215, reportsSubmitted: 15, streak: 12, badges: ['1'], tier: 'bronze', impact: 2134 },
];

const CHALLENGES: Challenge[] = [
  { id: '1', title: 'Daily Reef Check', description: 'Submit one reef health report today', reward: 50, progress: 1, total: 1, expiresIn: '12h', category: 'daily' },
  { id: '2', title: 'Weekend Warrior', description: 'Make a donation this weekend', reward: 100, progress: 0, total: 1, expiresIn: '2d', category: 'weekly' },
  { id: '3', title: 'Species Spotter', description: 'Identify 5 different coral species', reward: 200, progress: 3, total: 5, expiresIn: '5d', category: 'weekly' },
  { id: '4', title: 'Guardian Growth', description: 'Reach Guardian Level 25', reward: 500, progress: 22, total: 25, expiresIn: '∞', category: 'special' },
];

const TIERS = {
  bronze: { color: 'from-amber-700 to-amber-600', label: 'Bronze' },
  silver: { color: 'from-slate-400 to-slate-300', label: 'Silver' },
  gold: { color: 'from-yellow-500 to-yellow-400', label: 'Gold' },
  platinum: { color: 'from-cyan-400 to-blue-400', label: 'Platinum' },
  diamond: { color: 'from-purple-500 to-pink-500', label: 'Diamond' },
};

export default function GuardianLeaderboard() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges' | 'badges'>('leaderboard');
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [filter, setFilter] = useState<'all' | 'weekly' | 'monthly'>('all');

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'diamond': return <Crown className="w-5 h-5" />;
      case 'platinum': return <Award className="w-5 h-5" />;
      case 'gold': return <Medal className="w-5 h-5" />;
      case 'silver': return <Star className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-orange-500 to-red-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-slate-500 to-slate-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30">
      {/* Header */}
      <div className="p-6 border-b border-amber-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />            </div>            
            <div>
              <h2 className="text-2xl font-bold text-white">Guardian Leaderboard</h2>              
              <p className="text-amber-300 text-sm">Compete, earn badges, save the ocean</p>            </div>          </div>          
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'leaderboard' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-slate-800/50 text-amber-300 border border-amber-500/30'
              }`}
            >
              Leaderboard            </button>            
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'challenges' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-slate-800/50 text-amber-300 border border-amber-500/30'
              }`}
            >
              Challenges            </button>            
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'badges' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-slate-800/50 text-amber-300 border border-amber-500/30'
              }`}
            >
              Badges            </button>          </div>        </div>      </div>

      <div className="grid lg:grid-cols-3 gap-0">
        {/* Main Content */}
        <div className="lg:col-span-2 p-6">
          {activeTab === 'leaderboard' && (
            <div className="space-y-6">
              <div className="flex gap-2">
                {(['all', 'weekly', 'monthly'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === f 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-slate-800/50 text-amber-300'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}                  </button>                ))}
              </div>              
              <div className="space-y-3">
                {GUARDIANS.map((guardian, idx) => {
                  const tier = TIERS[guardian.tier];
                  return (
                    <div
                      key={guardian.id}
                      onClick={() => setSelectedGuardian(guardian)}
                      className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-amber-500/10 hover:border-amber-500/30 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 font-bold text-lg">
                        {guardian.rank === 1 ? <span className="text-yellow-400">🥇</span> 
                          : guardian.rank === 2 ? <span className="text-slate-300">🥈</span> 
                          : guardian.rank === 3 ? <span className="text-amber-600">🥉</span> 
                          : <span className="text-amber-300/60">#{guardian.rank}</span>}
                      </div>                      
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500/30 to-yellow-500/30 rounded-full flex items-center justify-center text-2xl">
                        {guardian.avatar}                      </div>                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{guardian.name}</span>                          <div className={`px-2 py-0.5 bg-gradient-to-r ${tier.color} rounded text-xs text-white font-medium`}>
                            {tier.label}                          </div>                        </div>                        
                        <div className="flex items-center gap-4 text-sm text-amber-300/60">
                          <span>Level {guardian.level}</span>                          
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-400" />                            
                            {guardian.streak} day streak                          </span>                          
                          <span>{guardian.badges.length} badges</span>                        </div>                      </div>                      
                      <div className="text-right">
                        <div className="text-white font-bold">{guardian.totalDonated} ETH</div>                        
                        <div className="text-amber-300/60 text-xs">Impact Score: {guardian.impact.toLocaleString()}</div>                      </div>                    </div>                  );
                })}
              </div>            </div>          )}

          {activeTab === 'challenges' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30 text-center">
                  <div className="text-2xl font-bold text-white mb-1">1,250</div>                  
                  <div className="text-orange-300 text-xs">Total XP</div>                </div>                
                <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30 text-center">
                  <div className="text-2xl font-bold text-white mb-1">23</div>                  
                  <div className="text-cyan-300 text-xs">Level</div>                </div>                
                <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 text-center">
                  <div className="text-2xl font-bold text-white mb-1">12</div>                  
                  <div className="text-green-300 text-xs">Day Streak</div>                </div>              </div>              
              {CHALLENGES.map(challenge => (
                <div key={challenge.id} className="p-4 bg-slate-800/30 rounded-xl border border-amber-500/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-semibold">{challenge.title}</h4>                        
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          challenge.category === 'daily' 
                            ? 'bg-orange-500/20 text-orange-400' 
                            : challenge.category === 'weekly'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {challenge.category}                        </span>                      </div>                      
                      <p className="text-amber-300/60 text-sm">{challenge.description}</p>                    </div>                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-400 font-semibold">
                        <Zap className="w-4 h-4" />                        
                        +{challenge.reward} XP                      </div>                      <div className="text-amber-300/60 text-xs">Expires: {challenge.expiresIn}</div>                    </div>                  </div>                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
                        style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                      />                    </div>                    <span className="text-white text-sm font-medium">
                      {challenge.progress}/{challenge.total}                    </span>                  </div>                </div>              ))}
            </div>          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-2 gap-4">
              {BADGES.map(badge => {
                const Icon = badge.icon;
                return (
                  <div key={badge.id} className="p-4 bg-slate-800/30 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all">
                    <div className="flex items-start gap-3">
                      <div className={`p-3 bg-gradient-to-br ${getRarityColor(badge.rarity)} rounded-xl`}>
                        <Icon className="w-6 h-6 text-white" />                      </div>                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-semibold">{badge.name}</h4>                          <span className={`px-2 py-0.5 rounded text-xs capitalize ${
                            badge.rarity === 'legendary' ? 'bg-orange-500/20 text-orange-400' :
                            badge.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                            badge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {badge.rarity}                          </span>                        </div>                        
                        <p className="text-amber-300/60 text-sm">{badge.description}</p>                      </div>                    </div>                  </div>                );
              })}
            </div>          )}
        </div>

        {/* Sidebar */}
        <div className="p-6 bg-black/20 border-l border-amber-500/20">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />            
            Your Stats          </h3>          
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-amber-600/20 to-yellow-600/20 rounded-xl border border-amber-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-xl">
                  🌊                </div>                
                <div>
                  <div className="text-white font-semibold">You</div>                  
                  <div className="text-amber-300 text-sm">Level 23 Guardian</div>                </div>              </div>              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-300/60">XP Progress</span>                  
                  <span className="text-white">1,250/1,500</span>                </div>                
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" />                </div>              </div>            </div>            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/30 rounded-lg text-center">
                <div className="text-xl font-bold text-white">156</div>                <div className="text-amber-300/60 text-xs">Corals Planted</div>              </div>              
              <div className="p-3 bg-slate-800/30 rounded-lg text-center">
                <div className="text-xl font-bold text-white">12</div>                <div className="text-amber-300/60 text-xs">Reports</div>              </div>              
              <div className="p-3 bg-slate-800/30 rounded-lg text-center">
                <div className="text-xl font-bold text-white">5.2</div>                <div className="text-amber-300/60 text-xs">ETH Donated</div>              </div>              
              <div className="p-3 bg-slate-800/30 rounded-lg text-center">
                <div className="text-xl font-bold text-white">8</div>                
                <div className="text-amber-300/60 text-xs">Badges</div>              </div>            </div>          </div>          
          <div>
            <h4 className="text-white font-medium mb-3">Recent Achievements</h4>            
            <div className="space-y-2">
              {[
                { icon: TreePine, label: 'Planted 50 corals', time: '2h ago' },
                { icon: CheckCircle, label: 'Completed daily challenge', time: '5h ago' },
                { icon: Heart, label: 'Made donation', time: '1d ago' },
              ].map((achievement, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-slate-800/20 rounded-lg">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <achievement.icon className="w-4 h-4 text-amber-400" />                  </div>                  
                  <div className="flex-1">
                    <p className="text-white text-sm">{achievement.label}</p>                    
                    <p className="text-amber-300/60 text-xs">{achievement.time}</p>                  </div>                </div>              ))}
            </div>          </div>        </div>      </div>

      {/* Guardian Detail Modal */}
      {selectedGuardian && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/30">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500/30 to-yellow-500/30 rounded-full flex items-center justify-center text-4xl">
                    {selectedGuardian.avatar}                  </div>                  
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedGuardian.name}</h3>                    
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`px-3 py-1 bg-gradient-to-r ${TIERS[selectedGuardian.tier].color} rounded-full text-sm text-white font-medium`}>
                        {TIERS[selectedGuardian.tier].label}                      </div>                      
                      <span className="text-amber-300">Level {selectedGuardian.level}</span>                    </div>                    
                    <p className="text-amber-300/60 text-sm mt-1">{selectedGuardian.address}</p>                  </div>                </div>                
                <button 
                  onClick={() => setSelectedGuardian(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-amber-300"
                >
                  ✕                </button>              </div>              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-slate-800/30 rounded-xl">
                  <div className="text-2xl font-bold text-white">{selectedGuardian.totalDonated} ETH</div>                  
                  <div className="text-amber-300/60 text-sm">Total Donated</div>                </div>                
                <div className="text-center p-4 bg-slate-800/30 rounded-xl">
                  <div className="text-2xl font-bold text-white">{selectedGuardian.coralsPlanted}</div>                  
                  <div className="text-amber-300/60 text-sm">Corals Planted</div>                </div>                
                <div className="text-center p-4 bg-slate-800/30 rounded-xl">
                  <div className="text-2xl font-bold text-white">{selectedGuardian.impact.toLocaleString()}</div>                  
                  <div className="text-amber-300/60 text-sm">Impact Score</div>                </div>              </div>              
              <div>
                <h4 className="text-white font-medium mb-3">Badges ({selectedGuardian.badges.length})</h4>                
                <div className="flex flex-wrap gap-2">
                  {selectedGuardian.badges.map(badgeId => {
                    const badge = BADGES.find(b => b.id === badgeId);
                    if (!badge) return null;
                    const Icon = badge.icon;
                    return (
                      <div key={badgeId} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg">
                        <Icon className={`w-4 h-4 ${badge.color}`} />                        
                        <span className="text-white text-sm">{badge.name}</span>                      </div>                    );
                  })}
                </div>              </div>            </div>          </div>        </div>      )}
    </div>  );
}
