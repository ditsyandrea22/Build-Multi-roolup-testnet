import React, { useState, useEffect } from 'react'
import { Globe, Zap, ArrowRight, Code, Database, Shield, Network, Layers } from 'lucide-react'
import { polymerApi } from '../services/polymerApi'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'

interface AbstractionOperation {
  id: string
  type: 'swap' | 'bridge' | 'stake' | 'lend' | 'compound'
  description: string
  chains: string[]
  status: 'pending' | 'executing' | 'completed' | 'failed'
  timestamp: Date
  estimatedTime: number
  gasOptimization: number
}

interface CompactOperation {
  id: string
  operations: string[]
  totalGasSaved: number
  executionTime: number
  status: 'pending' | 'completed'
}

const ChainAbstraction: React.FC = () => {
  const { address, isConnected } = useAccount()
  const [operations, setOperations] = useState<AbstractionOperation[]>([])
  const [compactOps, setCompactOps] = useState<CompactOperation[]>([])
  const [selectedOperation, setSelectedOperation] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [abstractionStats, setAbstractionStats] = useState({
    totalOperations: 0,
    gasSaved: 0,
    timeReduced: 0,
    chainsAbstracted: 0
  })

  const operationTypes = [
    {
      type: 'swap',
      name: 'Cross-Chain Swap',
      description: 'Swap tokens across multiple chains in a single transaction',
      icon: ArrowRight,
      chains: ['Ethereum Sepolia', 'Polygon Amoy'],
      gasOptimization: 45
    },
    {
      type: 'bridge',
      name: 'Universal Bridge',
      description: 'Bridge assets between any supported chains automatically',
      icon: Network,
      chains: ['Ethereum Sepolia', 'Optimism Sepolia', 'Arbitrum Sepolia'],
      gasOptimization: 35
    },
    {
      type: 'stake',
      name: 'Multi-Chain Staking',
      description: 'Stake across multiple protocols and chains simultaneously',
      icon: Shield,
      chains: ['Polygon Amoy', 'Optimism Sepolia'],
      gasOptimization: 55
    },
    {
      type: 'lend',
      name: 'Cross-Chain Lending',
      description: 'Lend and borrow across different lending protocols',
      icon: Database,
      chains: ['Ethereum Sepolia', 'Arbitrum Sepolia'],
      gasOptimization: 40
    },
    {
      type: 'compound',
      name: 'Compound Operations',
      description: 'Execute multiple DeFi operations in optimal sequence',
      icon: Layers,
      chains: ['Ethereum Sepolia', 'Polygon Amoy', 'Optimism Sepolia'],
      gasOptimization: 65
    }
  ]

  useEffect(() => {
    loadAbstractionData()
    const interval = setInterval(updateOperationStatuses, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadAbstractionData = async () => {
    // Mock data for demonstration
    setAbstractionStats({
      totalOperations: 15420,
      gasSaved: 2.4,
      timeReduced: 78,
      chainsAbstracted: 5
    })

    const mockOperations: AbstractionOperation[] = [
      {
        id: 'op-1',
        type: 'swap',
        description: 'ETH → MATIC cross-chain swap',
        chains: ['Ethereum Sepolia', 'Polygon Amoy'],
        status: 'executing',
        timestamp: new Date(Date.now() - 120000),
        estimatedTime: 180,
        gasOptimization: 45
      },
      {
        id: 'op-2',
        type: 'compound',
        description: 'Multi-chain yield optimization',
        chains: ['Ethereum Sepolia', 'Optimism Sepolia', 'Arbitrum Sepolia'],
        status: 'completed',
        timestamp: new Date(Date.now() - 300000),
        estimatedTime: 0,
        gasOptimization: 65
      }
    ]
    setOperations(mockOperations)

    const mockCompactOps: CompactOperation[] = [
      {
        id: 'compact-1',
        operations: ['Swap ETH→USDC', 'Bridge to Polygon Amoy', 'Stake USDC'],
        totalGasSaved: 0.024,
        executionTime: 145,
        status: 'completed'
      }
    ]
    setCompactOps(mockCompactOps)
  }

  const updateOperationStatuses = () => {
    setOperations(prev => 
      prev.map(op => {
        if (op.status === 'executing') {
          const elapsed = Date.now() - op.timestamp.getTime()
          if (elapsed > op.estimatedTime * 1000) {
            return { ...op, status: 'completed' as const }
          }
        }
        return op
      })
    )
  }

  const executeChainAbstraction = async (operationType: any) => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    setIsExecuting(true)
    try {
      const operationParams = {
        type: operationType.type,
        chains: operationType.chains,
        amount: '10', // Mock amount
        optimizeGas: true,
        optimizeTime: true
      }

      const transactionId = await polymerApi.executeChainAbstraction(
        operationType.type,
        operationParams
      )

      const newOperation: AbstractionOperation = {
        id: transactionId,
        type: operationType.type,
        description: operationType.description,
        chains: operationType.chains,
        status: 'pending',
        timestamp: new Date(),
        estimatedTime: Math.floor(Math.random() * 300) + 60,
        gasOptimization: operationType.gasOptimization
      }

      setOperations(prev => [newOperation, ...prev])
      toast.success('Chain abstraction operation initiated')

      // Simulate status updates
      setTimeout(() => {
        setOperations(prev => 
          prev.map(op => 
            op.id === transactionId 
              ? { ...op, status: 'executing' as const }
              : op
          )
        )
      }, 2000)

    } catch (error: any) {
      console.error('Chain abstraction failed:', error)
      toast.error('Operation failed: ' + error.message)
    } finally {
      setIsExecuting(false)
    }
  }

  const executeCompactOperation = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      // The Compact: Batch multiple operations for gas efficiency
      const compactOperations = [
        { type: 'swap', fromToken: 'ETH', toToken: 'USDC', chain: 'Ethereum Sepolia' },
        { type: 'bridge', token: 'USDC', fromChain: 'Ethereum Sepolia', toChain: 'Polygon Amoy' },
        { type: 'stake', token: 'USDC', protocol: 'Aave', chain: 'Polygon Amoy' }
      ]

      const batchId = await polymerApi.submitIntentBatch(compactOperations)

      const newCompactOp: CompactOperation = {
        id: batchId,
        operations: ['Swap ETH→USDC', 'Bridge to Polygon Amoy', 'Stake in Aave'],
        totalGasSaved: Math.random() * 0.05,
        executionTime: Math.floor(Math.random() * 200) + 100,
        status: 'pending'
      }

      setCompactOps(prev => [newCompactOp, ...prev])
      toast.success('Compact operation batch submitted')

      // Simulate completion
      setTimeout(() => {
        setCompactOps(prev => 
          prev.map(op => 
            op.id === batchId 
              ? { ...op, status: 'completed' as const }
              : op
          )
        )
      }, 5000)

    } catch (error: any) {
      console.error('Compact operation failed:', error)
      toast.error('Compact operation failed: ' + error.message)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'executing': case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Chain Abstraction
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Abstract away blockchain complexity with unified operations across multiple chains. 
            Execute complex multi-chain workflows with a single transaction.
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass-effect rounded-xl p-4 text-center">
            <Globe className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              {abstractionStats.totalOperations.toLocaleString()}
            </div>
            <div className="text-gray-400 text-xs">Total Operations</div>
          </div>

          <div className="glass-effect rounded-xl p-4 text-center">
            <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              ${abstractionStats.gasSaved.toFixed(1)}M
            </div>
            <div className="text-gray-400 text-xs">Gas Saved</div>
          </div>

          <div className="glass-effect rounded-xl p-4 text-center">
            <ArrowRight className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              {abstractionStats.timeReduced}%
            </div>
            <div className="text-gray-400 text-xs">Time Reduced</div>
          </div>

          <div className="glass-effect rounded-xl p-4 text-center">
            <Network className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              {abstractionStats.chainsAbstracted}
            </div>
            <div className="text-gray-400 text-xs">Chains Abstracted</div>
          </div>
        </div>

        {/* Operation Types */}
        <div className="glass-effect rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Available Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operationTypes.map((operation) => (
              <div key={operation.type} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <operation.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{operation.name}</h4>
                    <p className="text-gray-300 text-sm mb-3">{operation.description}</p>
                    
                    <div className="mb-3">
                      <div className="text-xs text-gray-400 mb-1">Chains:</div>
                      <div className="flex flex-wrap gap-1">
                        {operation.chains.map((chain) => (
                          <span key={chain} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            {chain}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-1">Gas Optimization:</div>
                      <div className="text-green-400 font-medium">{operation.gasOptimization}% savings</div>
                    </div>
                    
                    <button
                      onClick={() => executeChainAbstraction(operation)}
                      disabled={isExecuting}
                      className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all"
                    >
                      {isExecuting ? 'Executing...' : 'Execute Operation'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Compact - 7683 */}
        <div className="glass-effect rounded-2xl p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">The Compact (EIP-7683)</h3>
              <p className="text-gray-300">
                Batch multiple operations for maximum gas efficiency and optimal execution
              </p>
            </div>
            <button
              onClick={executeCompactOperation}
              disabled={!isConnected}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium"
            >
              Execute Compact Batch
            </button>
          </div>
          
          <div className="space-y-4">
            {compactOps.map((op) => (
              <div key={op.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-white font-medium">Compact Operation {op.id}</div>
                    <div className="text-gray-400 text-sm">{op.operations.length} batched operations</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getStatusColor(op.status)}`}>
                      {op.status.toUpperCase()}
                    </div>
                    <div className="text-green-400 text-xs">
                      Saved {op.totalGasSaved.toFixed(4)} ETH
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {op.operations.map((operation, index) => (
                    <div key={index} className="bg-black/20 rounded p-2 text-sm text-gray-300">
                      {index + 1}. {operation}
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Execution Time: </span>
                    <span className="text-white">{op.executionTime}s</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Gas Saved: </span>
                    <span className="text-green-400">{(op.totalGasSaved * 1000).toFixed(1)} gwei</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Operations */}
        <div className="glass-effect rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Active Operations</h3>
          <div className="space-y-4">
            {operations.map((operation) => (
              <div key={operation.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-white font-medium">{operation.description}</div>
                    <div className="text-gray-400 text-sm">
                      {operation.chains.join(' → ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getStatusColor(operation.status)}`}>
                      {operation.status.toUpperCase()}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {operation.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Type: </span>
                    <span className="text-white capitalize">{operation.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Gas Optimization: </span>
                    <span className="text-green-400">{operation.gasOptimization}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Estimated Time: </span>
                    <span className="text-white">{operation.estimatedTime}s</span>
                  </div>
                </div>
                
                {operation.status === 'executing' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Executing across {operation.chains.length} chains...</span>
                      <span>~{operation.estimatedTime}s remaining</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-effect rounded-xl p-6 text-center">
            <Globe className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Unified UX</h3>
            <p className="text-gray-300 text-sm">
              Single transaction for complex multi-chain operations
            </p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center">
            <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Gas Optimization</h3>
            <p className="text-gray-300 text-sm">
              Intelligent batching reduces gas costs by up to 65%
            </p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Atomic Execution</h3>
            <p className="text-gray-300 text-sm">
              All operations succeed or fail together for safety
            </p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center">
            <Code className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Developer Friendly</h3>
            <p className="text-gray-300 text-sm">
              Simple APIs abstract away multi-chain complexity
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChainAbstraction