import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MessageSquare, Github, MessageCircle } from 'lucide-react';

const Community: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#181818] via-[#3843dc] via-[#7b82ea] to-[#ea8dcc] relative overflow-hidden" style={{
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

      <div className="relative z-10 px-6 py-8 max-w-4xl mx-auto">
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
            <Users className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">Community</h1>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join the SiteSmith community and connect with developers, share projects, and get help
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <Github className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-bold text-white">GitHub</h3>
            </div>
            <p className="text-white/70 mb-6">
              Contribute to the open-source project, report issues, and request new features.
            </p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              <a href="https://github.com/Mukul2956/Sitesmith" target="_blank" rel="noopener noreferrer" className="block w-full h-full">Visit Repository</a>
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-bold text-white">Discord</h3>
            </div>
            <p className="text-white/70 mb-6">
              Chat with other developers, share your projects, and get real-time help.
            </p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Join Discord
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-bold text-white">Discussions</h3>
            </div>
            <p className="text-white/70 mb-6">
              Participate in community discussions, share tips, and learn from others.
            </p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Join Discussions
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <Users className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-bold text-white">Showcase</h3>
            </div>
            <p className="text-white/70 mb-6">
              Show off your amazing projects built with SiteSmith and get inspired by others.
            </p>
            <button 
              className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              onClick={() => navigate('/', { state: { scrollTo: 'recent-projects' } })}
            >
              View Showcase
            </button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Join Our Community</h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Whether you're a beginner or an expert, everyone is welcome! Share your projects, 
              get help, and help others in the SiteSmith community.
            </p>
            <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-all font-medium">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;