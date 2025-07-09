import { Chain } from '../types';

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 11155111,
    name: 'Sepolia',
    rpc: 'https://rpc.sepolia.org',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorer: 'https://sepolia.etherscan.io',
    icon: '🔷'
  },
  {
    id: 11155420,
    name: 'OP Sepolia',
    rpc: 'https://sepolia.optimism.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorer: 'https://sepolia-optimism.etherscan.io',
    icon: '🔴'
  },
  {
    id: 84532,
    name: 'Base Sepolia',
    rpc: 'https://sepolia.base.org',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorer: 'https://sepolia-explorer.base.org',
    icon: '🔵'
  },
  {
    id: 421614,
    name: 'Arbitrum Sepolia',
    rpc: 'https://sepolia-rollup.arbitrum.io/rpc',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorer: 'https://sepolia.arbiscan.io',
    icon: '🌀'
  },
  {
    id: 168587773,
    name: 'Blast Sepolia',
    rpc: 'https://sepolia.blast.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorer: 'https://testnet.blastscan.io',
    icon: '💥'
  },
  {
    id: 534351,
    name: 'Scroll Sepolia',
    rpc: 'https://sepolia-rpc.scroll.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorer: 'https://sepolia.scrollscan.com',
    icon: '📜'
  }
];

export const POLYMER_API_BASE = '/api';