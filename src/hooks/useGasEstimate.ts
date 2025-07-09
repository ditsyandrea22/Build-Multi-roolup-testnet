import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { GasEstimate } from '../types';

export const useGasEstimate = (
  provider: ethers.BrowserProvider | null,
  to: string,
  value: string,
  from?: string
) => {
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!provider || !to || !value || !from) {
      setGasEstimate(null);
      setError(null);
      return;
    }

    const estimateGas = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if the value is valid
        const valueInWei = ethers.parseEther(value);
        
        // Get current balance
        const balance = await provider.getBalance(from);
        
        // Get gas price first
        const feeData = await provider.getFeeData();
        const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei');
        
        // Estimate gas limit
        const gasLimit = await provider.estimateGas({
          from,
          to,
          value: valueInWei
        });

        const estimatedCost = gasPrice * gasLimit;
        const totalCost = valueInWei + estimatedCost;
        
        // Check if user has sufficient funds
        if (balance < totalCost) {
          setError(`Insufficient funds. Need ${ethers.formatEther(totalCost)} ETH, but have ${ethers.formatEther(balance)} ETH`);
          setGasEstimate(null);
          return;
        }
        
        setGasEstimate({
          gasPrice: gasPrice.toString(),
          gasLimit: gasLimit.toString(),
          estimatedCost: ethers.formatEther(estimatedCost)
        });
      } catch (error: any) {
        console.error('Gas estimation failed:', error);
        
        if (error.code === 'INSUFFICIENT_FUNDS') {
          setError('Insufficient funds for transaction');
        } else if (error.code === 'INVALID_ARGUMENT') {
          setError('Invalid transaction parameters');
        } else {
          setError('Gas estimation failed. Please check your inputs.');
        }
        
        setGasEstimate(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the gas estimation
    const timeoutId = setTimeout(estimateGas, 500);
    return () => clearTimeout(timeoutId);
  }, [provider, to, value, from]);

  return { gasEstimate, isLoading, error };
};