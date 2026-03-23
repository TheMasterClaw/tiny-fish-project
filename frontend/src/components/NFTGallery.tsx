import React, { useState } from 'react';
import { 
  Image, 
  Grid, 
  List, 
  Search,
  Heart,
  Share2,
  ExternalLink,
  Award,
  Crown,
  Gem,
  Star,
  CheckCircle,
  Wallet
} from 'lucide-react';

interface NFTItem {
  id: string;
  name: string;
  tier: 'supporter' | 'guardian' | 'champion' | 'savior';
  price: number;
  currency: string;
  image: string;
  owner: string;
  minted: number;
  total: number;
  description: string;
  benefits: string[];
  likes: number;
  reefId: string;
}

interface TierInfo {
  name: string;
  color: string;
  gradient: string;
  icon: React.ElementType;
  price: number;
  benefits: string[];
}

const TIERS: Record<string, TierInfo> = {
  supporter: {
    name: 'Coral Supporter',
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
    icon: Star,
    price: 0.01,
    benefits: ['Digital badge', 'Newsletter access', 'Discord community']
  },
  guardian: {
    name: 'Reef Guardian',
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
    icon: Award,
    price: 0.05,
    benefits: ['Rare artwork', 'Voting rights', 'Early access to drops']
  },
  champion: {
    name: 'Ocean Champion',
    color: 'text-pink-400',
    gradient: 'from-pink-500 to-rose-500',
    icon: Gem,
    price: 0.25,
    benefits: ['Exclusive art', 'Governance token', 'Quarterly reports']
  },
  savior: {
    name: 'Marine Savior',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-amber-500',
    icon: Crown,
    price: 1.0,
    benefits: ['Legendary artwork', 'Board seat', 'VIP events access']
  }
};

const SAMPLE_NFTS: NFTItem[] = [
  {
    id: '1',
    name: 'Azure Staghorn',
    tier: 'supporter',
    price: 0.01,
    currency: 'ETH',
    image: 'reef1',
    owner: '0x7a2f...9b4c',
    minted: 450,
    total: 10000,
    description: 'A beautiful representation of healthy staghorn coral',
    benefits: ['Digital badge', 'Newsletter access'],
    likes: 234,
    reefId: 'great-barrier'
  },
  {
    id: '2',
    name: 'Golden Brain Coral',
    tier: 'guardian',
    price: 0.05,
    currency: 'ETH',
    image: 'reef2',
    owner: '0x3e8d...2f1a',
    minted: 89,
    total: 2000,
    description: 'Rare brain coral from the Caribbean reefs',
    benefits: ['Rare artwork', 'Voting rights'],
    likes: 567,
    reefId: 'caribbean'
  },
  {
    id: '3',
    name: 'Crimson Fan Coral',
    tier: 'champion',
    price: 0.25,
    currency: 'ETH',
    image: 'reef3',
    owner: '0x9c4b...7e2d',
    minted: 23,
    total: 500,
    description: 'Exclusive fan coral from Red Sea depths',
    benefits: ['Exclusive art', 'Governance token'],
    likes: 892,
    reefId: 'red-sea'
  },
  {
    id: '4',
    name: 'Legendary Reef Guardian',
    tier: 'savior',
    price: 1.0,
    currency: 'ETH',
    image: 'reef4',
    owner: '0x1f5a...8c3e',
    minted: 5,
    total: 100,
    description: 'The ultimate marine conservation supporter',
    benefits: ['Legendary artwork', 'Board seat'],
    likes: 1234,
    reefId: 'global'
  },
  {
    id: '5',
    name: 'Purple Sea Fan',
    tier: 'guardian',
    price: 0.05,
    currency: 'ETH',
    image: 'reef5',
    owner: '0x8f2a...4e9b',
    minted: 156,
    total: 2000,
    description: 'Elegant sea fan swaying in ocean currents',
    benefits: ['Rare artwork', 'Discord VIP'],
    likes: 445,
    reefId: 'maldives'
  },
  {
    id: '6',
    name: 'Elkhorn Sanctuary',
    tier: 'champion',
    price: 0.25,
    currency: 'ETH',
    image: 'reef6',
    owner: '0x2b7c...9d3e',
    minted: 67,
    total: 500,
    description: 'Protected elkhorn coral sanctuary',
    benefits: ['Exclusive art', 'Quarterly reports'],
    likes: 678,
    reefId: 'florida'
  }
];

export default function NFTGallery() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTier, setSelectedTier] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [likedNFTs, setLikedNFTs] = useState<Set<string>>(new Set());
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  const filteredNFTs = SAMPLE_NFTS.filter(nft => {
    const matchesTier = selectedTier === 'all' || nft.tier === selectedTier;
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleLike = (id: string) => {
    setLikedNFTs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleMint = async () => {
    setIsMinting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsMinting(false);
    setMintSuccess(true);
    setTimeout(() => {
      setMintSuccess(false);
      setSelectedNFT(null);
    }, 2000);
  };

  const getTierBadge = (tier: string) => {
    const info = TIERS[tier];
    const Icon = info.icon;
    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r ${info.gradient} text-white text-xs font-medium`}>
        <Icon className="w-3 h-3" />
        {info.name}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30">
      {/* Header */}
      <div className="p-6 border-b border-purple-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
              <Image className="w-6 h-6 text-white" />
            </div>            
            <div>
              <h2 className="text-2xl font-bold text-white">Conservation NFT Gallery</h2>              
              <p className="text-purple-300 text-sm">Collect unique marine art, support ocean conservation</p>            </div>          </div>          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-purple-300'}`}
              >
                <Grid className="w-4 h-4" />              </button>              
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-purple-300'}`}
              >
                <List className="w-4 h-4" />              </button>            </div>            
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium">
              <Wallet className="w-4 h-4" />              
              Connect Wallet            </button>          </div>        </div>
        
        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />            
            <input
              type="text"
              placeholder="Search NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500"
            />          </div>          
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedTier('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedTier === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-800/50 text-purple-300 border border-purple-500/30'
              }`}
            >
              All Tiers            </button>            
            {Object.entries(TIERS).map(([key, tier]) => (
              <button
                key={key}
                onClick={() => setSelectedTier(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedTier === key 
                    ? `bg-gradient-to-r ${tier.gradient} text-white` 
                    : 'bg-slate-800/50 text-purple-300 border border-purple-500/30'
                }`}
              >
                {tier.name} ({tier.price} ETH)              </button>            ))}
          </div>        </div>      </div>

      {/* Stats Bar */}
      <div className="px-6 py-4 bg-black/20 border-b border-purple-500/20">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-white">2,847</div>            
            <div className="text-purple-300/60 text-xs">NFTs Minted</div>          </div>          
          <div className="text-center">
            <div className="text-xl font-bold text-white">456</div>            
            <div className="text-purple-300/60 text-xs">Collectors</div>          </div>          
          <div className="text-center">
            <div className="text-xl font-bold text-white">89.5 ETH</div>            
            <div className="text-purple-300/60 text-xs">Total Volume</div>          </div>          
          <div className="text-center">
            <div className="text-xl font-bold text-white">12.4K</div>            
            <div className="text-purple-300/60 text-xs">Total Likes</div>          </div>        </div>      </div>

      {/* Gallery Grid */}
      <div className="p-6">
        {filteredNFTs.length === 0 ? (
          <div className="text-center py-16">
            <Image className="w-16 h-16 text-purple-500/30 mx-auto mb-4" />            
            <p className="text-purple-300">No NFTs found matching your criteria</p>          </div>        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNFTs.map(nft => (
              <div
                key={nft.id}
                onClick={() => setSelectedNFT(nft)}
                className="group bg-slate-800/30 rounded-xl overflow-hidden border border-purple-500/10 hover:border-purple-500/30 cursor-pointer transition-all hover:transform hover:scale-[1.02]"
              >
                <div className="aspect-square bg-gradient-to-br from-cyan-900/50 to-purple-900/50 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full flex items-center justify-center">
                      <Image className="w-10 h-10 text-white/50" />                    </div>                  </div>                  
                  <div className="absolute top-3 left-3">
                    {getTierBadge(nft.tier)}                  </div>                  
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLike(nft.id); }}
                      className="p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${likedNFTs.has(nft.id) ? 'fill-pink-500 text-pink-500' : 'text-white'}`} />                    </button>                  </div>                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{nft.price} {nft.currency}</span>                      
                      <span className="text-purple-300 text-xs">{nft.minted}/{nft.total}</span>                    </div>                  </div>                </div>                
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1">{nft.name}</h3>                  
                  <p className="text-purple-300/60 text-sm mb-3 line-clamp-2">{nft.description}</p>                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-300">Owner: {nft.owner}</span>                    
                    <span className="flex items-center gap-1 text-pink-400">
                      <Heart className="w-3 h-3" />                      
                      {nft.likes + (likedNFTs.has(nft.id) ? 1 : 0)}                    </span>                  </div>                </div>              </div>            ))}
          </div>        ) : (
          <div className="space-y-4">
            {filteredNFTs.map(nft => (
              <div
                key={nft.id}
                onClick={() => setSelectedNFT(nft)}
                className="flex gap-4 p-4 bg-slate-800/30 rounded-xl border border-purple-500/10 hover:border-purple-500/30 cursor-pointer transition-all"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-900/50 to-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image className="w-8 h-8 text-white/50" />                </div>                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-semibold">{nft.name}</h3>                      
                      <p className="text-purple-300/60 text-sm">{nft.description}</p>                    </div>                    
                    {getTierBadge(nft.tier)}                  </div>                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-white font-medium">{nft.price} {nft.currency}</span>                    
                    <span className="text-purple-300">{nft.minted}/{nft.total} minted</span>                    
                    <span className="text-purple-300">Owner: {nft.owner}</span>                    
                    <span className="flex items-center gap-1 text-pink-400">
                      <Heart className="w-3 h-3" />                      
                      {nft.likes}                    </span>                  </div>                </div>              </div>            ))}
          </div>        )}
      </div>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
            <div className="grid md:grid-cols-2">
              <div className="aspect-square bg-gradient-to-br from-cyan-900/50 to-purple-900/50 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full flex items-center justify-center">
                    <Image className="w-16 h-16 text-white/50" />                  </div>                </div>                
                <div className="absolute top-4 left-4">
                  {getTierBadge(selectedNFT.tier)}                </div>                
                <button
                  onClick={() => setSelectedNFT(null)}
                  className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white hover:bg-black/60"
                >
                  ✕                </button>              </div>              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedNFT.name}</h2>                
                <p className="text-purple-300 mb-6">{selectedNFT.description}</p>                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-slate-800/30 rounded-lg">
                    <div className="text-purple-300 text-xs mb-1">Current Price</div>                    
                    <div className="text-xl font-bold text-white">{selectedNFT.price} {selectedNFT.currency}</div>                  </div>                  
                  <div className="p-3 bg-slate-800/30 rounded-lg">
                    <div className="text-purple-300 text-xs mb-1">Minted</div>                    
                    <div className="text-xl font-bold text-white">{selectedNFT.minted}/{selectedNFT.total}</div>                  </div>                </div>                
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3">Benefits</h4>                  
                  <ul className="space-y-2">
                    {selectedNFT.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-purple-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />                        {benefit}                      </li>                    ))}
                  </ul>                </div>                
                <div className="flex gap-3">
                  <button
                    onClick={handleMint}
                    disabled={isMinting || mintSuccess}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold disabled:opacity-50 transition-all"
                  >
                    {isMinting ? 'Minting...' : mintSuccess ? 'Minted!' : `Mint for ${selectedNFT.price} ETH`}
                  </button>                  
                  <button className="p-3 bg-slate-800/50 rounded-lg text-purple-300 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />                  </button>                  
                  <button className="p-3 bg-slate-800/50 rounded-lg text-purple-300 hover:text-white transition-colors">
                    <ExternalLink className="w-5 h-5" />                  </button>                </div>              </div>            </div>          </div>        </div>      )}
    </div>  );
}
