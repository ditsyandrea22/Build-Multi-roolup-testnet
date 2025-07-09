export interface Chain {
  id: number;
  name: string;
  rpc: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer: string;
  icon: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  chainId: number;
}

export interface ProofRequest {
  id: string;
  txHash: string;
  sourceChain: number;
  targetChain: number;
  status: 'pending' | 'proven' | 'failed';
  timestamp: number;
}

export interface GasEstimate {
  gasPrice: string;
  gasLimit: string;
  estimatedCost: string;
  usdCost?: string;
}