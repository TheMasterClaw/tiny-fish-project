import React, { useState } from 'react';
import { 
  FileCode, 
  Play, 
  CheckCircle, 
  Shield,
  Database,
  Coins,
  Code,
  Terminal,
  Copy,
  ExternalLink,
  Zap,
  Activity
} from 'lucide-react';

interface ContractDemo {
  id: string;
  name: string;
  description: string;
  function: string;
  params: { name: string; type: string; value: string }[];
  code: string;
  gas: string;
}

const CONTRACT_DEMOS: ContractDemo[] = [
  {
    id: 'reef-monitor',
    name: 'ReefMonitor Contract',
    description: 'Submit reef health data to the blockchain',
    function: 'submitReefData',
    params: [
      { name: 'reefId', type: 'string', value: 'GBR-2024-001' },
      { name: 'healthScore', type: 'uint256', value: '78' },
      { name: 'temperature', type: 'uint256', value: '2650' },
      { name: 'phLevel', type: 'uint256', value: '810' },
    ],
    code: `function submitReefData(
  string memory _reefId,
  uint256 _healthScore,
  uint256 _temperature,
  uint256 _phLevel
) external onlyAuthorized {
  require(_healthScore <= 100, "Invalid score");
  
  ReefData memory data = ReefData({
    reefId: _reefId,
    healthScore: _healthScore,
    temperature: _temperature,
    phLevel: _phLevel,
    timestamp: block.timestamp,
    reporter: msg.sender
  });
  
  reefData[_reefId] = data;
  emit ReefDataUpdated(_reefId, _healthScore);
}`,
    gas: '~85,000'
  },
  {
    id: 'nft-mint',
    name: 'ConservationNFT Contract',
    description: 'Mint a conservation NFT',
    function: 'mintConservationNFT',
    params: [
      { name: 'tier', type: 'Tier', value: 'OCEAN_CHAMPION' },
      { name: 'reefId', type: 'string', value: 'caribbean-reef' },
    ],
    code: `function mintConservationNFT(
  Tier _tier,
  string memory _reefId
) external payable returns (uint256) {
  require(msg.value >= tierPrices[_tier], 
    "Insufficient payment");
  require(tierMinted[_tier] < tierMaxSupply[_tier], 
    "Sold out");
  
  uint256 tokenId = _tokenIdCounter++;
  
  nftMetadata[tokenId] = NFTMetadata({
    tier: _tier,
    reefId: _reefId,
    mintTimestamp: block.timestamp,
    donationAmount: msg.value
  });
  
  _safeMint(msg.sender, tokenId);
  emit NFTMinted(msg.sender, tokenId, _tier);
  
  return tokenId;
}`,
    gas: '~125,000'
  },
  {
    id: 'guardian-rewards',
    name: 'GuardianRewards Contract',
    description: 'Claim rewards for conservation actions',
    function: 'claimRewards',
    params: [
      { name: 'actionType', type: 'ActionType', value: 'REEF_REPORT' },
    ],
    code: `function claimRewards(
  ActionType _actionType
) external nonReentrant {
  require(!hasClaimed[msg.sender][_actionType], 
    "Already claimed");
  
  uint256 reward = actionRewards[_actionType];
  require(reward > 0, "Invalid action");
  
  hasClaimed[msg.sender][_actionType] = true;
  guardianXP[msg.sender] += xpRewards[_actionType];
  
  (bool success, ) = payable(msg.sender)
    .call{value: reward}("");
  require(success, "Transfer failed");
  
  emit RewardClaimed(msg.sender, _actionType, reward);
}`,
    gas: '~65,000'
  }
];

export default function SmartContractDemo() {
  const [selectedDemo, setSelectedDemo] = useState<ContractDemo>(CONTRACT_DEMOS[0]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<'demo' | 'code' | 'info'>('demo');

  const executeDemo = async () => {
    setIsExecuting(true);
    setExecutionStep(0);
    setShowResult(false);

    const steps = [
      { step: 1, message: 'Connecting to Base Sepolia...', delay: 600 },
      { step: 2, message: 'Validating transaction...', delay: 800 },
      { step: 3, message: 'Estimating gas...', delay: 500 },
      { step: 4, message: 'Sending transaction...', delay: 1200 },
      { step: 5, message: 'Waiting for confirmation...', delay: 1500 },
      { step: 6, message: 'Transaction confirmed!', delay: 500 },
    ];

    for (const s of steps) {
      await new Promise(resolve => setTimeout(resolve, s.delay));
      setExecutionStep(s.step);
    }

    setIsExecuting(false);
    setShowResult(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30">
      {/* Header */}
      <div className="p-6 border-b border-indigo-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
              <FileCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Smart Contract Demo</h2>
              <p className="text-indigo-300 text-sm">Interact with CoralGuard contracts on Base Sepolia</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'demo' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-800/50 text-indigo-300 border border-indigo-500/30'
              }`}
            >
              Demo
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'code' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-800/50 text-indigo-300 border border-indigo-500/30'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'info' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-800/50 text-indigo-300 border border-indigo-500/30'
              }`}
            >
              Contract Info
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-0">
        {/* Left Panel - Contract Selection */}
        <div className="lg:col-span-1 p-6 border-r border-indigo-500/20">
          <h3 className="text-white font-semibold mb-4">Select Contract</h3>
          
          <div className="space-y-3">
            {CONTRACT_DEMOS.map(demo => (
              <button
                key={demo.id}
                onClick={() => {
                  setSelectedDemo(demo);
                  setShowResult(false);
                  setExecutionStep(0);
                }}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  selectedDemo.id === demo.id
                    ? 'bg-indigo-600/20 border-indigo-500'
                    : 'bg-slate-800/30 border-indigo-500/10 hover:border-indigo-500/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Code className="w-5 h-5 text-indigo-400" />
                  <span className="text-white font-medium">{demo.name}</span>
                </div>
                <p className="text-indigo-300/60 text-sm">{demo.description}</p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-indigo-400">⛽ {demo.gas}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-indigo-900/20 rounded-xl border border-indigo-500/20">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              Contract Security
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-indigo-300/80">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Audited by OpenZeppelin
              </li>
              <li className="flex items-center gap-2 text-indigo-300/80">
                <CheckCircle className="w-4 h-4 text-green-400" />
                ReentrancyGuard protection
              </li>
              <li className="flex items-center gap-2 text-indigo-300/80">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Ownable access control
              </li>
              <li className="flex items-center gap-2 text-indigo-300/80">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Pausable emergency stop
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 p-6">
          {activeTab === 'demo' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedDemo.function}</h3>
                  <p className="text-indigo-300/60">{selectedDemo.description}</p>
                </div>
                <button
                  onClick={executeDemo}
                  disabled={isExecuting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-semibold disabled:opacity-50 transition-all"
                >
                  {isExecuting ? (
                    <>
                      <Activity className="w-5 h-5 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Execute
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-4 border border-indigo-500/20">
                <h4 className="text-white font-medium mb-4">Parameters</h4>
                <div className="grid gap-3">
                  {selectedDemo.params.map((param, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-indigo-300 text-sm">{param.name} <span className="text-indigo-400">({param.type})</span></label>
                        <input
                          type="text"
                          defaultValue={param.value}
                          className="w-full mt-1 px-3 py-2 bg-slate-900/50 border border-indigo-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-4 border border-indigo-500/20">
                <h4 className="text-white font-medium mb-4">Transaction Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-indigo-300/60">Contract Address</span>
                    <span className="text-indigo-300 font-mono">0x7a2f...9b4c</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-300/60">Network</span>
                    <span className="text-green-400">Base Sepolia</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-300/60">Gas Estimate</span>
                    <span className="text-indigo-300">{selectedDemo.gas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-300/60">Gas Price</span>
                    <span className="text-indigo-300">0.1 gwei</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span className="text-indigo-300 text-sm">Transaction Log</span>
                </div>
                <div className="p-4 font-mono text-sm h-48 overflow-y-auto">
                  <div className="text-indigo-400">&gt; CoralGuard Smart Contract Demo v1.0.0</div>
                  <div className="text-indigo-400">&gt; Connected to Base Sepolia Testnet</div>
                  <div className="text-indigo-400">&gt; Wallet: 0x8f2a...4e9b</div>
                  <div className="text-slate-500">---</div>
                  {isExecuting && (
                    <>
                      <div className="text-yellow-400 animate-pulse">&gt; {executionStep >= 1 ? '✓' : '○'} Connecting to Base Sepolia...</div>
                      {executionStep >= 2 && <div className="text-green-400">&gt; ✓ Validating transaction...</div>}
                      {executionStep >= 3 && <div className="text-green-400">&gt; ✓ Estimating gas...</div>}
                      {executionStep >= 4 && <div className="text-yellow-400 animate-pulse">&gt; {executionStep >= 5 ? '✓' : '○'} Sending transaction...</div>}
                      {executionStep >= 5 && <div className="text-green-400">&gt; ✓ Waiting for confirmation...</div>}
                      {executionStep >= 6 && <div className="text-green-400 font-bold">&gt; ✓ Transaction confirmed!</div>}
                    </>
                  )}
                  {showResult && (
                    <>
                      <div className="text-slate-500">---</div>
                      <div className="text-green-400">&gt; Transaction Hash: 0x8f4e...2a9c</div>
                      <div className="text-green-400">&gt; Block Number: #12345678</div>
                      <div className="text-green-400">&gt; Gas Used: 82,451</div>
                      <div className="text-green-400">&gt; Status: Success ✅</div>
                      <div className="text-indigo-400 mt-2">&gt; View on Explorer: <a href="#" className="underline">BaseScan</a></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Contract Source Code</h3>
                <button 
                  onClick={() => copyToClipboard(selectedDemo.code)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg text-indigo-300 text-sm hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              
              <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-indigo-300">{selectedDemo.code}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/30 rounded-xl border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-white font-medium">Contract Address</h4>
                  </div>
                  <p className="text-indigo-300 font-mono text-sm">0x7a2f9c8d3e1b4a5f6c7d8e9f0a1b2c3d4e5f6a7b</p>
                  <button className="mt-2 text-indigo-400 text-sm flex items-center gap-1 hover:text-white">
                    <ExternalLink className="w-3 h-3" />
                    View on BaseScan
                  </button>
                </div>
                
                <div className="p-4 bg-slate-800/30 rounded-xl border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <h4 className="text-white font-medium">Verification</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Verified on BaseScan</span>
                  </div>
                  <p className="text-indigo-300/60 text-sm mt-2">Contract source code verified</p>
                </div>
                
                <div className="p-4 bg-slate-800/30 rounded-xl border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <h4 className="text-white font-medium">Total Value Locked</h4>
                  </div>
                  <p className="text-2xl font-bold text-white">245.8 ETH</p>
                  <p className="text-indigo-300/60 text-sm">~$860,300 USD</p>
                </div>
                
                <div className="p-4 bg-slate-800/30 rounded-xl border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    <h4 className="text-white font-medium">Total Transactions</h4>
                  </div>
                  <p className="text-2xl font-bold text-white">12,456</p>
                  <p className="text-indigo-300/60 text-sm">Last 30 days</p>
                </div>
              </div>
              
              <div className="p-4 bg-indigo-900/20 rounded-xl border border-indigo-500/20">
                <h4 className="text-white font-medium mb-3">Network Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-indigo-300/60">Network: </span>
                    <span className="text-indigo-300">Base Sepolia Testnet</span>
                  </div>
                  <div>
                    <span className="text-indigo-300/60">Chain ID: </span>
                    <span className="text-indigo-300">84532</span>
                  </div>
                  <div>
                    <span className="text-indigo-300/60">RPC URL: </span>
                    <span className="text-indigo-300">https://sepolia.base.org</span>
                  </div>
                  <div>
                    <span className="text-indigo-300/60">Currency: </span>
                    <span className="text-indigo-300">ETH</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
