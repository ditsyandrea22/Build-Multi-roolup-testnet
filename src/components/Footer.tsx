import React from 'react'
import { Github, Twitter, MessageCircle, Book, ExternalLink } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Ditsy Demo Labs</h3>
            <p className="text-gray-300 text-sm mb-4">
              Building the future of cross-chain interoperability with Polymer Labs technology. 
              Focus on your app, we'll handle the infrastructure.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/ditsyandrea22/TESTNET" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/Crypto_ditsy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://docs.polymerlabs.org/docs/build/start" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Book className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">CrossL2Prover Bridge</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Multi-Rollup Apps</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Chain Abstraction</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">IBC Protocol</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Developers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://docs.polymerlabs.org/docs/build/start" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Documentation</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.polymerlabs.org/docs/build/quickstart" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Quick Start</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.polymerlabs.org/docs/build/examples" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Examples</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/open-ibc/ibc-app-solidity-template" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>IBC Template</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://polymerlabs.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Polymer Labs</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.polymerlabs.org/docs/learn/ibc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>IBC Protocol</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.polymerlabs.org/docs/learn/architecture" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Architecture</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://dashboard.polymerlabs.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Dashboard</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Ditsy Demo Labs. Built with ❤️ for the multi-chain future using Polymer Labs technology.
          </p>
          <div className="flex justify-center items-center space-x-4 mt-2">
            <a 
              href="https://github.com/ditsyandrea22/TESTNET" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-xs flex items-center space-x-1"
            >
              <Github className="h-3 w-3" />
              <span>Source Code</span>
            </a>
            <span className="text-gray-600">•</span>
            <a 
              href="https://polymerlabs.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-xs flex items-center space-x-1"
            >
              <Book className="h-3 w-3" />
              <span>Polymer Labs</span>
            </a>
            <span className="text-gray-600">•</span>
            <a 
              href="https://x.com/Polymer_Labs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-xs flex items-center space-x-1"
            >
              <Twitter className="h-3 w-3" />
              <span>@Polymer_Labs</span>
            </a>
            <span className="text-gray-600">•</span>
            <a 
              href="https://x.com/Crypto_ditsy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-xs flex items-center space-x-1"
            >
              <Twitter className="h-3 w-3" />
              <span>@Crypto_ditsy</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer