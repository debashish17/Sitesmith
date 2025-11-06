import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gift, FileText, Users } from 'lucide-react';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = "" }) => {
  return (
    <nav className={`relative z-10 flex items-center justify-between ${className}`} 
         style={{ paddingTop: '10px', paddingBottom: '10px', paddingLeft: '30px', paddingRight: '30px' }}>
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-bold text-xl">SiteSmith</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-white/80">
        <Link to="/community" className="hover:text-white transition-colors">Community</Link>
        <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        <Link to="/enterprise" className="hover:text-white transition-colors">Enterprise</Link>
        <Link to="/learn" className="hover:text-white transition-colors">Learn</Link>
        <Link to="/launched" className="hover:text-white transition-colors">Launched</Link>
      </div>

      <div className="flex items-center gap-4">
        <Gift className="w-5 h-5 text-white/80" />
        <FileText className="w-5 h-5 text-white/80" />
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-sm">SiteSmith</span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;