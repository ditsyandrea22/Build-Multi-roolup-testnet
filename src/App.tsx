import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Activity, TrendingUp, Users, Github, Twitter, MessageCircle } from 'lucide-react';
import WalletConnection from './components/WalletConnection';
import TransactionForm from './components/TransactionForm';
import ProofStatus from './components/ProofStatus';
import StatsCard from './components/StatsCard';
import { ProofRequest } from './types';
import { MockPolymerApiService } from './services/mockPolymerApi';

function App() {
  const [proofRequests, setProofRequests] = useState<ProofRequest[]>([]);

  const handleTransaction = async (
    txHash: string,
    sourceChain: number,
    targetChain: number
  ) => {
    try {
      const proof = await MockPolymerApiService.submitProof(txHash, sourceChain, targetChain);
      setProofRequests(prev => [...prev, proof]);
    } catch (error) {
      console.error('Failed to submit proof:', error);
    }
  };

  const handleStatusUpdate = (proofId: string, status: string) => {
    setProofRequests(prev =>
      prev.map(proof =>
        proof.id === proofId
          ? { ...proof, status: status as 'pending' | 'proven' | 'failed' }
          : proof
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Ditsy Build</h1>
                <p className="text-sm text-gray-400">Multi-Rollup Testnet</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/ditsyandrea22/Build-Multi-roolup-testnet"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Github className="w-5 h-5 text-white" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://x.com/Polymer_Labs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://discord.gg/Bampeyqx"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-indigo-400" />
              </motion.a>
            </div>
            <WalletConnection />
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white mb-6"
          >
            Multi-Rollup Testnet
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {' '}Platform
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8"
          >
            Test and deploy across multiple rollups with seamless cross-chain communication,
            zero-knowledge proofs, and secure multi-rollup transactions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Multi-Rollup Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Testnet Environment</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Cross-Chain Testing</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard
              icon={Activity}
              title="Testnet Chains"
              value="6"
              change="+2"
            />
            <StatsCard
              icon={TrendingUp}
              title="Test Transactions"
              value={proofRequests.length.toString()}
              change="+12%"
            />
            <StatsCard
              icon={Users}
              title="Test Success Rate"
              value="99.9%"
              change="+0.1%"
            />
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TransactionForm onTransaction={handleTransaction} />
          <ProofStatus
            proofRequests={proofRequests}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Ditsy Build</span>
              <span className="text-gray-400 text-sm">• Multi-Rollup Testnet</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a 
                href="https://github.com/ditsyandrea22/Build-Multi-roolup-testnet" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a href="https://docs.polymerlabs.org" className="hover:text-white transition-colors">
                Polymer Docs
              </a>
              <a 
                href="https://x.com/Polymer_Labs" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <Twitter className="w-4 h-4" />
                Updates
              </a>
              <a 
                href="https://discord.gg/Bampeyqx" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                Community
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Built for testing multi-rollup applications</span>
              <span>Follow @Polymer_Labs for protocol updates</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;