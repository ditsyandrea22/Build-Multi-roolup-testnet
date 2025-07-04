import { ethers } from 'ethers'
import { POLYMER_CONFIG, PROVER_CONTRACT_ABI } from '../config/polymer'
import toast from 'react-hot-toast'

export interface ProverReturn {
  valid: boolean
  blockHash: string
  merkleRoot: string
  timestamp: number
  proofData: string
}

export class ProverContractService {
  private contract: ethers.Contract | null = null
  private provider: ethers.Provider | null = null

  constructor(provider?: ethers.Provider) {
    if (provider) {
      this.provider = provider
      this.initializeContract()
    }
  }

  private initializeContract() {
    if (!this.provider) return
    
    this.contract = new ethers.Contract(
      POLYMER_CONFIG.PROVER_CONTRACT,
      PROVER_CONTRACT_ABI,
      this.provider
    )
  }

  async verifyProof(proof: string, publicInputs: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Prover contract not initialized')
    }

    try {
      const result = await this.contract.verifyProof(proof, publicInputs)
      return result
    } catch (error: any) {
      console.error('Proof verification failed:', error)
      toast.error('Proof verification failed')
      throw error
    }
  }

  async updateBlockHash(
    blockHash: string,
    blockNumber: number,
    signer: ethers.Signer
  ): Promise<string> {
    if (!this.contract) {
      throw new Error('Prover contract not initialized')
    }

    try {
      const contractWithSigner = this.contract.connect(signer)
      const tx = await contractWithSigner.updateBlockHash(blockHash, blockNumber)
      
      toast.success('Block hash update submitted')
      return tx.hash
    } catch (error: any) {
      console.error('Block hash update failed:', error)
      toast.error('Block hash update failed')
      throw error
    }
  }

  async getLatestBlockHash(): Promise<string> {
    if (!this.contract) {
      throw new Error('Prover contract not initialized')
    }

    try {
      const blockHash = await this.contract.getLatestBlockHash()
      return blockHash
    } catch (error: any) {
      console.error('Failed to get latest block hash:', error)
      throw error
    }
  }

  // Decode prover return data
  decodeProverReturn(returnData: string): ProverReturn {
    try {
      // Decode the return data from the prover
      const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
        ['bool', 'bytes32', 'bytes32', 'uint256', 'bytes'],
        returnData
      )

      return {
        valid: decoded[0],
        blockHash: decoded[1],
        merkleRoot: decoded[2],
        timestamp: Number(decoded[3]),
        proofData: decoded[4]
      }
    } catch (error: any) {
      console.error('Failed to decode prover return:', error)
      throw new Error('Invalid prover return data')
    }
  }

  // TRON proving integration
  async proveTronTransaction(
    txHash: string,
    blockNumber: number
  ): Promise<ProverReturn> {
    try {
      // TRON-specific proving logic
      const tronProof = await this.generateTronProof(txHash, blockNumber)
      
      return {
        valid: true,
        blockHash: tronProof.blockHash,
        merkleRoot: tronProof.merkleRoot,
        timestamp: Date.now(),
        proofData: tronProof.proof
      }
    } catch (error: any) {
      console.error('TRON proving failed:', error)
      throw error
    }
  }

  private async generateTronProof(txHash: string, blockNumber: number) {
    // Mock TRON proof generation
    // In real implementation, this would interact with TRON network
    return {
      blockHash: ethers.keccak256(ethers.toUtf8Bytes(`tron-block-${blockNumber}`)),
      merkleRoot: ethers.keccak256(ethers.toUtf8Bytes(`tron-merkle-${txHash}`)),
      proof: ethers.hexlify(ethers.randomBytes(256))
    }
  }
}

export const proverContract = new ProverContractService()