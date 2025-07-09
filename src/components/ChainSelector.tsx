import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SUPPORTED_CHAINS } from '../config/chains';

interface ChainSelectorProps {
  selectedChain: number;
  onChainSelect: (chainId: number) => void;
  excludeChain?: number;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({
  selectedChain,
  onChainSelect,
  excludeChain
}) => {
  const availableChains = SUPPORTED_CHAINS.filter(
    chain => chain.id !== excludeChain
  );

  const currentChain = SUPPORTED_CHAINS.find(chain => chain.id === selectedChain);

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-3 px-4 py-3 bg-gray-700 rounded-lg cursor-pointer border border-gray-600 hover:border-purple-500 transition-colors"
      >
        {currentChain ? (
          <>
            <span className="text-2xl">{currentChain.icon}</span>
            <div className="flex-1">
              <div className="text-white font-medium">{currentChain.name}</div>
              <div className="text-gray-400 text-sm">{currentChain.nativeCurrency.symbol}</div>
            </div>
          </>
        ) : (
          <div className="text-gray-400">Select a chain</div>
        )}
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </motion.div>

      <select
        value={selectedChain}
        onChange={(e) => onChainSelect(parseInt(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        <option value={0}>Select chain</option>
        {availableChains.map(chain => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChainSelector;