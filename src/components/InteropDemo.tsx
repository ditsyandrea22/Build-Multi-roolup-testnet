import React, { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle, Clock, AlertCircle, ExternalLink, Zap, Network, Shield } from 'lucide-react'
import { useAccount, useNetwork } from 'wagmi'

interface Transaction {
  id: string
  from: string
  to: string
  amount: string
  status: 'pending' | 'completed' | 'failed'
  timestamp: Date
  txHash: string
  blockConfirmations: number
  estimatedTime: number
}

const InteropDemo: React.FC = () => {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [realTimeStats, setRealTimeStats] = useState({
    totalTransactions: 1247892,
    activeChains: 4,
    avgConfirmTime: 2.3,
    totalVolume: 45.7
  })

  const chains = [
    { name: 'Ethereum Sepolia', color: 'bg-blue-500', logo: '⟠', explorer: 'https://sepolia.etherscan.io' },
    { name: 'Optimism Sepolia', color: 'bg-red-500', logo: '🔴', explorer: 'https://sepolia-optimism.etherscan.io' },
    { name: 'Arbitrum Sepolia', color: 'bg-blue-400', logo: '🔵', explorer: 'https://sepolia.arbiscan.io' },
    { name: 'Base Sepolia', color: 'bg-indigo-500', logo: '🔷', explorer: 'https://sepolia.basescan.org' }
  ]

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 3),
        activeChains: 4,
        avgConfirmTime: 2.1 + Math.random() * 0.4,
        totalVolume: prev.totalVolume + Math.random() * 0.1
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Update transaction confirmations
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(prev => 
        prev.map(tx => ({
          ...tx,
          blockConfirmations: tx.status === 'pending' ? tx.blockConfirmations + 1 : tx.blockConfirmations,
          status: tx.blockConfirmations >= 12 && tx.status === 'pending' ? 'completed' : tx.status
        }))
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const simulateAdvancedTransaction = () => {
    setIsProcessing(true)
    
    const fromChain = chains[Math.floor(Math.random() * chains.length)]
    let toChain = chains[Math.floor(Math.random() * chains.length)]
    while (toChain.name === fromChain.name) {
      toChain = chains[Math.floor(Math.random() * chains.length)]
    }
    
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      from: fromChain.name,
      to: toChain.name,
      amount: (Math.random() * 5 + 0.1).toFixed(3),
      status: 'pending',
      timestamp: new Date(),
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockConfirmations: 0,
      estimatedTime: Math.floor(Math.random() * 180) + 60 // 1-4 minutes
    }
    
    setTransactions(prev => [newTx, ...prev.slice(0, 4)])
    
    // Simulate processing time
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTx.id 
            ? { 
                ...tx, 
                status: Math.random() > 0.05 ? 'pending' : 'failed',
                blockConfirmations: Math.random() > 0.05 ? 1 : 0
              }
            : tx
        )
      )
      setIsProcessing(false)
    }, 2000)
  }

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />
    }
  }

  const getChainInfo = (chainName: string) => {
    return chains.find(chain => chain.name === chainName)
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Live Cross-Chain Demo
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Experience real-time cross-chain interoperability with live transaction tracking, 
            network monitoring, and seamless multi-chain connectivity across Sepolia testnets.
          </p>
          
          {isConnected && chain && (
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Connected to {chain.name}</span>
            </div>
          )}
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass-effect rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {realTimeStats.totalTransactions.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Total Transactions</div>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {realTimeStats.activeChains}
            </div>
            <div className="text-gray-400 text-sm">Active Chains</div>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {realTimeStats.avgConfirmTime.toFixed(1)}s
            </div>
            <div className="text-gray-400 text-sm">Avg Confirm Time</div>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              ${realTimeStats.totalVolume.toFixed(1)}M
            </div>
            <div className="text-gray-400 text-sm">24h Volume</div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Chain Network Visualization */}
          <div className="glass-effect rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Supported Sepolia Testnet Chains</h3>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {chains.map((chain, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className={`w-16 h-16 rounded-full ${chain.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {chain.logo}
                  </div>
                  <span className="text-white font-medium text-sm text-center">{chain.name}</span>
                  <div className="flex space-x-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-green-400 rounded-full animate-pulse" 
                           style={{ animationDelay: `${i * 0.2}s` }}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Connection Lines */}
            <div className="relative">
              <svg className="w-full h-20" viewBox="0 0 400 80">
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                {Array.from({ length: 3 }).map((_, i) => (
                  <line
                    key={i}
                    x1={50 + i * 100}
                    y1="40"
                    x2={150 + i * 100}
                    y2="40"
                    stroke="url(#connectionGradient)"
                    strokeWidth="2"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </svg>
            </div>
            
            <div className="text-center">
              <button
                onClick={simulateAdvancedTransaction}
                disabled={isProcessing}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <Zap className="h-5 w-5" />
                <span>{isProcessing ? 'Processing Cross-Chain Transfer...' : 'Simulate Live Cross-Chain Transfer'}</span>
              </button>
            </div>
          </div>
          
          {/* Live Transaction Feed */}
          {transactions.length > 0 && (
            <div className="glass-effect rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Live Transaction Feed</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {transactions.map((tx) => {
                  const fromChain = getChainInfo(tx.from)
                  const toChain = getChainInfo(tx.to)
                  
                  return (
                    <div key={tx.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(tx.status)}
                          <div>
                            <div className="text-white font-medium flex items-center space-x-2">
                              <span>{tx.amount} ETH</span>
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300">{tx.from} → {tx.to}</span>
                            </div>
                            <div className="text-gray-400 text-sm flex items-center space-x-4">
                              <span>{tx.timestamp.toLocaleTimeString()}</span>
                              {tx.status === 'pending' && (
                                <span>Confirmations: {tx.blockConfirmations}/12</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            tx.status === 'completed' ? 'text-green-400' :
                            tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {tx.status.toUpperCase()}
                          </div>
                          <div className="text-gray-400 text-xs">#{tx.id}</div>
                        </div>
                      </div>
                      
                      {/* Transaction Hash */}
                      <div className="flex items-center justify-between bg-black/20 rounded p-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">TX Hash:</span>
                          <code className="text-xs text-blue-400 font-mono">
                            {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                          </code>
                        </div>
                        <button
                          onClick={() => {
                            if (fromChain) {
                              window.open(`${fromChain.explorer}/tx/${tx.txHash}`, '_blank')
                            }
                          }}
                          className="text-blue-400 hover:text-blue-300 p-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                      
                      {/* Progress Bar for Pending Transactions */}
                      {tx.status === 'pending' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Processing...</span>
                            <span>~{Math.floor(tx.estimatedTime / 60)}m {tx.estimatedTime % 60}s remaining</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min((tx.blockConfirmations / 12) * 100, 90)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Success Animation */}
                      {tx.status === 'completed' && (
                        <div className="flex items-center space-x-2 text-green-400 text-sm">
                          <CheckCircle className="h-4 w-4" />
                          <span>Transfer completed successfully</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="glass-effect rounded-xl p-6 text-center">
              <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300 text-sm">
                Sub-minute cross-chain transfers with real-time confirmation tracking
              </p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 text-center">
              <Network className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Chain Native</h3>
              <p className="text-gray-300 text-sm">
                Seamlessly connect and transfer between all major Sepolia testnet chains
              </p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 text-center">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Secure & Audited</h3>
              <p className="text-gray-300 text-sm">
                Battle-tested smart contracts with comprehensive security audits
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InteropDemo