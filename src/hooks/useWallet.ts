import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Chain } from '../types';
import { SUPPORTED_CHAINS } from '../config/chains';

export const useWallet = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string>('');
  const [chainId, setChainId] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const [isSwitching, setIsSwitching] = useState(false);

  const updateBalance = async (provider: ethers.BrowserProvider, address: string) => {
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Failed to update balance:', error);
      setBalance('0');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        setProvider(provider);
        setSigner(signer);
        setAddress(address);
        setChainId(Number(network.chainId));
        setIsConnected(true);
        
        await updateBalance(provider, address);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchChain = async (targetChainId: number) => {
    if (!window.ethereum || isSwitching) return false;

    const chain = SUPPORTED_CHAINS.find(c => c.id === targetChainId);
    if (!chain) return false;

    setIsSwitching(true);
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: chain.name,
              rpcUrls: [chain.rpc],
              nativeCurrency: chain.nativeCurrency,
              blockExplorerUrls: [chain.blockExplorer]
            }],
          });
          
          return true;
        } catch (addError) {
          console.error('Failed to add chain:', addError);
          return false;
        }
      } else {
        console.error('Failed to switch chain:', error);
        return false;
      }
    } finally {
      setIsSwitching(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress('');
    setChainId(0);
    setIsConnected(false);
    setBalance('0');
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      };

      const handleChainChanged = async (chainId: string) => {
        // Reinitialize the entire wallet connection when chain changes
        // This ensures the provider and signer are fresh for the new network
        await connectWallet();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeAllListeners();
        }
      };
    }
  }, [provider, address]);

  return {
    provider,
    signer,
    address,
    chainId,
    isConnected,
    isConnecting,
    balance,
    isSwitching,
    connectWallet,
    switchChain,
    disconnectWallet
  };
};