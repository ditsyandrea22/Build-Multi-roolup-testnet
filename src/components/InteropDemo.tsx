import React, { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle, Clock, AlertCircle, ExternalLink, Zap, Network, Shield, Wallet, Copy, Activity } from 'lucide-react'
import { useAccount, useNetwork, useSwitchNetwork, useBalance } from 'wagmi'
import { useWalletClient } from 'wagmi'
import { BRIDGE_CONTRACTS, DEMO_MODE, MIN_TRANSFER_AMOUNTS, CROSSL2_PROVER_ADDRESS } from '../config/contracts'
import { realBridgeService, RealBridgeTransaction } from '../services/realBridgeService'
import toast from 'react-hot-toast'

const InteropDemo: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { data: walletClient } = useWalletClient()
  const { data: balance } = useBalance({ address })
  
  const [fromChain, setFromChain] = useState('ETHEREUM_SEPOLIA')
  const [toChain, setToChain] = useState('OPTIMISM_SEPOLIA')
  const [amount, setAmount] = useState('')
  const [isTransferring, setIsTransferring] = useState(false)
  const [transactions, setTransactions] = useState<RealBridgeTransaction[]>([])
  const [gasCosts, setGasCosts] = useState({ gasCost: '0', totalCost: '0' })
  const [chainSupport, setChainSupport] = useState<Record<string, boolean>>({})
  const [minAmount, setMinAmount] = useState('0.001')
  const [realTimeStats, setRealTimeStats] = useState({
    totalTransactions: 1247892,
    activeChains: 4,
    avgConfirmTime: 2.3,
    totalVolume: 45.7
  })

  const chains = Object.entries(BRIDGE_CONTRACTS).map(([key, config]) => ({
    key,
    ...config
  }))

  // Load user transactions on mount and when address changes
  useEffect(() => {
    if (address) {
      const userTxs = realBridgeService.getTransactionsByAddress(address)
      setTransactions(userTxs)
    }
  }, [address])

  // Check chain support and minimum amounts
  useEffect(() => {
    if (walletClient?.account) {
      checkChainSupport()
      getMinimumAmount()
    }
  }, [walletClient])

  // Update gas estimates when amount or chains change
  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && walletClient?.account) {
      estimateGas()
    }
  }, [amount, fromChain, toChain, walletClient])

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

  // Poll for transaction updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (address) {
        const updatedTxs = realBridgeService.getTransactionsByAddress(address)
        setTransactions(updatedTxs)
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [address])

  const checkChainSupport = async () => {
    if (!walletClient?.account) return

    try {
      const provider = await walletClient.getProvider()
      const support: Record<string, boolean> = {}
      
      for (const [key, config] of Object.entries(BRIDGE_CONTRACTS)) {
        const isSupported = await realBridgeService.isChainSupported(config.chainId, provider)
        support[key] = isSupported
      }
      
      setChainSupport(support)
    } catch (error) {
      console.error('Error checking chain support:', error)
    }
  }

  const getMinimumAmount = async () => {
    if (!walletClient?.account) return

    try {
      const provider = await walletClient.getProvider()
      const min = await realBridgeService.getMinimumAmount(provider)
      setMinAmount(min)
    } catch (error) {
      console.error('Error getting minimum amount:', error)
    }
  }

  const estimateGas = async () => {
    if (!walletClient?.account || !amount) return

    try {
      const provider = await walletClient.getProvider()
      const costs = await realBridgeService.estimateGasCosts(
        fromChain,
        toChain,
        amount,
        provider
      )
      setGasCosts(costs)
    } catch (error) {
      console.error('Gas estimation failed:', error)
    }
  }

  const handleSwapChains = () => {
    const temp = fromChain
    setFromChain(toChain)
    setToChain(temp)
  }

  const handleSwitchNetwork = async (chainKey: string) => {
    const targetChain = chains.find(c => c.key === chainKey)
    if (targetChain && switchNetwork) {
      try {
        await switchNetwork(targetChain.chainId)
      } catch (error) {
        console.error('Failed to switch network:', error)
        toast.error('Failed to switch network')
      }
    }
  }

  const executeRealTransfer = async () => {
    if (!isConnected || !walletClient || !amount || !address) {
      toast.error('Please connect your wallet and enter an amount')
      return
    }

    const fromChainConfig = chains.find(c => c.key === fromChain)
    const toChainConfig = chains.find(c => c.key === toChain)
    const currentMinAmount = parseFloat(minAmount)
    
    if (parseFloat(amount) < currentMinAmount) {
      toast.error(`Minimum transfer amount is ${minAmount} ETH`)
      return
    }

    // Check if chains are supported
    if (!chainSupport[fromChain] || !chainSupport[toChain]) {
      toast.error('One or both chains are not supported by CrossL2Prover')
      return
    }

    // Check if on correct network
    if (chain?.id !== fromChainConfig?.chainId) {
      toast.error(`Please switch to ${fromChainConfig?.name}`)
      return
    }

    // Check balance
    if (balance && parseFloat(balance.formatted) < parseFloat(gasCosts.totalCost)) {
      toast.error('Insufficient balance for transfer and gas fees')
      return
    }

    setIsTransferring(true)
    
    try {
      const signer = await walletClient.getSigner()
      
      const transaction = await realBridgeService.initiateBridge(
        fromChain,
        toChain,
        amount,
        signer
      )
      
      // Add to local state immediately
      setTransactions(prev => [transaction, ...prev])
      
      // Clear form
      setAmount('')
      
      toast.success('CrossL2Prover transfer initiated successfully!')
      
    } catch (error: any) {
      console.error('Transfer failed:', error)
      if (error.message.includes('User rejected')) {
        toast.error('Transaction was rejected')
      } else {
        toast.error(`Transfer failed: ${error.message}`)
      }
    } finally {
      setIsTransferring(false)
    }
  }

  const getStatusIcon = (status: RealBridgeTransaction['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-400" />
      case 'proving':
        return <Activity className="h-4 w-4 text-purple-400 animate-pulse" />
      case 'bridging':
        return <Network className="h-4 w-4 text-indigo-400 animate-pulse" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />
    }
  }

  const getStatusColor = (status: RealBridgeTransaction['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-400'
      case 'confirmed': return 'text-blue-400'
      case 'proving': return 'text-purple-400'
      case 'bridging': return 'text-indigo-400'
      case 'completed': return 'text-green-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusDescription = (status: RealBridgeTransaction['status']) => {
    switch (status) {
      case 'pending': return 'Transaction pending confirmation'
      case 'confirmed': return 'Transaction confirmed, generating IBC proof'
      case 'proving': return 'IBC proof generated, waiting for execution'
      case 'bridging': return 'Executing cross-chain IBC transfer'
      case 'completed': return 'IBC transfer completed successfully'
      case 'failed': return 'Transfer failed'
      default: return 'Unknown status'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const getCurrentChainInfo = () => {
    return chains.find(c => c.chainId === chain?.id)
  }

  const isCorrectNetwork = () => {
    const fromChainInfo = chains.find(c => c.key === fromChain)
    return fromChainInfo && chain?.id === fromChainInfo.chainId
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            CrossL2Prover Bridge
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Experience real cross-chain transfers using CrossL2Prover on Sepolia testnets with 
            IBC protocol, cryptographic proof generation, live transaction tracking, and block explorer verification.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
              <Network className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">CrossL2Prover: {CROSSL2_PROVER_ADDRESS.slice(0, 10)}...</span>
            </div>
            
            <a
              href="https://dashboard.polymerlabs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span className="text-sm font-medium">Polymer Dashboard</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            
            {DEMO_MODE && (
              <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">Demo Mode - Simulated IBC Proofs</span>
              </div>
            )}
          </div>
          
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
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-5 w-5 text-blue-400 mr-2" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {realTimeStats.totalTransactions.toLocaleString()}
            </div>
            <div className="text-gray-400 text-xs">IBC Proofs Generated</div>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <Network className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              {realTimeStats.activeChains}
            </div>
            <div className="text-gray-400 text-xs">Connected Chains</div>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              {realTimeStats.avgConfirmTime.toFixed(1)}s
            </div>
            <div className="text-gray-400 text-xs">Avg IBC Proof Time</div>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <Shield className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              ${realTimeStats.totalVolume.toFixed(1)}M
            </div>
            <div className="text-gray-400 text-xs">24h Volume</div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Transfer Interface */}
          <div className="glass-effect rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">CrossL2Prover IBC Transfer</h3>
            
            {!isConnected ? (
              <div className="text-center py-12">
                <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-gray-300 mb-6">
                  Connect your wallet to start making real cross-chain transfers using CrossL2Prover and IBC protocol
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Network Status */}
                {chain && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Connected Network</div>
                        <div className="text-white font-medium">{chain.name}</div>
                        {balance && (
                          <div className="text-sm text-gray-400">
                            Balance: {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                          </div>
                        )}
                      </div>
                      <div className={`w-3 h-3 rounded-full ${isCorrectNetwork() ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    </div>
                    {!isCorrectNetwork() && (
                      <button
                        onClick={() => handleSwitchNetwork(fromChain)}
                        className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                      >
                        Switch to {chains.find(c => c.key === fromChain)?.name}
                      </button>
                    )}
                  </div>
                )}

                {/* Chain Support Status */}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">IBC Chain Support Status</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {chains.map((chain) => (
                      <div key={chain.key} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          chainSupport[chain.key] ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <span className="text-xs text-gray-300">{chain.name.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* From Chain */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <select
                        value={fromChain}
                        onChange={(e) => setFromChain(e.target.value)}
                        className="bg-transparent text-white text-lg font-semibold focus:outline-none"
                      >
                        {chains.map(chain => (
                          <option key={chain.key} value={chain.key} className="bg-gray-800">
                            {chain.name} {!chainSupport[chain.key] ? '(Unsupported)' : ''}
                          </option>
                        ))}
                      </select>
                      <div className="text-right">
                        <div className="text-gray-400 text-sm">Balance</div>
                        <div className="text-white font-medium">
                          {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000'}
                        </div>
                      </div>
                    </div>
                    
                    <input
                      type="number"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-transparent text-2xl text-white placeholder-gray-400 focus:outline-none"
                      step="0.001"
                      min={minAmount}
                    />
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-gray-400">
                        Min: {minAmount} ETH (from contract)
                      </div>
                      {balance && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setAmount((parseFloat(balance.formatted) * 0.25).toFixed(4))}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            25%
                          </button>
                          <button
                            onClick={() => setAmount((parseFloat(balance.formatted) * 0.5).toFixed(4))}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            50%
                          </button>
                          <button
                            onClick={() => setAmount((parseFloat(balance.formatted) * 0.9).toFixed(4))}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Max
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSwapChains}
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                    disabled={isTransferring}
                  >
                    <ArrowRight className="h-6 w-6 text-white" />
                  </button>
                </div>

                {/* To Chain */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <select
                        value={toChain}
                        onChange={(e) => setToChain(e.target.value)}
                        className="bg-transparent text-white text-lg font-semibold focus:outline-none"
                      >
                        {chains.map(chain => (
                          <option key={chain.key} value={chain.key} className="bg-gray-800">
                            {chain.name} {!chainSupport[chain.key] ? '(Unsupported)' : ''}
                          </option>
                        ))}
                      </select>
                      <div className="text-right">
                        <div className="text-gray-400 text-sm">You'll receive</div>
                        <div className="text-white font-medium">
                          {amount || '0.0'} ETH
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-2xl text-gray-400">
                      {amount || '0.0'}
                    </div>
                  </div>
                </div>

                {/* Transfer Details */}
                {amount && parseFloat(amount) > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-blue-400 font-medium mb-1">CrossL2Prover IBC Transfer Details</h4>
                        <div className="text-sm text-gray-300 space-y-1">
                          <div className="flex justify-between">
                            <span>IBC proof generation:</span>
                            <span>~2-5 minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cross-chain execution:</span>
                            <span>~5-30 minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Gas fee (estimated):</span>
                            <span>{parseFloat(gasCosts.gasCost).toFixed(4)} ETH</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total cost:</span>
                            <span>{parseFloat(gasCosts.totalCost).toFixed(4)} ETH</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Protocol:</span>
                            <span>IBC via CrossL2Prover</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Route:</span>
                            <span>{chains.find(c => c.key === fromChain)?.name} → {chains.find(c => c.key === toChain)?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transfer Button */}
                <button
                  onClick={executeRealTransfer}
                  disabled={
                    !amount || 
                    parseFloat(amount) <= 0 ||
                    isTransferring || 
                    fromChain === toChain ||
                    !isCorrectNetwork() ||
                    parseFloat(amount) < parseFloat(minAmount) ||
                    !chainSupport[fromChain] ||
                    !chainSupport[toChain]
                  }
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition-all duration-300"
                >
                  {isTransferring ? 'Processing CrossL2Prover IBC Transfer...' : 
                   fromChain === toChain ? 'Select different chains' :
                   !isCorrectNetwork() ? `Switch to ${chains.find(c => c.key === fromChain)?.name}` :
                   !chainSupport[fromChain] || !chainSupport[toChain] ? 'Chain not supported' :
                   !amount || parseFloat(amount) <= 0 ? 'Enter amount' :
                   parseFloat(amount) < parseFloat(minAmount) ? 
                   `Minimum ${minAmount} ETH` :
                   'Initiate CrossL2Prover IBC Transfer'}
                </button>
              </div>
            )}
          </div>
          
          {/* Transaction History */}
          {transactions.length > 0 && (
            <div className="glass-effect rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Your CrossL2Prover IBC Transfers</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Live Updates</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(tx.status)}
                        <div>
                          <div className="text-white font-medium flex items-center space-x-2">
                            <span>{tx.amount} ETH</span>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300">{tx.fromChain} → {tx.toChain}</span>
                          </div>
                          <div className="text-gray-400 text-sm flex items-center space-x-4">
                            <span>{tx.timestamp.toLocaleTimeString()}</span>
                            {tx.actualTime && (
                              <span>Completed in {Math.floor(tx.actualTime / 60)}m {tx.actualTime % 60}s</span>
                            )}
                            {tx.gasCost && (
                              <span>Gas: {parseFloat(tx.gasCost).toFixed(4)} ETH</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                          {tx.status.toUpperCase()}
                        </div>
                        <div className="text-gray-400 text-xs">#{tx.id}</div>
                      </div>
                    </div>
                    
                    {/* Status Description */}
                    <div className="mb-3">
                      <div className="text-xs text-gray-400">{getStatusDescription(tx.status)}</div>
                    </div>
                    
                    {/* Transaction Hashes */}
                    <div className="space-y-2">
                      {tx.txHash && (
                        <div className="flex items-center justify-between bg-black/20 rounded p-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">Source TX:</span>
                            <code className="text-xs text-blue-400 font-mono">
                              {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                            </code>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyToClipboard(tx.txHash!)}
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => {
                                const url = realBridgeService.getExplorerUrl(tx, 'source')
                                if (url) window.open(url, '_blank')
                              }}
                              className="text-blue-400 hover:text-blue-300 p-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {tx.proofId && (
                        <div className="flex items-center justify-between bg-black/20 rounded p-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">IBC Proof ID:</span>
                            <code className="text-xs text-purple-400 font-mono">
                              {tx.proofId.slice(0, 10)}...{tx.proofId.slice(-8)}
                            </code>
                          </div>
                          <button
                            onClick={() => copyToClipboard(tx.proofId!)}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      
                      {tx.claimTxHash && (
                        <div className="flex items-center justify-between bg-black/20 rounded p-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">Claim TX:</span>
                            <code className="text-xs text-green-400 font-mono">
                              {tx.claimTxHash.slice(0, 10)}...{tx.claimTxHash.slice(-8)}
                            </code>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyToClipboard(tx.claimTxHash!)}
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => {
                                const url = realBridgeService.getExplorerUrl(tx, 'destination')
                                if (url) window.open(url, '_blank')
                              }}
                              className="text-green-400 hover:text-green-300 p-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Progress Bar for Active Transactions */}
                    {(tx.status === 'pending' || tx.status === 'confirmed' || tx.status === 'proving' || tx.status === 'bridging') && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>
                            {tx.status === 'pending' ? 'Confirming transaction...' :
                             tx.status === 'confirmed' ? 'Generating IBC proof...' :
                             tx.status === 'proving' ? 'IBC proof ready, executing...' : 'Finalizing IBC transfer...'}
                          </span>
                          <span>~{Math.floor(tx.estimatedTime / 60)}m {tx.estimatedTime % 60}s estimated</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              tx.status === 'pending' ? 'bg-yellow-400 w-1/5' :
                              tx.status === 'confirmed' ? 'bg-blue-400 w-2/5' :
                              tx.status === 'proving' ? 'bg-purple-400 w-3/5' :
                              'bg-indigo-400 w-4/5'
                            }`}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Success Animation */}
                    {tx.status === 'completed' && (
                      <div className="flex items-center space-x-2 text-green-400 text-sm mt-3">
                        <CheckCircle className="h-4 w-4" />
                        <span>CrossL2Prover IBC transfer completed successfully</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testnet Faucets */}
          <div className="glass-effect rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">Need Sepolia Testnet Tokens?</h3>
            <p className="text-gray-300 text-sm mb-4">
              Get free Sepolia testnet tokens from these faucets to test CrossL2Prover IBC transfers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chains.map((chain) => (
                <a 
                  key={chain.key}
                  href={chain.faucet} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-white text-sm">{chain.name} Faucet</span>
                  <ExternalLink className="h-4 w-4 text-blue-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-effect rounded-xl p-6 text-center">
              <Activity className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">IBC Cryptographic Proofs</h3>
              <p className="text-gray-300 text-sm">
                Real IBC cryptographic proof generation and verification using CrossL2Prover
              </p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 text-center">
              <Network className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Live IBC Tracking</h3>
              <p className="text-gray-300 text-sm">
                Real-time IBC proof status monitoring with block explorer verification
              </p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 text-center">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Testnet Safe</h3>
              <p className="text-gray-300 text-sm">
                Safe testing environment with real IBC contract interactions on testnets
              </p>
            </div>
          </div>

          {/* IBC Protocol Information */}
          <div className="glass-effect rounded-2xl p-8 mt-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">About IBC Protocol</h3>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-300 mb-6 text-center">
                The Inter-Blockchain Communication (IBC) protocol enables secure and reliable communication 
                between independent blockchains, powering the next generation of cross-chain applications.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">🔗 Universal Standard</h4>
                  <p className="text-gray-300">
                    IBC is the gold standard for blockchain interoperability, enabling any blockchain to communicate with any other.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">🛡️ Cryptographic Security</h4>
                  <p className="text-gray-300">
                    Built on light client proofs and cryptographic verification for maximum security without trusted intermediaries.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">⚡ High Performance</h4>
                  <p className="text-gray-300">
                    Optimized for speed and efficiency with minimal overhead and maximum throughput.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">🔧 Developer Friendly</h4>
                  <p className="text-gray-300">
                    Simple APIs and comprehensive tooling make IBC integration straightforward for developers.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://github.com/open-ibc/ibc-app-solidity-template"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>IBC Solidity Template</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                
                <a
                  href="https://docs.polymerlabs.org/docs/learn/ibc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-lg px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <span>Learn IBC</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                
                <a
                  href="https://x.com/Polymer_Labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 text-green-400 hover:text-green-300 transition-colors"
                >
                  <span>Follow Polymer Labs</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InteropDemo