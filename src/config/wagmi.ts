import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { 
  sepolia, 
  optimismSepolia, 
  arbitrumSepolia,
  baseSepolia 
} from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
import { alchemyProvider } from 'wagmi/providers/alchemy'

// Define Polygon Amoy chain manually since it might not be available in wagmi/chains
const polygonAmoy = {
  id: 80002,
  name: 'Polygon Amoy',
  network: 'polygon-amoy',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-amoy.polygon.technology'],
    },
    public: {
      http: ['https://rpc-amoy.polygon.technology'],
    },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
}

// Get API keys from environment
const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY
const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

// Helper function to check if API key is valid (not empty and not placeholder)
const isValidApiKey = (key: string | undefined): boolean => {
  return !!(key && 
    key.trim() !== '' && 
    !key.includes('your_') && 
    !key.includes('_here') &&
    key !== 'demo-project-id')
}

// Build providers array based on available API keys
const providers = []

// Add Alchemy provider if API key is valid
if (isValidApiKey(alchemyApiKey)) {
  providers.push(alchemyProvider({ apiKey: alchemyApiKey! }))
}

// Add Infura provider if API key is valid
if (isValidApiKey(infuraApiKey)) {
  providers.push(infuraProvider({ apiKey: infuraApiKey! }))
}

// Always add public provider as fallback
providers.push(publicProvider())

// Using Sepolia testnet chains and Polygon Amoy for safe testing
const { chains, publicClient } = configureChains(
  [sepolia, polygonAmoy, optimismSepolia, arbitrumSepolia, baseSepolia],
  providers
)

// Only use WalletConnect if we have a valid project ID, otherwise use a minimal connector setup
let connectors

if (isValidApiKey(walletConnectProjectId)) {
  const { connectors: walletConnectors } = getDefaultWallets({
    appName: 'Ditsy Demo Labs CrossL2Prover Bridge',
    projectId: walletConnectProjectId!,
    chains
  })
  connectors = walletConnectors
} else {
  // Fallback to basic connectors without WalletConnect
  console.warn('WalletConnect Project ID not configured. Some wallet connection features may be limited.')
  const { connectors: basicConnectors } = getDefaultWallets({
    appName: 'Ditsy Demo Labs CrossL2Prover Bridge',
    projectId: 'demo-fallback-id',
    chains
  })
  connectors = basicConnectors
}

const wagmiConfig = createConfig({
  autoConnect: false, // Disable auto-connect to prevent immediate connection attempts
  connectors,
  publicClient
})

export { wagmiConfig, chains }