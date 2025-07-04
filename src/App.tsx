import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import InteropDemo from './components/InteropDemo'
import CrossChainBridge from './components/CrossChainBridge'
import PolymerAtGlance from './components/PolymerAtGlance'
import MultiRollupApps from './components/MultiRollupApps'
import ChainAbstraction from './components/ChainAbstraction'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        />
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <PolymerAtGlance />
              <Features />
              <InteropDemo />
            </>
          } />
          <Route path="/bridge" element={<CrossChainBridge />} />
          <Route path="/multi-rollup" element={<MultiRollupApps />} />
          <Route path="/chain-abstraction" element={<ChainAbstraction />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App