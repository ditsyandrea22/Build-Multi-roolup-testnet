import { ProofRequest } from '../types';

// Mock API service for Ditsy Build testnet environment
// Simulates cross-rollup proof generation and verification
export class MockPolymerApiService {
  private static proofs: Map<string, ProofRequest> = new Map();
  private static proofCounter = 1;

  private static generateId(): string {
    return `proof_${this.proofCounter++}_${Date.now()}`;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async submitProof(
    txHash: string,
    sourceChain: number,
    targetChain: number
  ): Promise<ProofRequest> {
    // Simulate API delay
    await this.delay(500);

    const proofRequest: ProofRequest = {
      id: this.generateId(),
      txHash,
      sourceChain,
      targetChain,
      status: 'pending',
      timestamp: Date.now(),
    };

    this.proofs.set(proofRequest.id, proofRequest);

    // Simulate proof processing - update status after a delay
    setTimeout(() => {
      const proof = this.proofs.get(proofRequest.id);
      if (proof) {
        // Randomly succeed or fail for demo purposes
        proof.status = Math.random() > 0.2 ? 'proven' : 'failed';
        this.proofs.set(proofRequest.id, proof);
      }
    }, 3000 + Math.random() * 2000); // 3-5 seconds

    return proofRequest;
  }

  static async getProofStatus(proofId: string): Promise<string> {
    await this.delay(200);
    
    const proof = this.proofs.get(proofId);
    return proof?.status || 'not_found';
  }

  static async getTransactionProof(txHash: string): Promise<any> {
    await this.delay(300);
    
    return {
      txHash,
      proof: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      merkleRoot: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      timestamp: Date.now(),
    };
  }

  static async verifyProof(
    proofId: string,
    targetChain: number
  ): Promise<boolean> {
    await this.delay(400);
    
    const proof = this.proofs.get(proofId);
    return proof?.status === 'proven';
  }

  // Helper method to get all proofs (for development/debugging)
  static getAllProofs(): ProofRequest[] {
    return Array.from(this.proofs.values());
  }
}