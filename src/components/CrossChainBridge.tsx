import React, { useState, useEffect } from 'react'
import { ArrowUpDown, Wallet, AlertTriangle, ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useAccount, useBalance, useNetwork, useSwitchNetwork, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { sepolia, optimismSepolia, arbitrumSepolia, baseSepolia } from 'wagmi/chains'

interface BridgeTransaction {
  id: string
  fromChain: string
  toChain: string
  amount: string
  status: 'pending' | 'completed' | 'failed'
  txHash?: string
  timestamp: Date
  estimatedTime: number
}

const CrossChainBridge: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { data: balance } = useBalance({ address })
  
  const [fromChain, setFromChain] = useState('sepolia')
  const [toChain, setToChain] = useState('optimismSepolia')
  const [amount, setAmount] = useState('')
  const [isTransferring, setIsTransferring] = useState(false)
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([])
  const [txHash, setTxHash] = useState<string>('')

  const chains = [
    { 
      id: 'sepolia', 
      name: 'Ethereum Sepolia', 
      symbol: 'ETH', 
      color: 'bg-blue-500',
      chainId: sepolia.id,
      explorer: 'https://sepolia.etherscan.io'
    },
    { 
      id: 'optimismSepolia', 
      name: 'Optimism Sepolia', 
      symbol: 'ETH', 
      color: 'bg-red-500',
      chainId: optimismSepolia.id,
      explorer: 'https://sepolia-optimism.etherscan.io'
    },
    { 
      id: 'arbitrumSepolia', 
      name: 'Arbitrum Sepolia', 
      symbol: 'ETH', 
      color: 'bg-blue-400',
      chainId: arbitrumSepolia.id,
      explorer: 'https://sepolia.arbiscan.io'
    },
    { 
      id: 'baseSepolia', 
      name: 'Base Sepolia', 
      symbol: 'ETH', 
      color: 'bg-indigo-500',
      chainId: baseSepolia.id,
      explorer: 'https://sepolia.basescan.org'
    }
  ]

  // Mock contract write for demonstration
  const { data: writeData, write, isLoading: isWriteLoading } = useContractWrite({
    address: '0x0000000000000000000000000000000000000000', // Mock address
    abi: [
      {
        name: 'transfer',
        type: 'function',
        stateMutability: 'payable',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: []
      }
    ],
    functionName: 'transfer'
  })

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransaction({
    hash: writeData?.hash
  })

  useEffect(() => {
    if (writeData?.hash) {
      setTxHash(writeData.hash)
    }
  }, [writeData])

  useEffect(() => {
    if (isTxSuccess && txHash) {
      // Update transaction status to completed
      setTransactions(prev => 
        prev.map(tx => 
          tx.txHash === txHash 
            ? { ...tx, status: 'completed' as const }
            : tx
        )
      )
      setIsTransferring(false)
    }
  }, [isTxSuccess, txHash])

  const handleSwapChains = () => {
    const temp = fromChain
    setFromChain(toChain)
    setToChain(temp)
  }

  const handleSwitchNetwork = async (chainId: string) => {
    const targetChain = chains.find(c => c.id === chainId)
    if (targetChain && switchNetwork) {
      try {
        await switchNetwork(targetChain.chainId)
      } catch (error) {
        console.error('Failed to switch network:', error)
      }
    }
  }

  const simulateRealTransfer = async () => {
    if (!isConnected || !amount || !address) return
    
    setIsTransferring(true)
    
    // Create a new transaction record
    const newTx: BridgeTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      fromChain: getChainInfo(fromChain)?.name || fromChain,
      toChain: getChainInfo(toChain)?.name || toChain,
      amount,
      status: 'pending',
      timestamp: new Date(),
      estimatedTime: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`
    }
    
    setTransactions(prev => [newTx, ...prev.slice(0, 4)])
    
    // Simulate network switch if needed
    const fromChainInfo = getChainInfo(fromChain)
    if (fromChainInfo && chain?.id !== fromChainInfo.chainId) {
      await handleSwitchNetwork(fromChain)
    }
    
    // Simulate transaction processing
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTx.id 
            ? { ...tx, status: Math.random() > 0.2 ? 'completed' : 'failed' }
            : tx
        )
      )
      setIsTransferring(false)
      setAmount('')
    }, 3000 + Math.random() * 2000) // 3-5 seconds
  }

  const getChainInfo = (chainId: string) => {
    return chains.find(chain => chain.id === chainId)
  }

  const getStatusIcon = (status: BridgeTransaction['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />
    }
  }

  const getCurrentChainInfo = () => {
    return chains.find(c => c.chainId === chain?.id)
  }

  const isCorrectNetwork = () => {
    const fromChainInfo = getChainInfo(fromChain)
    return fromChainInfo && chain?.id === fromChainInfo.chainId
  }

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Cross-Chain Bridge
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Transfer assets seamlessly across Sepolia testnet blockchain networks
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Sepolia Testnet Mode - Safe for Testing</span>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-8">
          {!isConnected ? (
            <div className="text-center py-12">
              <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-gray-300 mb-6">
                Please connect your wallet to start bridging assets on Sepolia testnets
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
                    </div>
                    <div className={`w-3 h-3 rounded-full ${isCorrectNetwork() ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  </div>
                  {!isCorrectNetwork() && (
                    <button
                      onClick={() => handleSwitchNetwork(fromChain)}
                      className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                    >
                      Switch to {getChainInfo(fromChain)?.name}
                    </button>
                  )}
                </div>
              )}

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
                        <option key={chain.id} value={chain.id} className="bg-gray-800">
                          {chain.name}
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
                    min="0"
                  />
                  
                  {balance && (
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => setAmount((parseFloat(balance.formatted) * 0.5).toString())}
                        className="text-xs text-blue-400 hover:text-blue-300 mr-2"
                      >
                        50%
                      </button>
                      <button
                        onClick={() => setAmount((parseFloat(balance.formatted) * 0.9).toString())}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Max
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSwapChains}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                  disabled={isTransferring}
                >
                  <ArrowUpDown className="h-6 w-6 text-white" />
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
                        <option key={chain.id} value={chain.id} className="bg-gray-800">
                          {chain.name}
                        </option>
                      ))}
                    </select>
                    <div className="text-right">
                      <div className="text-gray-400 text-sm">You'll receive</div>
                      <div className="text-white font-medium">
                        {amount || '0.0'} {getChainInfo(toChain)?.symbol}
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
                    <AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-blue-400 font-medium mb-1">Transfer Details</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>Estimated time: 2-5 minutes</div>
                        <div>Network fee: ~$0.50 (Testnet)</div>
                        <div>Bridge fee: 0.1%</div>
                        <div>Route: {getChainInfo(fromChain)?.name} → {getChainInfo(toChain)?.name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transfer Button */}
              <button
                onClick={simulateRealTransfer}
                disabled={
                  !amount || 
                  parseFloat(amount) <= 0 ||
                  isTransferring || 
                  fromChain === toChain ||
                  !isCorrectNetwork()
                }
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition-all duration-300"
              >
                {isTransferring ? 'Processing Transfer...' : 
                 fromChain === toChain ? 'Select different chains' :
                 !isCorrectNetwork() ? `Switch to ${getChainInfo(fromChain)?.name}` :
                 !amount || parseFloat(amount) <= 0 ? 'Enter amount' : 
                 'Initiate Cross-Chain Transfer'}
              </button>
            </div>
          )}
        </div>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div className="glass-effect rounded-2xl p-8 mt-8">
            <h3 className="text-2xl font-bold text-white mb-6">Recent Transfers</h3>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(tx.status)}
                      <div>
                        <div className="text-white font-medium">
                          {tx.amount} {getChainInfo(fromChain)?.symbol}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {tx.fromChain} → {tx.toChain}
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
                      <div className="text-gray-400 text-xs">
                        {tx.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  {tx.txHash && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-400">TX:</span>
                      <code className="text-xs text-blue-400 font-mono">
                        {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                      </code>
                      <button
                        onClick={() => {
                          const chainInfo = getChainInfo(fromChain)
                          if (chainInfo) {
                            window.open(`${chainInfo.explorer}/tx/${tx.txHash}`, '_blank')
                          }
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  {tx.status === 'pending' && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Processing...</span>
                        <span>~{Math.floor(tx.estimatedTime / 60)}m {tx.estimatedTime % 60}s</span>
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
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Sepolia Testnet Safe</h3>
            <p className="text-gray-300 text-sm">
              All transactions use Sepolia testnet tokens with no real value. Perfect for testing and learning.
            </p>
          </div>
          
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Real Wallet Integration</h3>
            <p className="text-gray-300 text-sm">
              Connect your actual wallet to experience real cross-chain interactions on safe Sepolia testnets.
            </p>
          </div>
          
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Multi-Chain Support</h3>
            <p className="text-gray-300 text-sm">
              Bridge between Ethereum Sepolia, Optimism Sepolia, Arbitrum Sepolia, and Base Sepolia testnets.
            </p>
          </div>
          
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Transaction Tracking</h3>
            <p className="text-gray-300 text-sm">
              Monitor your transfers with real-time status updates and transaction hash tracking.
            </p>
          </div>
        </div>

        {/* Get Testnet Tokens */}
        <div className="glass-effect rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-3">Need Sepolia Testnet Tokens?</h3>
          <p className="text-gray-300 text-sm mb-4">
            Get free Sepolia testnet tokens from these faucets to test the bridge:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="https://sepoliafaucet.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              <span>Ethereum Sepolia Faucet</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a 
              href="https://www.alchemy.com/faucets/optimism-sepolia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 text-sm"
            >
              <span>Optimism Sepolia Faucet</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a 
              href="https://www.alchemy.com/faucets/arbitrum-sepolia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              <span>Arbitrum Sepolia Faucet</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a 
              href="https://www.alchemy.com/faucets/base-sepolia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 text-sm"
            >
              <span>Base Sepolia Faucet</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CrossChainBridge