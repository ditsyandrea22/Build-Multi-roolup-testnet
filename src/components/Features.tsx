import React from 'react'
import { Code, Layers, Cpu, Globe, Lock, Rocket } from 'lucide-react'

const features = [
  {
    icon: Code,
    title: 'Developer First',
    description: 'Simple APIs and SDKs that abstract away the complexity of cross-chain development',
    color: 'text-blue-400'
  },
  {
    icon: Layers,
    title: 'Multi-Chain Support',
    description: 'Native support for Ethereum, Polygon, Optimism, Arbitrum, and more chains',
    color: 'text-purple-400'
  },
  {
    icon: Cpu,
    title: 'High Performance',
    description: 'Optimized for speed with minimal latency and maximum throughput',
    color: 'text-green-400'
  },
  {
    icon: Globe,
    title: 'Universal Protocol',
    description: 'One protocol to connect all blockchains with standardized messaging',
    color: 'text-yellow-400'
  },
  {
    icon: Lock,
    title: 'Security First',
    description: 'End-to-end encryption and formal verification of all protocol components',
    color: 'text-red-400'
  },
  {
    icon: Rocket,
    title: 'Production Ready',
    description: 'Battle-tested infrastructure powering millions of cross-chain transactions',
    color: 'text-indigo-400'
  }
]

const Features: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose Polymer?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Built by developers, for developers. Polymer provides the infrastructure 
            you need to build the next generation of cross-chain applications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-effect rounded-xl p-8 card-hover animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon className={`h-12 w-12 ${feature.color} mb-6`} />
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features