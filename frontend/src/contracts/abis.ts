export const ReefMonitorABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "provider",
        "type": "address"
      }
    ],
    "name": "ProviderAuthorized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "provider",
        "type": "address"
      }
    ],
    "name": "ProviderRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "reefId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "healthScore",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "reporter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum ReefMonitor.DataSource",
        "name": "source",
        "type": "uint8"
      }
    ],
    "name": "ReefDataUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "provider",
        "type": "address"
      }
    ],
    "name": "authorizeProvider",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "authorizedProviders",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "reefData",
    "outputs": [
      {
        "internalType": "string",
        "name": "reefId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "healthScore",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "temperature",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "phLevel",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "coralCoverage",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "imageHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "reporter",
        "type": "address"
      },
      {
        "internalType": "enum ReefMonitor.DataSource",
        "name": "source",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "reefIds",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "provider",
        "type": "address"
      }
    ],
    "name": "revokeProvider",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_reefId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_healthScore",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_temperature",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_phLevel",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_coralCoverage",
        "type": "uint256"
      },
      {
        "internalType": "string[]",
        "name": "_speciesDetected",
        "type": "string[]"
      },
      {
        "internalType": "string",
        "name": "_imageHash",
        "type": "string"
      },
      {
        "internalType": "enum ReefMonitor.DataSource",
        "name": "_source",
        "type": "uint8"
      }
    ],
    "name": "submitReefData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDataPoints",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalReefs",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllReefIds",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_reefId",
        "type": "string"
      }
    ],
    "name": "getLatestReefData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "reefId",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "healthScore",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "temperature",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "phLevel",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "coralCoverage",
            "type": "uint256"
          },
          {
            "internalType": "string[]",
            "name": "speciesDetected",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "imageHash",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "reporter",
            "type": "address"
          },
          {
            "internalType": "enum ReefMonitor.DataSource",
            "name": "source",
            "type": "uint8"
          }
        ],
        "internalType": "struct ReefMonitor.ReefData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const ConservationNFTABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_conservationFund",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721IncorrectOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721InsufficientApproval",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "minter",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum ConservationNFT.Tier",
        "name": "tier",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reefId",
        "type": "string"
      }
    ],
    "name": "NFTMinted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "enum ConservationNFT.Tier",
        "name": "_tier",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "_reefId",
        "type": "string"
      }
    ],
    "name": "mintConservationNFT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum ConservationNFT.Tier",
        "name": "_tier",
        "type": "uint8"
      }
    ],
    "name": "tierPrices",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalDonations",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "hasVotingRights",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const GuardianRewardsABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_rewardToken",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "_useNativeToken",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "guardian",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum GuardianRewards.ActionType",
        "name": "actionType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "points",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ActionCompleted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_referrer",
        "type": "address"
      }
    ],
    "name": "registerGuardian",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum GuardianRewards.ActionType",
        "name": "_actionType",
        "type": "uint8"
      }
    ],
    "name": "completeAction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stakeForReef",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_guardian",
        "type": "address"
      }
    ],
    "name": "getGuardianStats",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalPoints",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "actionsCompleted",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "stakedAmount",
        "type": "uint256"
      },
      {
        "internalType": "enum GuardianRewards.BadgeTier",
        "name": "currentTier",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "referralCount_",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_guardian",
        "type": "address"
      }
    ],
    "name": "guardians",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalPoints",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "actionsCompleted",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "stakedAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "stakingStartTime",
        "type": "uint256"
      },
      {
        "internalType": "enum GuardianRewards.BadgeTier",
        "name": "currentTier",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
