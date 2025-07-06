import React, { useState, useEffect } from 'react'
import { Layers, Zap, Network, ArrowRight, Code, Database, Globe, Shield } from 'lucide-react'
import { polymerApi } from '../services/polymerApi'
import { interopContract } from '../services/interopContract'
import { useAccount, useWalletClient } from 'wagmi'
import toast from 'react-hot-toast'

interface RollupApp {
  id: string
  name: string
  description: string
  chains: string[]
  status: 'active' | 'deploying' | 'inactive'
  transactions: number
  tvl: number
}

interface IntentBatch {
  id: string
  intents: any[]
  status: 'pending' | 'processing' | 'completed' | 'failed'
  timestamp: Date
  estimatedCompletion: number
}

const MultiRollupApps: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [rollupApps, setRollupApps] = useState<RollupApp[]>([])
  const [intentBatches, setIntentBatches] = useState<IntentBatch[]>([])
  const [selectedApp, setSelectedApp] = useState<string>('')
  const [isDeploying, setIsDeploying] = useState(false)
  const [newAppConfig, setNewAppConfig] = useState({
    name: '',
    description: '',
    chains: [] as string[],
    features: [] as string[]
  })

  const availableChains = [
    'Ethereum Sepolia',
    'Polygon Amoy', 
    'Optimism Sepolia',
    'Arbitrum Sepolia',
    'Base Sepolia'
  ]

  const appTemplates = [
    {
      id: 'defi-aggregator',
      name: 'DeFi Aggregator',
      description: 'Cross-chain yield farming and liquidity aggregation',
      icon: Database,
      chains: ['Ethereum Sepolia', 'Polygon Amoy', 'Optimism Sepolia'],
      features: ['Yield Optimization', 'Cross-chain Swaps', 'Liquidity Mining']
    },
    {
      id: 'nft-marketplace',
      name: 'NFT Marketplace',
      description: 'Multi-chain NFT trading and bridging platform',
      icon: Globe,
      chains: ['Ethereum Sepolia', 'Polygon Amoy', 'Base Sepolia'],
      features: ['Cross-chain NFTs', 'Unified Marketplace', 'Royalty Distribution']
    },
    {
      id: 'gaming-platform',
      name: 'Gaming Platform',
      description: 'Cross-chain gaming with unified asset management',
      icon: Zap,
      chains: ['Polygon Amoy', 'Arbitrum Sepolia', 'Base Sepolia'],
      features: ['Asset Bridging', 'Leaderboards', 'Reward Distribution']
    },
    {
      id: 'dao-governance',
      name: 'DAO Governance',
      description: 'Multi-chain governance and proposal execution',
      icon: Shield,
      chains: ['Ethereum Sepolia', 'Optimism Sepolia', 'Arbitrum Sepolia'],
      features: ['Cross-chain Voting', 'Proposal Execution', 'Treasury Management']
    }
  ]

  useEffect(() => {
    loadRollupApps()
    loadIntentBatches()
  }, [])

  const loadRollupApps = async () => {
    // Mock data for demonstration
    const mockApps: RollupApp[] = [
      {
        id: '1',
        name: 'CrossDeFi Protocol',
        description: 'Multi-chain yield farming aggregator',
        chains: ['Ethereum Sepolia', 'Polygon Amoy', 'Optimism Sepolia'],
        status: 'active',
        transactions: 15420,
        tvl: 2.4
      },
      {
        id: '2', 
        name: 'Universal NFT Hub',
        description: 'Cross-chain NFT marketplace and bridge',
        chains: ['Ethereum Sepolia', 'Base Sepolia'],
        status: 'active',
        transactions: 8930,
        tvl: 1.2
      },
      {
        id: '3',
        name: 'GameFi Universe',
        description: 'Multi-rollup gaming ecosystem',
        chains: ['Polygon Amoy', 'Arbitrum Sepolia'],
        status: 'deploying',
        transactions: 0,
        tvl: 0
      }
    ]
    setRollupApps(mockApps)
  }

  const loadIntentBatches = async () => {
    // Mock intent batches
    const mockBatches: IntentBatch[] = [
      {
        id: 'batch-1',
        intents: [
          { type: 'swap', fromChain: 'Ethereum Sepolia', toChain: 'Polygon Amoy', amount: '100' },
          { type: 'stake', chain: 'Optimism Sepolia', amount: '50' }
        ],
        status: 'processing',
        timestamp: new Date(Date.now() - 300000),
        estimatedCompletion: 120
      },
      {
        id: 'batch-2',
        intents: [
          { type: 'bridge', fromChain: 'Base Sepolia', toChain: 'Arbitrum Sepolia', amount: '25' }
        ],
        status: 'completed',
        timestamp: new Date(Date.now() - 600000),
        estimatedCompletion: 0
      }
    ]
    setIntentBatches(mockBatches)
  }

  const deployMultiRollupApp = async (template: any) => {
    if (!isConnected || !walletClient) {
      toast.error('Please connect your wallet')
      return
    }

    setIsDeploying(true)
    try {
      // Create intent batch for multi-chain deployment
      const deploymentIntents = template.chains.map((chain: string) => ({
        type: 'deploy_contract',
        chain,
        contractType: template.id,
        params: {
          name: newAppConfig.name || template.name,
          features: template.features
        }
      }))

      const batchId = await polymerApi.submitIntentBatch(deploymentIntents)
      
      toast.success('Multi-rollup app deployment initiated')
      
      // Add new app to list
      const newApp: RollupApp = {
        id: batchId,
        name: newAppConfig.name || template.name,
        description: newAppConfig.description || template.description,
        chains: template.chains,
        status: 'deploying',
        transactions: 0,
        tvl: 0
      }
      
      setRollupApps(prev => [newApp, ...prev])
      
      // Reset form
      setNewAppConfig({
        name: '',
        description: '',
        chains: [],
        features: []
      })
      
    } catch (error: any) {
      console.error('Deployment failed:', error)
      toast.error('Deployment failed: ' + error.message)
    } finally {
      setIsDeploying(false)
    }
  }

  const executeIntentBatch = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      const intents = [
        {
          type: 'cross_chain_swap',
          fromChain: 'Ethereum Sepolia',
          toChain: 'Polygon Amoy',
          amount: '10',
          token: 'ETH'
        },
        {
          type: 'liquidity_provision',
          chain: 'Optimism Sepolia',
          amount: '5',
          pool: 'ETH/USDC'
        }
      ]

      const batchId = await polymerApi.submitIntentBatch(intents)
      
      const newBatch: IntentBatch = {
        id: batchId,
        intents,
        status: 'pending',
        timestamp: new Date(),
        estimatedCompletion: 180
      }
      
      setIntentBatches(prev => [newBatch, ...prev])
      toast.success('Intent batch submitted successfully')
      
    } catch (error: any) {
      console.error('Intent batch failed:', error)
      toast.error('Intent batch failed: ' + error.message)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'deploying': case 'processing': case 'pending': return 'text-yellow-400'
      case 'completed': return 'text-blue-400'
      case 'inactive': case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Multi-Rollup Applications
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Build and deploy applications that span multiple rollups and chains 
            with unified state management and seamless user experiences.
          </p>
        </div>

        {/* App Templates */}
        <div className="glass-effect rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Application Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appTemplates.map((template) => (
              <div key={template.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <template.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{template.name}</h4>
                    <p className="text-gray-300 text-sm mb-3">{template.description}</p>
                    
                    <div className="mb-3">
                      <div className="text-xs text-gray-400 mb-1">Supported Chains:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.chains.map((chain) => (
                          <span key={chain} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            {chain}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-1">Features:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature) => (
                          <span key={feature} className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deployMultiRollupApp(template)}
                      disabled={isDeploying}
                      className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all"
                    >
                      {isDeploying ? 'Deploying...' : 'Deploy Multi-Rollup App'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deployed Apps */}
        <div className="glass-effect rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Deployed Applications</h3>
          <div className="space-y-4">
            {rollupApps.map((app) => (
              <div key={app.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{app.name}</h4>
                    <p className="text-gray-300 text-sm">{app.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getStatusColor(app.status)}`}>
                      {app.status.toUpperCase()}
                    </div>
                    <div className="text-gray-400 text-xs">App ID: {app.id}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Active Chains</div>
                    <div className="flex flex-wrap gap-1">
                      {app.chains.map((chain) => (
                        <span key={chain} className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                          {chain}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Transactions</div>
                    <div className="text-white font-medium">{app.transactions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">TVL</div>
                    <div className="text-white font-medium">${app.tvl.toFixed(1)}M</div>
                  </div>
                </div>
                
                {app.status === 'active' && (
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                      View Analytics
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm">
                      Manage App
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Intent Batches */}
        <div className="glass-effect rounded-2xl p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Intent Batches</h3>
            <button
              onClick={executeIntentBatch}
              disabled={!isConnected}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium"
            >
              Execute Sample Batch
            </button>
          </div>
          
          <div className="space-y-4">
            {intentBatches.map((batch) => (
              <div key={batch.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-white font-medium">Batch {batch.id}</div>
                    <div className="text-gray-400 text-sm">{batch.intents.length} intents</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getStatusColor(batch.status)}`}>
                      {batch.status.toUpperCase()}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {batch.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {batch.intents.map((intent, index) => (
                    <div key={index} className="bg-black/20 rounded p-2 text-sm">
                      <div className="text-gray-300">
                        {intent.type}: {intent.amount} {intent.token || 'tokens'}
                        {intent.fromChain && intent.toChain && (
                          <span className="text-blue-400 ml-2">
                            {intent.fromChain} → {intent.toChain}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {batch.status === 'processing' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Processing...</span>
                      <span>~{batch.estimatedCompletion}s remaining</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div className="bg-blue-400 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chain Abstraction Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-effect rounded-xl p-6 text-center">
            <Layers className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Unified State</h3>
            <p className="text-gray-300 text-sm">
              Manage application state across multiple rollups seamlessly
            </p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center">
            <Network className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Cross-Chain Logic</h3>
            <p className="text-gray-300 text-sm">
              Execute complex business logic spanning multiple chains
            </p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center">
            <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Intent Batching</h3>
            <p className="text-gray-300 text-sm">
              Batch multiple operations for optimal execution and gas efficiency
            </p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center">
            <Code className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Developer Tools</h3>
            <p className="text-gray-300 text-sm">
              Rich SDKs and APIs for building multi-rollup applications
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MultiRollupApps