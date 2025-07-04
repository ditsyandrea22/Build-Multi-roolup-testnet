// Polymer Labs Configuration
export const POLYMER_CONFIG = {
  // Polymer Prove API V2 Endpoints
  PROVE_API_BASE: 'https://prove-api.polymerlabs.org/v2',
  PROVER_CONTRACT: '0x1234567890123456789012345678901234567890', // Replace with actual prover contract
  
  // Supported Networks - Only Sepolia Testnets
  NETWORKS: {
    ETHEREUM_SEPOLIA: {
      chainId: 11155111,
      name: 'Ethereum Sepolia',
      rpcUrl: 'https://sepolia.infura.io/v3/demo',
      proverContract: '0x1234567890123456789012345678901234567890',
      polymerHub: '0x2345678901234567890123456789012345678901'
    },
    OPTIMISM_SEPOLIA: {
      chainId: 11155420,
      name: 'Optimism Sepolia',
      rpcUrl: 'https://sepolia.optimism.io',
      proverContract: '0x3456789012345678901234567890123456789012',
      polymerHub: '0x4567890123456789012345678901234567890123'
    },
    ARBITRUM_SEPOLIA: {
      chainId: 421614,
      name: 'Arbitrum Sepolia',
      rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
      proverContract: '0x5678901234567890123456789012345678901234',
      polymerHub: '0x6789012345678901234567890123456789012345'
    },
    BASE_SEPOLIA: {
      chainId: 84532,
      name: 'Base Sepolia',
      rpcUrl: 'https://sepolia.base.org',
      proverContract: '0x7890123456789012345678901234567890123456',
      polymerHub: '0x8901234567890123456789012345678901234567'
    }
  },
  
  // API Endpoints
  ENDPOINTS: {
    PROVE_PACKET: '/prove-packet',
    PROVE_MEMBERSHIP: '/prove-membership',
    PROVE_NON_MEMBERSHIP: '/prove-non-membership',
    GET_PROOF: '/get-proof',
    VERIFY_PROOF: '/verify-proof',
    CHAIN_STATUS: '/chain-status',
    RELAYER_STATUS: '/relayer-status'
  },
  
  // Error Codes
  ERROR_CODES: {
    INVALID_PROOF: 'INVALID_PROOF',
    CHAIN_NOT_SUPPORTED: 'CHAIN_NOT_SUPPORTED',
    INSUFFICIENT_CONFIRMATIONS: 'INSUFFICIENT_CONFIRMATIONS',
    PROVER_UNAVAILABLE: 'PROVER_UNAVAILABLE',
    TIMEOUT: 'TIMEOUT',
    INVALID_PACKET: 'INVALID_PACKET'
  }
}

// Polymer Interop Contract ABI
export const POLYMER_INTEROP_ABI = [
  {
    "inputs": [
      {"name": "packet", "type": "bytes"},
      {"name": "proof", "type": "bytes"},
      {"name": "proofHeight", "type": "uint64"}
    ],
    "name": "recvPacket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "packet", "type": "bytes"},
      {"name": "acknowledgement", "type": "bytes"},
      {"name": "proof", "type": "bytes"},
      {"name": "proofHeight", "type": "uint64"}
    ],
    "name": "acknowledgePacket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "packet", "type": "bytes"},
      {"name": "proof", "type": "bytes"},
      {"name": "proofHeight", "type": "uint64"}
    ],
    "name": "timeoutPacket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "channelId", "type": "string"},
      {"name": "portId", "type": "string"}
    ],
    "name": "getChannel",
    "outputs": [
      {"name": "state", "type": "uint8"},
      {"name": "ordering", "type": "uint8"},
      {"name": "counterparty", "type": "tuple", "components": [
        {"name": "portId", "type": "string"},
        {"name": "channelId", "type": "string"}
      ]},
      {"name": "connectionHops", "type": "string[]"},
      {"name": "version", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// Prover Contract ABI
export const PROVER_CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "proof", "type": "bytes"},
      {"name": "publicInputs", "type": "bytes"}
    ],
    "name": "verifyProof",
    "outputs": [{"name": "valid", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "blockHash", "type": "bytes32"},
      {"name": "blockNumber", "type": "uint256"}
    ],
    "name": "updateBlockHash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLatestBlockHash",
    "outputs": [{"name": "blockHash", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
  }
]