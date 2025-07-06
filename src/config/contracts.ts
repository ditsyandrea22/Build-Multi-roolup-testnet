// CrossL2Prover contract configuration
export const CROSSL2_PROVER_ADDRESS = '0x03Fb5bFA4EB2Cba072A477A372bB87880A60fC96'

// Real testnet contract addresses using CrossL2Prover
export const BRIDGE_CONTRACTS = {
  ETHEREUM_SEPOLIA: {
    address: import.meta.env.VITE_ETHEREUM_SEPOLIA_BRIDGE || CROSSL2_PROVER_ADDRESS,
    chainId: 11155111,
    name: 'Ethereum Sepolia',
    symbol: 'ETH',
    decimals: 18,
    explorer: 'https://sepolia.etherscan.io',
    rpcUrl: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY || 'demo'}`,
    faucet: 'https://sepoliafaucet.com/',
    color: 'bg-blue-500'
  },
  POLYGON_AMOY: {
    address: import.meta.env.VITE_POLYGON_AMOY_BRIDGE || CROSSL2_PROVER_ADDRESS,
    chainId: 80002,
    name: 'Polygon Amoy',
    symbol: 'MATIC',
    decimals: 18,
    explorer: 'https://amoy.polygonscan.com',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    faucet: 'https://faucet.polygon.technology/',
    color: 'bg-purple-500'
  },
  OPTIMISM_SEPOLIA: {
    address: import.meta.env.VITE_OPTIMISM_SEPOLIA_BRIDGE || CROSSL2_PROVER_ADDRESS,
    chainId: 11155420,
    name: 'Optimism Sepolia',
    symbol: 'ETH',
    decimals: 18,
    explorer: 'https://sepolia-optimism.etherscan.io',
    rpcUrl: 'https://sepolia.optimism.io',
    faucet: 'https://www.alchemy.com/faucets/optimism-sepolia',
    color: 'bg-red-500'
  },
  ARBITRUM_SEPOLIA: {
    address: import.meta.env.VITE_ARBITRUM_SEPOLIA_BRIDGE || CROSSL2_PROVER_ADDRESS,
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    symbol: 'ETH',
    decimals: 18,
    explorer: 'https://sepolia.arbiscan.io',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    faucet: 'https://www.alchemy.com/faucets/arbitrum-sepolia',
    color: 'bg-blue-400'
  },
  BASE_SEPOLIA: {
    address: import.meta.env.VITE_BASE_SEPOLIA_BRIDGE || CROSSL2_PROVER_ADDRESS,
    chainId: 84532,
    name: 'Base Sepolia',
    symbol: 'ETH',
    decimals: 18,
    explorer: 'https://sepolia.basescan.org',
    rpcUrl: 'https://sepolia.base.org',
    faucet: 'https://www.alchemy.com/faucets/base-sepolia',
    color: 'bg-indigo-500'
  }
}

// CrossL2Prover Contract ABI - Based on typical cross-chain prover patterns
export const CROSSL2_PROVER_ABI = [
  {
    "inputs": [
      {"name": "targetChain", "type": "uint256"},
      {"name": "recipient", "type": "address"},
      {"name": "data", "type": "bytes"}
    ],
    "name": "proveAndRelay",
    "outputs": [{"name": "proofId", "type": "bytes32"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "sourceChain", "type": "uint256"},
      {"name": "proofId", "type": "bytes32"},
      {"name": "proof", "type": "bytes"},
      {"name": "recipient", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "executeProof",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "proofId", "type": "bytes32"}
    ],
    "name": "getProofStatus",
    "outputs": [
      {"name": "status", "type": "uint8"},
      {"name": "sourceChain", "type": "uint256"},
      {"name": "targetChain", "type": "uint256"},
      {"name": "amount", "type": "uint256"},
      {"name": "recipient", "type": "address"},
      {"name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "chainId", "type": "uint256"}
    ],
    "name": "isChainSupported",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMinimumAmount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "proofId", "type": "bytes32"},
      {"indexed": true, "name": "from", "type": "address"},
      {"indexed": true, "name": "targetChain", "type": "uint256"},
      {"indexed": false, "name": "recipient", "type": "address"},
      {"indexed": false, "name": "amount", "type": "uint256"},
      {"indexed": false, "name": "timestamp", "type": "uint256"}
    ],
    "name": "ProofInitiated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "proofId", "type": "bytes32"},
      {"indexed": true, "name": "recipient", "type": "address"},
      {"indexed": false, "name": "amount", "type": "uint256"},
      {"indexed": false, "name": "sourceChain", "type": "uint256"}
    ],
    "name": "ProofExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "proofId", "type": "bytes32"},
      {"indexed": false, "name": "reason", "type": "string"}
    ],
    "name": "ProofFailed",
    "type": "event"
  }
]

// Simple bridge contract ABI for fallback
export const BRIDGE_ABI = [
  {
    "inputs": [
      {"name": "destinationChainId", "type": "uint256"},
      {"name": "recipient", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "bridgeETH",
    "outputs": [{"name": "transferId", "type": "bytes32"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "transferId", "type": "bytes32"}
    ],
    "name": "getTransferStatus",
    "outputs": [
      {"name": "status", "type": "uint8"},
      {"name": "amount", "type": "uint256"},
      {"name": "recipient", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "transferId", "type": "bytes32"},
      {"name": "proof", "type": "bytes"}
    ],
    "name": "claimTransfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

// Demo mode configuration
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

// Minimum transfer amounts (in ETH)
export const MIN_TRANSFER_AMOUNTS = {
  ETHEREUM_SEPOLIA: '0.001',
  POLYGON_AMOY: '0.001',
  OPTIMISM_SEPOLIA: '0.001',
  ARBITRUM_SEPOLIA: '0.001',
  BASE_SEPOLIA: '0.001'
}

// Estimated transfer times (in seconds)
export const TRANSFER_TIMES = {
  ETHEREUM_SEPOLIA: {
    POLYGON_AMOY: 300,     // 5 minutes
    OPTIMISM_SEPOLIA: 300,  // 5 minutes
    ARBITRUM_SEPOLIA: 600,  // 10 minutes
    BASE_SEPOLIA: 300       // 5 minutes
  },
  POLYGON_AMOY: {
    ETHEREUM_SEPOLIA: 1800, // 30 minutes (withdrawal)
    OPTIMISM_SEPOLIA: 300,  // 5 minutes
    ARBITRUM_SEPOLIA: 300,  // 5 minutes
    BASE_SEPOLIA: 300       // 5 minutes
  },
  OPTIMISM_SEPOLIA: {
    ETHEREUM_SEPOLIA: 1800, // 30 minutes (withdrawal)
    POLYGON_AMOY: 300,      // 5 minutes
    ARBITRUM_SEPOLIA: 300,  // 5 minutes
    BASE_SEPOLIA: 300       // 5 minutes
  },
  ARBITRUM_SEPOLIA: {
    ETHEREUM_SEPOLIA: 1800, // 30 minutes (withdrawal)
    POLYGON_AMOY: 300,      // 5 minutes
    OPTIMISM_SEPOLIA: 300,  // 5 minutes
    BASE_SEPOLIA: 300       // 5 minutes
  },
  BASE_SEPOLIA: {
    ETHEREUM_SEPOLIA: 1800, // 30 minutes (withdrawal)
    POLYGON_AMOY: 300,      // 5 minutes
    OPTIMISM_SEPOLIA: 300,  // 5 minutes
    ARBITRUM_SEPOLIA: 300   // 5 minutes
  }
}

// Gas configuration
export const GAS_CONFIG = {
  DEFAULT_GAS_LIMIT: parseInt(import.meta.env.VITE_DEFAULT_GAS_LIMIT || '300000'),
  DEFAULT_GAS_PRICE: parseInt(import.meta.env.VITE_DEFAULT_GAS_PRICE || '20'), // gwei
  PROOF_GAS_LIMIT: 500000,
  EXECUTE_GAS_LIMIT: 200000
}