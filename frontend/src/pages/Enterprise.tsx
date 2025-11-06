import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Shield, Users, Zap, Lock, Headphones } from 'lucide-react';

const Enterprise: React.FC = () => {
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
            <Building2 className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">Enterprise</h1>
          </div>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Scale your development with enterprise-grade AI-powered web application generation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <Shield className="w-12 h-12 text-blue-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise Security</h3>
            <p className="text-white/70">
              SOC 2 compliant infrastructure with end-to-end encryption, SSO integration, and advanced access controls.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <Users className="w-12 h-12 text-green-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Team Collaboration</h3>
            <p className="text-white/70">
              Real-time collaboration tools, project sharing, and team management with role-based permissions.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <Zap className="w-12 h-12 text-yellow-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Custom AI Models</h3>
            <p className="text-white/70">
              Deploy custom AI models trained on your specific requirements and coding standards.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <Lock className="w-12 h-12 text-purple-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Private Cloud</h3>
            <p className="text-white/70">
              Dedicated infrastructure with your own private cloud deployment and data sovereignty.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <Headphones className="w-12 h-12 text-red-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">24/7 Support</h3>
            <p className="text-white/70">
              Dedicated success manager, priority support, and guaranteed SLA with 99.9% uptime.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <Building2 className="w-12 h-12 text-orange-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise Integration</h3>
            <p className="text-white/70">
              Seamless integration with your existing tools, CI/CD pipelines, and enterprise systems.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Development?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join leading enterprises that trust SiteSmith to accelerate their web development with AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg hover:opacity-90 transition-all font-medium text-lg">
              Schedule Demo
            </button>
            <button className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg">
              Contact Sales
            </button>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Trusted by Industry Leaders</h3>
            <p className="text-white/70 mb-6">
              Fortune 500 companies and startups alike trust SiteSmith to power their development workflows.
            </p>
            <ul className="space-y-2 text-white/80">
              <li>• 10x faster development cycles</li>
              <li>• 90% reduction in boilerplate code</li>
              <li>• 99.9% uptime guarantee</li>
              <li>• SOC 2 Type II certified</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Implementation & Support</h3>
            <p className="text-white/70 mb-6">
              Our enterprise team will help you get up and running quickly with full migration support.
            </p>
            <ul className="space-y-2 text-white/80">
              <li>• Dedicated onboarding specialist</li>
              <li>• Custom training programs</li>
              <li>• API integration support</li>
              <li>• Migration assistance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enterprise;