import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Zap, Brain, Folder, Calendar, User, Eye, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { projectService, Project } from '../services/projectService';
import Navigation from '@/components/Navigation';

export type AIProvider = 'nvidia' | 'claude';

interface LocationState {
  scrollTo?: string;
  initialPrompt?: string;
  provider?: AIProvider;
}

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Scroll to recent projects if navigation state requests it
  useEffect(() => {
    const state = location.state as LocationState;
    if (state && state.scrollTo === 'recent-projects') {
      // Small delay to ensure the component is fully rendered
      const timer = setTimeout(() => {
        const element = document.getElementById('recent-projects');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      // Clear the state to prevent scrolling on refresh
      navigate('/', { replace: true });
      
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate]);
  const [prompt, setMessage] = useState('');
  const [provider, setProvider] = useState<AIProvider>('nvidia');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  
  useEffect(() => {
    loadRecentProjects();
  }, []);

  const loadRecentProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await projectService.getProjects(undefined, 1, 6); // Get first 6 projects
      setProjects(response.projects);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleGenerate = () => {
    if (prompt.trim()) {
      console.log('Navigating to workspace with provider:', provider);
      navigate('/workspace', { state: { initialPrompt: prompt, provider } });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

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

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm">
            Introducing SiteSmith ✨
          </div>
        </div> 

        {/* Hero Title */}
        <div className="text-center mb-8 max-w-5xl w-full px-4 pt-60">
          <h1 className="text-8xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Cooper Hewitt, sans-serif' }}>
            Build something with{' '}
            <span className="inline-flex items-center gap-2">
              SiteSmith
            </span>
          </h1>
          <p className="text-lg text-white/70 font-light">
            Create apps and websites by chatting with AI
          </p>
        </div>  

        {/* Large Input Area */}
        <div className="w-full max-w-4xl px-4 pb-16">
          <div className="bg-[#262625] border border-gray-700/50 rounded-3xl p-6">
            <div className="flex flex-col gap-4">
              <textarea
                value={prompt}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask SiteSmith to create a web app that..."
                className="w-full bg-transparent text-white placeholder-gray-400 border-0 outline-none resize-none leading-relaxed min-h-[50px]"
                style={{ fontSize: '16px' }}
                rows={1}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg text-white/70 text-sm hover:bg-gray-700/50 transition-colors">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Public
                    </button>
                  
                  {/* AI Provider Dropdown */}
                  <Select value={provider} onValueChange={(value) => setProvider(value as AIProvider)}>
                    <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700/50 text-white/90 text-sm">
                      <SelectValue placeholder="Select AI Provider" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="nvidia" className="text-white/90 focus:bg-green-600/20 focus:text-white">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-green-500" />
                          <span>NVIDIA API</span>
                          <span className="text-xs bg-green-500/20 px-1.5 py-0.5 rounded ml-1">Free</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="claude" className="text-white/90 focus:bg-purple-600/20 focus:text-white">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-purple-500" />
                          <span>Claude API</span>
                          <span className="text-xs bg-purple-500/20 px-1.5 py-0.5 rounded ml-1">Pro</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    title="Generate website"
                    aria-label="Generate website"
                    className="p-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hint text */}
          <div className="text-center mt-4">
            <p className="text-white/50 text-sm">
              Press Enter to generate • Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Recent Projects Section */}
  <div id="recent-projects" className="w-[95%] max-w-none px-4 pb-16">
          <div className="bg-black backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Projects</h2>
              <button
                onClick={() => navigate('/projects')}
                className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
              >
                View All
                <Plus className="w-4 h-4" />
              </button>
            </div>
          
          {loadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-white/10 rounded mb-3"></div>
                  <div className="h-3 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded mb-4 w-3/4"></div>
                  <div className="h-8 bg-white/10 rounded"></div>
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group cursor-pointer"
                  onClick={() => navigate(`/workspace/${project.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white font-semibold truncate">
                      {project.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  {project.description && (
                    <p className="text-white/60 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="space-y-1 mb-4 text-xs text-white/50">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span className="capitalize">{project.aiProvider}</span>
                      <span className="mx-1">•</span>
                      <span className="capitalize">{project.template}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>Updated {formatDate(project.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Folder className="w-3 h-3" />
                      <span>{project.files.length} files</span>
                    </div>
                  </div>

                  <button className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-all group-hover:bg-white/30">
                    <Eye className="w-4 h-4" />
                    Open Project
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 max-w-md mx-auto">
                <Folder className="w-12 h-12 mx-auto text-white/40 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No projects yet
                </h3>
                <p className="text-white/60 mb-6">
                  Create your first AI-generated project below.
                </p>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
