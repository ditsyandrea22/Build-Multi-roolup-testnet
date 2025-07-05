import React from 'react'
import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Network, Zap } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-primary-300 transition-colors">
            <div className="flex items-center space-x-2">
              <Network className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">Ditsy Demo Labs</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-primary-300 transition-colors">
              Home
            </Link>
            <Link to="/bridge" className="text-white hover:text-primary-300 transition-colors">
              Bridge
            </Link>
            <Link to="/multi-rollup" className="text-white hover:text-primary-300 transition-colors">
              Multi-Rollup
            </Link>
            <Link to="/chain-abstraction" className="text-white hover:text-primary-300 transition-colors">
              Chain Abstraction
            </Link>
            <a 
              href="https://docs.polymerlabs.org/docs/build/start" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-primary-300 transition-colors"
            >
              Docs
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header