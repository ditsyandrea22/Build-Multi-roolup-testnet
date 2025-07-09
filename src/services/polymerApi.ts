import { POLYMER_API_BASE } from '../config/chains';
import { ProofRequest } from '../types';

export class PolymerApiService {
  private static async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${POLYMER_API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async submitProof(
    txHash: string,
    sourceChain: number,
    targetChain: number
  ): Promise<ProofRequest> {
    const response = await this.request('/prove', {
      method: 'POST',
      body: JSON.stringify({
        txHash,
        sourceChain,
        targetChain,
      }),
    });

    return {
      id: response.id,
      txHash,
      sourceChain,
      targetChain,
      status: 'pending',
      timestamp: Date.now(),
    };
  }

  static async getProofStatus(proofId: string): Promise<string> {
    const response = await this.request(`/prove/${proofId}`);
    return response.status;
  }

  static async getTransactionProof(txHash: string): Promise<any> {
    const response = await this.request(`/transaction/${txHash}/proof`);
    return response;
  }

  static async verifyProof(
    proofId: string,
    targetChain: number
  ): Promise<boolean> {
    const response = await this.request('/verify', {
      method: 'POST',
      body: JSON.stringify({
        proofId,
        targetChain,
      }),
    });

    return response.verified;
  }
}