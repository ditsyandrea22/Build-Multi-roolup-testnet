import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { ProofRequest } from '../types';
import { MockPolymerApiService } from '../services/mockPolymerApi';
import { SUPPORTED_CHAINS } from '../config/chains';

interface ProofStatusProps {
  proofRequests: ProofRequest[];
  onStatusUpdate: (proofId: string, status: string) => void;
}

const ProofStatus: React.FC<ProofStatusProps> = ({ proofRequests, onStatusUpdate }) => {
  const [loadingProofs, setLoadingProofs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      proofRequests.forEach(async (proof) => {
        if (proof.status === 'pending' && !loadingProofs.has(proof.id)) {
          setLoadingProofs(prev => new Set(prev).add(proof.id));
          try {
            const status = await MockPolymerApiService.getProofStatus(proof.id);
            onStatusUpdate(proof.id, status);
          } catch (error) {
            console.error('Failed to get proof status:', error);
          } finally {
            setLoadingProofs(prev => {
              const newSet = new Set(prev);
              newSet.delete(proof.id);
              return newSet;
            });
          }
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [proofRequests, loadingProofs, onStatusUpdate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />;
      case 'proven':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'proven':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getChainName = (chainId: number) => {
    return SUPPORTED_CHAINS.find(chain => chain.id === chainId)?.name || 'Unknown';
  };

  const getBlockExplorer = (chainId: number, txHash: string) => {
    const chain = SUPPORTED_CHAINS.find(chain => chain.id === chainId);
    return chain ? `${chain.blockExplorer}/tx/${txHash}` : '#';
  };

  if (proofRequests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-gray-800 rounded-xl border border-gray-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Test Proof Status</h3>
          <div className="text-xs text-gray-400 ml-2">
            Testnet environment
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">No test proofs yet</div>
          <div className="text-sm text-gray-500">Submit a test transaction to see proof status</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-800 rounded-xl border border-gray-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">Proof Status</h3>
      </div>

      <div className="space-y-4">
        {proofRequests.map((proof) => (
          <motion.div
            key={proof.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-gray-700 rounded-lg border border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(proof.status)}
                <span className={`font-medium ${getStatusColor(proof.status)}`}>
                  {proof.status.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(proof.timestamp).toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">From Chain</div>
                <div className="text-white">{getChainName(proof.sourceChain)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">To Chain</div>
                <div className="text-white">{getChainName(proof.targetChain)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">TX:</span>
                <span className="text-white font-mono text-sm">
                  {proof.txHash.slice(0, 10)}...{proof.txHash.slice(-8)}
                </span>
              </div>
              <a
                href={getBlockExplorer(proof.sourceChain, proof.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View
              </a>
            </div>

            {proof.status === 'proven' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-3 bg-green-900/20 border border-green-500 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">
                    Proof verified successfully!
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProofStatus;