import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Video, Code, Users, FileText, Lightbulb } from 'lucide-react';

const Learn: React.FC = () => {
  const navigate = useNavigate();

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
            <BookOpen className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">Learn</h1>
          </div>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Master SiteSmith and AI-powered development with our comprehensive learning resources
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Getting Started */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <Lightbulb className="w-12 h-12 text-yellow-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Getting Started</h3>
            <p className="text-white/70 mb-6">
              Learn the basics of SiteSmith and create your first AI-generated application.
            </p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium w-full">
              Start Tutorial
            </button>
          </div>

          {/* Video Tutorials */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <Video className="w-12 h-12 text-red-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Video Tutorials</h3>
            <p className="text-white/70 mb-6">
              Watch step-by-step video guides covering all SiteSmith features and best practices.
            </p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium w-full">
              Watch Videos
            </button>
          </div>

          {/* Code Examples */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <Code className="w-12 h-12 text-green-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Code Examples</h3>
            <p className="text-white/70 mb-6">
              Explore real-world examples and templates to jumpstart your projects.
            </p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium w-full">
              Browse Examples
            </button>
          </div>

          {/* Documentation */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <FileText className="w-12 h-12 text-blue-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Documentation</h3>
            <p className="text-white/70 mb-6">
              Comprehensive API reference and detailed guides for advanced usage.
            </p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium w-full">
              Read Docs
            </button>
          </div>

          {/* Community */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <Users className="w-12 h-12 text-purple-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Community</h3>
            <p className="text-white/70 mb-6">
              Connect with other developers, share knowledge, and get help from the community.
            </p>
            <button 
              onClick={() => navigate('/community')}
              className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium w-full"
            >
              Join Community
            </button>
          </div>

          {/* Workshops */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <BookOpen className="w-12 h-12 text-orange-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Workshops</h3>
            <p className="text-white/70 mb-6">
              Join live workshops and webinars with SiteSmith experts and community leaders.
            </p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium w-full">
              View Schedule
            </button>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Learning Paths</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Beginner Path</h3>
              <p className="text-white/70 mb-6">
                Perfect for those new to AI-powered development and web applications.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Introduction to SiteSmith</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Your First AI-Generated App</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Understanding Templates</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Customizing Generated Code</span>
                </li>
              </ul>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium w-full">
                Start Beginner Path
              </button>
            </div>

            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Advanced Path</h3>
              <p className="text-white/70 mb-6">
                For experienced developers looking to maximize their productivity with AI.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Advanced Prompting Techniques</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Custom AI Model Integration</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Team Collaboration</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Production Deployment</span>
                </li>
              </ul>
              <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium w-full">
                Start Advanced Path
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Learning?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already building faster with AI-powered development
          </p>
          
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-lg hover:opacity-90 transition-all font-medium text-lg"
          >
            Start Building Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Learn;