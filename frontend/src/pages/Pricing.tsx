import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, DollarSign, Zap, Crown } from 'lucide-react';

const Pricing: React.FC = () => {
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
            <DollarSign className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">Pricing</h1>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Choose the perfect plan for your development needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <div className="text-center mb-8">
              <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="text-4xl font-bold text-white mb-2">$0</div>
              <p className="text-white/70">per month</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-green-400" />
                <span>NVIDIA API access</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-green-400" />
                <span>Up to 10 projects</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-green-400" />
                <span>Basic templates</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-green-400" />
                <span>Community support</span>
              </li>
            </ul>

            <button className="w-full bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-8 hover:border-purple-400/50 transition-all relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            
            <div className="text-center mb-8">
              <Crown className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="text-4xl font-bold text-white mb-2">$19</div>
              <p className="text-white/70">per month</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-purple-400" />
                <span>All Free features</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-purple-400" />
                <span>Claude API access</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-purple-400" />
                <span>Unlimited projects</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-purple-400" />
                <span>Advanced templates</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-purple-400" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-purple-400" />
                <span>Private projects</span>
              </li>
            </ul>

            <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium">
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
            <div className="text-center mb-8">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-2">Custom</div>
              <p className="text-white/70">contact us</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-yellow-400" />
                <span>All Pro features</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-yellow-400" />
                <span>Custom AI models</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-yellow-400" />
                <span>Team collaboration</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-yellow-400" />
                <span>SSO integration</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-yellow-400" />
                <span>Dedicated support</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Check className="w-5 h-5 text-yellow-400" />
                <span>SLA guarantee</span>
              </li>
            </ul>

            <button className="w-full bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Contact Sales
            </button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">30-Day Money-Back Guarantee</h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Try SiteSmith Pro risk-free. If you're not completely satisfied within 30 days, 
              we'll refund your money, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;