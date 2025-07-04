import React from 'react'
import { ArrowRight, Zap, Network, Shield } from 'lucide-react'

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Build Apps.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Not Interop.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Improve Ethereum with Polymer's cross-chain infrastructure. 
            Focus on building amazing applications while we handle the complexity of interoperability.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105">
              <span>Start Building</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <button className="border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
              View Documentation
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="glass-effect rounded-xl p-6 card-hover">
            <Zap className="h-12 w-12 text-primary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-300">Sub-second cross-chain transactions with optimized routing</p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 card-hover">
            <Network className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Universal Connectivity</h3>
            <p className="text-gray-300">Connect any blockchain with our universal interoperability protocol</p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 card-hover">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Battle Tested</h3>
            <p className="text-gray-300">Audited smart contracts with proven security track record</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero