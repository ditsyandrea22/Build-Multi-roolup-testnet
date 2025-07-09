import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { useGasEstimate } from '../hooks/useGasEstimate';
import { SUPPORTED_CHAINS } from '../config/chains';
import ChainSelector from './ChainSelector';

interface TransactionFormProps {
  onTransaction: (txHash: string, sourceChain: number, targetChain: number) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onTransaction }) => {
  const { provider, signer, chainId, address, switchChain, isSwitching } = useWallet();
  const [sourceChain, setSourceChain] = useState(chainId || 11155111);
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [targetChain, setTargetChain] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Update source chain when wallet chain changes
  useEffect(() => {
    if (chainId && chainId !== sourceChain) {
      setSourceChain(chainId);
    }
  }, [chainId]);

  const { gasEstimate, isLoading: isGasLoading, error: gasError } = useGasEstimate(
    provider,
    to,
    value,
    address
  );

  const handleSourceChainChange = async (newChainId: number) => {
    setSourceChain(newChainId);
    if (chainId !== newChainId) {
      const success = await switchChain(newChainId);
      if (!success) {
        setError('Failed to switch chain. Please try manually switching in your wallet.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !to || !value || !targetChain) return;

    // Ensure we're on the correct source chain
    if (chainId !== sourceChain) {
      const success = await switchChain(sourceChain);
      if (!success) {
        setError('Please switch to the correct source chain first.');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    try {
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(value),
        gasLimit: gasEstimate?.gasLimit || '21000',
        gasPrice: gasEstimate?.gasPrice || ethers.parseUnits('20', 'gwei')
      });

      await tx.wait();
      onTransaction(tx.hash, sourceChain, targetChain);
      
      // Reset form
      setTo('');
      setValue('');
      setTargetChain(0);
    } catch (error: any) {
      if (error.code === 'INSUFFICIENT_FUNDS') {
        setError('Insufficient funds for transaction and gas fees');
      } else if (error.code === 'USER_REJECTED') {
        setError('Transaction was rejected by user');
      } else {
        setError(error.message || 'Transaction failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSourceChain = SUPPORTED_CHAINS.find(chain => chain.id === sourceChain);
  const currentTargetChain = SUPPORTED_CHAINS.find(chain => chain.id === targetChain);
  const isWrongChain = chainId !== sourceChain;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-gray-800 rounded-xl border border-gray-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <Send className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">Cross-Chain Transaction</h3>
        <div className="text-xs text-gray-400 mt-1">
          Test cross-rollup transactions • Follow{' '}
          <a 
            href="https://x.com/Polymer_Labs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            @Polymer_Labs
          </a>{' '}
          for updates
        </div>
      </div>

      {/* Chain Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            From Chain
          </label>
          <ChainSelector
            selectedChain={sourceChain}
            onChainSelect={handleSourceChainChange}
            excludeChain={targetChain}
          />
        </div>

        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </motion.div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            To Chain
          </label>
          <ChainSelector
            selectedChain={targetChain}
            onChainSelect={setTargetChain}
            excludeChain={sourceChain}
          />
        </div>
      </div>

      {/* Chain Status Indicator */}
      {isWrongChain && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">
                Switch to {currentSourceChain?.name} to continue
              </span>
            </div>
            {isSwitching && (
              <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
            )}
          </div>
        </motion.div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Recipient Address
        </label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="0x..."
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Amount ({currentSourceChain?.nativeCurrency.symbol})
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0.001"
          step="0.001"
          min="0"
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      {/* Gas Estimation */}
      {gasEstimate && !isWrongChain && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-gray-700 rounded-lg"
        >
          <h4 className="text-sm font-medium text-gray-300 mb-2">Gas Estimation</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Gas Price:</span>
              <span className="text-white">{ethers.formatUnits(gasEstimate.gasPrice, 'gwei')} Gwei</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gas Limit:</span>
              <span className="text-white">{gasEstimate.gasLimit}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-gray-400">Estimated Cost:</span>
              <span className="text-white">{parseFloat(gasEstimate.estimatedCost).toFixed(6)} ETH</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Gas Error */}
      {gasError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 p-3 bg-orange-900/20 border border-orange-500 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-orange-400" />
          <span className="text-orange-400 text-sm">{gasError}</span>
        </motion.div>
      )}

      {/* Transaction Preview */}
      {sourceChain && targetChain && currentSourceChain && currentTargetChain && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg"
        >
          <h4 className="text-sm font-medium text-purple-300 mb-2">Transaction Preview</h4>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentSourceChain.icon}</span>
              <span className="text-white">{currentSourceChain.name}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentTargetChain.icon}</span>
              <span className="text-white">{currentTargetChain.name}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* General Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400 text-sm">{error}</span>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={
          isSubmitting || 
          isGasLoading || 
          isSwitching ||
          !to || 
          !value || 
          !targetChain || 
          isWrongChain ||
          !!gasError
        }
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Transaction...
          </>
        ) : isSwitching ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Switching Chain...
          </>
        ) : isWrongChain ? (
          <>
            <AlertCircle className="w-5 h-5" />
            Switch to {currentSourceChain?.name}
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Transaction
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default TransactionForm;