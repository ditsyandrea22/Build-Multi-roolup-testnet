export interface Chain {
  id: string
  name: string
  symbol: string
  color: string
  rpcUrl: string
  blockExplorer: string
}

export interface BridgeTransaction {
  id: string
  fromChain: string
  toChain: string
  amount: string
  token: string
  status: 'pending' | 'completed' | 'failed'
  txHash?: string
  timestamp: Date
  estimatedTime: number
}

export interface PolymerConfig {
  apiKey: string
  network: 'mainnet' | 'testnet'
  supportedChains: Chain[]
}