// Contract addresses - update after deployment
export const CONTRACTS = {
  // Base Sepolia Testnet
  84532: {
    ReefMonitor: '0x742d35Cc6634C0532925a3b844Bc9e7595f3dEe0',
    ConservationNFT: '0x8A9c4C6C8B5a3D9E1F2E3A4B5C6D7E8F9A0B1C2D',
    GuardianRewards: '0x9B2d45D7f8A1B0C9D8E7F6A5B4C3D2E1F0A9B8C7',
  },
  // Hardhat Local
  31337: {
    ReefMonitor: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    ConservationNFT: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    GuardianRewards: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  }
};

export const SUPPORTED_CHAINS = [84532, 31337];

export const CHAIN_NAMES: Record<number, string> = {
  84532: 'Base Sepolia',
  31337: 'Hardhat Local',
};

export const RPC_URLS: Record<number, string> = {
  84532: 'https://sepolia.base.org',
  31337: 'http://127.0.0.1:8545',
};

// Block explorers
export const EXPLORERS: Record<number, string> = {
  84532: 'https://sepolia.basescan.org',
  31337: '',
};
