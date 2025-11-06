import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, Calendar, Star, ExternalLink, Github } from 'lucide-react';

const Launched: React.FC = () => {
  const navigate = useNavigate();

  const updates = [
    {
      version: "v2.1.0",
      date: "November 2024",
      title: "Enhanced AI Models & Team Collaboration",
      description: "New Claude integration, real-time collaboration features, and improved project management.",
      features: ["Claude API Integration", "Real-time Team Collaboration", "Enhanced Project Templates", "Performance Improvements"]
    },
    {
      version: "v2.0.0",
      date: "October 2024",
      title: "Major Platform Update",
      description: "Complete UI redesign, new workspace experience, and enterprise features.",
      features: ["New Workspace UI", "Enterprise Security", "Advanced Templates", "API Improvements"]
    },
    {
      version: "v1.5.0",
      date: "September 2024",
      title: "NVIDIA Integration & Templates",
      description: "Added NVIDIA API support and expanded our template library.",
      features: ["NVIDIA API Support", "React Templates", "Node.js Templates", "Bug Fixes"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#181818] to-[#ea8dcc] relative overflow-hidden" style={{
      background: 'radial-gradient(ellipse 160% 120% at top, #181919 0%, #181919 32%, #1e2961 45%, #4b75f4 58%, #7b82ea 68%, #ea8dcc 82%, #ff6b35 100%)'
    }}>
      {/* Grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply'
        }}
      />

      <div className="relative z-10 px-6 py-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <Rocket className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">What's New</h1>
          </div>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Stay up to date with the latest SiteSmith features, improvements, and announcements
          </p>
        </div>

        {/* Latest Release Highlight */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-8 h-8 text-yellow-400" />
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Latest Release
            </span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">SiteSmith v2.1.0 is Here!</h2>
          <p className="text-xl text-white/80 mb-6">
            Enhanced AI capabilities with Claude integration, real-time team collaboration, and improved performance.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
              <span className="text-white/90 font-medium">🤖 Claude API</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
              <span className="text-white/90 font-medium">👥 Team Collaboration</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
              <span className="text-white/90 font-medium">⚡ Performance Boost</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
              <span className="text-white/90 font-medium">🎨 New Templates</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium flex items-center gap-2 justify-center"
            >
              <Rocket className="w-5 h-5" />
              Try It Now
            </button>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center gap-2 justify-center">
              <ExternalLink className="w-5 h-5" />
              Release Notes
            </button>
          </div>
        </div>

        {/* Release History */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Release History</h2>
          
          <div className="space-y-8">
            {updates.map((update, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                        {update.version}
                      </span>
                      <div className="flex items-center gap-2 text-white/60">
                        <Calendar className="w-4 h-4" />
                        <span>{update.date}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{update.title}</h3>
                    <p className="text-white/70">{update.description}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {update.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3 text-white/80">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community & Social */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <Github className="w-12 h-12 text-white mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Open Source</h3>
            <p className="text-white/70 mb-6">
              SiteSmith is open source! Contribute to the project, report issues, or request features on GitHub.
            </p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium w-full flex items-center gap-2 justify-center">
              <a href="https://github.com/Mukul2956/Sitesmith" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center w-full h-full">
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <Rocket className="w-12 h-12 text-white mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Product Hunt</h3>
            <p className="text-white/70 mb-6">
              We launched on Product Hunt! Check out our page and see what the community is saying.
            </p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium w-full flex items-center gap-2 justify-center">
              <ExternalLink className="w-5 h-5" />
              View on Product Hunt
            </button>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-pink-600/20 to-orange-600/20 backdrop-blur-sm border border-pink-400/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Stay Updated</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest updates, feature announcements, and developer tips.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
            />
            <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Launched;