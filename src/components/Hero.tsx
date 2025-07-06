import React from 'react'
import { ArrowRight, Zap, Network, Shield, ExternalLink } from 'lucide-react'

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <div className="animate-fade-in">
          <div className="mb-4">
            <span className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 text-purple-400 text-sm font-medium">
              <Network className="h-4 w-4" />
              <span>Powered by Polymer Labs Technology</span>
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Build Apps.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Not Interop.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience Ethereum cross-chain infrastructure with Ditsy Demo Labs. 
            Focus on building amazing applications while we demonstrate the power of interoperability.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a
              href="https://docs.polymerlabs.org/docs/build/start"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
            >
              <span>Start Building</span>
              <ArrowRight className="h-5 w-5" />
            </a>
            
            <a
              href="https://docs.polymerlabs.org/docs/build/quickstart"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Quick Start Guide</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="glass-effect rounded-xl p-6 card-hover">
            <Zap className="h-12 w-12 text-primary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">CrossL2Prover</h3>
            <p className="text-gray-300">Real cryptographic proof generation for secure cross-chain transfers</p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 card-hover">
            <Network className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">IBC Protocol</h3>
            <p className="text-gray-300">Inter-Blockchain Communication protocol for universal interoperability</p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 card-hover">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Testnet Safe</h3>
            <p className="text-gray-300">Safe testing environment with real wallet integration</p>
          </div>
        </div>

        {/* What is Polymer Labs Section */}
        <div className="mt-20 glass-effect rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">What is Polymer Labs?</h2>
          <div className="max-w-4xl mx-auto text-left">
            <p className="text-lg text-gray-300 mb-6">
              Polymer Labs is building the universal interoperability layer for Ethereum and beyond. 
              Our mission is to enable seamless communication between all blockchains through the 
              Inter-Blockchain Communication (IBC) protocol.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">🌐 Universal Connectivity</h3>
                <p className="text-gray-300">
                  Connect any blockchain to any other blockchain with standardized, secure messaging protocols.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">🔒 Security First</h3>
                <p className="text-gray-300">
                  Built on battle-tested IBC protocol with cryptographic proofs and formal verification.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">⚡ Developer Experience</h3>
                <p className="text-gray-300">
                  Simple APIs and SDKs that abstract away the complexity of cross-chain development.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">🚀 Production Ready</h3>
                <p className="text-gray-300">
                  Powering real applications with millions of cross-chain transactions processed.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://polymerlabs.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Learn More</span>
                <ExternalLink className="h-4 w-4" />
              </a>
              
              <a
                href="https://dashboard.polymerlabs.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-lg px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span>Dashboard</span>
                <ExternalLink className="h-4 w-4" />
              </a>
              
              <a
                href="https://x.com/Polymer_Labs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <span>Follow Updates</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Links to Resources */}
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          <a
            href="https://docs.polymerlabs.org/docs/learn/what-is-polymer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            <span>Learn about Polymer</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://docs.polymerlabs.org/docs/build/examples"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm transition-colors"
          >
            <span>View Examples</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://github.com/open-ibc/ibc-app-solidity-template"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-green-400 hover:text-green-300 text-sm transition-colors"
          >
            <span>IBC Solidity Template</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://github.com/ditsyandrea22/TESTNET"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero