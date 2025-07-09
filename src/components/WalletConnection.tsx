import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, ChevronDown, LogOut, Copy, Loader2 } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { SUPPORTED_CHAINS } from '../config/chains';

const WalletConnection: React.FC = () => {
  const { 
    address, 
    chainId, 
    balance, 
    isConnected, 
    isConnecting, 
    isSwitching,
    connectWallet, 
    switchChain, 
    disconnectWallet 
  } = useWallet();

  const currentChain = SUPPORTED_CHAINS.find(chain => chain.id === chainId);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  if (!isConnected) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={connectWallet}
        disabled={isConnecting}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wallet className="w-5 h-5" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </motion.button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
        <span className="text-2xl">{currentChain?.icon}</span>
        <select
          value={chainId}
          onChange={(e) => switchChain(parseInt(e.target.value))}
          disabled={isSwitching}
          className="bg-transparent text-white outline-none"
        >
          {SUPPORTED_CHAINS.map(chain => (
            <option key={chain.id} value={chain.id} className="bg-gray-800">
              {chain.name}
            </option>
          ))}
        </select>
        {isSwitching ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
        <div className="text-right">
          <div className="text-sm text-gray-400">Balance</div>
          <div className="text-white font-medium">
            {parseFloat(balance).toFixed(4)} {currentChain?.nativeCurrency.symbol}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
        <div className="text-right">
          <div className="text-sm text-gray-400">Address</div>
          <div className="text-white font-medium flex items-center gap-2">
            {address.slice(0, 6)}...{address.slice(-4)}
            <button onClick={copyAddress} className="p-1 hover:bg-gray-700 rounded">
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={disconnectWallet}
        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        <LogOut className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default WalletConnection;