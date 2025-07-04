import { ethers } from 'ethers'
import { POLYMER_CONFIG, POLYMER_INTEROP_ABI } from '../config/polymer'
import toast from 'react-hot-toast'

export interface IbcPacket {
  sequence: number
  sourcePort: string
  sourceChannel: string
  destinationPort: string
  destinationChannel: string
  data: string
  timeoutHeight: number
  timeoutTimestamp: number
}

export interface ChannelInfo {
  state: number
  ordering: number
  counterparty: {
    portId: string
    channelId: string
  }
  connectionHops: string[]
  version: string
}

export class InteropContractService {
  private contracts: Map<string, ethers.Contract> = new Map()
  private provider: ethers.Provider | null = null

  constructor(provider?: ethers.Provider) {
    if (provider) {
      this.provider = provider
      this.initializeContracts()
    }
  }

  private initializeContracts() {
    if (!this.provider) return

    Object.entries(POLYMER_CONFIG.NETWORKS).forEach(([key, network]) => {
      const contract = new ethers.Contract(
        network.polymerHub,
        POLYMER_INTEROP_ABI,
        this.provider
      )
      this.contracts.set(network.name, contract)
    })
  }

  async sendPacket(
    chainName: string,
    packet: IbcPacket,
    signer: ethers.Signer
  ): Promise<string> {
    const contract = this.contracts.get(chainName)
    if (!contract) {
      throw new Error(`Contract not found for chain: ${chainName}`)
    }

    try {
      const contractWithSigner = contract.connect(signer)
      const packetBytes = this.encodePacket(packet)
      
      const tx = await contractWithSigner.sendPacket(packetBytes)
      toast.success('Packet sent successfully')
      return tx.hash
    } catch (error: any) {
      console.error('Send packet failed:', error)
      toast.error('Failed to send packet')
      throw error
    }
  }

  async recvPacket(
    chainName: string,
    packet: IbcPacket,
    proof: string,
    proofHeight: number,
    signer: ethers.Signer
  ): Promise<string> {
    const contract = this.contracts.get(chainName)
    if (!contract) {
      throw new Error(`Contract not found for chain: ${chainName}`)
    }

    try {
      const contractWithSigner = contract.connect(signer)
      const packetBytes = this.encodePacket(packet)
      
      const tx = await contractWithSigner.recvPacket(
        packetBytes,
        proof,
        proofHeight
      )
      
      toast.success('Packet received successfully')
      return tx.hash
    } catch (error: any) {
      console.error('Receive packet failed:', error)
      toast.error('Failed to receive packet')
      throw error
    }
  }

  async acknowledgePacket(
    chainName: string,
    packet: IbcPacket,
    acknowledgement: string,
    proof: string,
    proofHeight: number,
    signer: ethers.Signer
  ): Promise<string> {
    const contract = this.contracts.get(chainName)
    if (!contract) {
      throw new Error(`Contract not found for chain: ${chainName}`)
    }

    try {
      const contractWithSigner = contract.connect(signer)
      const packetBytes = this.encodePacket(packet)
      
      const tx = await contractWithSigner.acknowledgePacket(
        packetBytes,
        acknowledgement,
        proof,
        proofHeight
      )
      
      toast.success('Packet acknowledged successfully')
      return tx.hash
    } catch (error: any) {
      console.error('Acknowledge packet failed:', error)
      toast.error('Failed to acknowledge packet')
      throw error
    }
  }

  async timeoutPacket(
    chainName: string,
    packet: IbcPacket,
    proof: string,
    proofHeight: number,
    signer: ethers.Signer
  ): Promise<string> {
    const contract = this.contracts.get(chainName)
    if (!contract) {
      throw new Error(`Contract not found for chain: ${chainName}`)
    }

    try {
      const contractWithSigner = contract.connect(signer)
      const packetBytes = this.encodePacket(packet)
      
      const tx = await contractWithSigner.timeoutPacket(
        packetBytes,
        proof,
        proofHeight
      )
      
      toast.success('Packet timeout processed')
      return tx.hash
    } catch (error: any) {
      console.error('Timeout packet failed:', error)
      toast.error('Failed to process packet timeout')
      throw error
    }
  }

  async getChannel(
    chainName: string,
    channelId: string,
    portId: string
  ): Promise<ChannelInfo> {
    const contract = this.contracts.get(chainName)
    if (!contract) {
      throw new Error(`Contract not found for chain: ${chainName}`)
    }

    try {
      const result = await contract.getChannel(channelId, portId)
      return {
        state: result.state,
        ordering: result.ordering,
        counterparty: result.counterparty,
        connectionHops: result.connectionHops,
        version: result.version
      }
    } catch (error: any) {
      console.error('Get channel failed:', error)
      throw error
    }
  }

  private encodePacket(packet: IbcPacket): string {
    return ethers.AbiCoder.defaultAbiCoder().encode(
      ['uint64', 'string', 'string', 'string', 'string', 'bytes', 'uint64', 'uint64'],
      [
        packet.sequence,
        packet.sourcePort,
        packet.sourceChannel,
        packet.destinationPort,
        packet.destinationChannel,
        packet.data,
        packet.timeoutHeight,
        packet.timeoutTimestamp
      ]
    )
  }

  decodePacket(packetBytes: string): IbcPacket {
    const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
      ['uint64', 'string', 'string', 'string', 'string', 'bytes', 'uint64', 'uint64'],
      packetBytes
    )

    return {
      sequence: Number(decoded[0]),
      sourcePort: decoded[1],
      sourceChannel: decoded[2],
      destinationPort: decoded[3],
      destinationChannel: decoded[4],
      data: decoded[5],
      timeoutHeight: Number(decoded[6]),
      timeoutTimestamp: Number(decoded[7])
    }
  }
}

export const interopContract = new InteropContractService()