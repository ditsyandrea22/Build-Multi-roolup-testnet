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

// Using only Sepolia testnet chains for safe testing
const { chains, publicClient } = configureChains(
  [sepolia, optimismSepolia, arbitrumSepolia, baseSepolia],
  [
    infuraProvider({ apiKey: 'demo' }), // Using demo key for testing
    publicProvider()
  ]
)

// Get WalletConnect Project ID from environment or use a fallback
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

const { connectors } = getDefaultWallets({
  appName: 'Polymer Labs Cross-Chain Bridge',
  projectId: walletConnectProjectId,
  chains
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export { wagmiConfig, chains }