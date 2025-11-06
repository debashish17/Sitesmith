import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder, Calendar, User, Trash2, Archive, Eye, AlertTriangle } from 'lucide-react';
import { projectService, Project, ProjectsResponse } from '../services/projectService';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Navigation from '@/components/Navigation';

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const allSelected = projects.length > 0 && selectedProjects.length === projects.length;
  
  useEffect(() => {
    loadProjects();
  }, [filter, currentPage]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const statusFilter = filter === 'all' ? undefined : filter;
      const response: ProjectsResponse = await projectService.getProjects(statusFilter, currentPage, 20);
      
      setProjects(response.projects);
      setTotalPages(response.pagination.total);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map(p => p.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProjects.length === 0) return;
    setIsDeleting(true);
    try {
      await Promise.all(selectedProjects.map(id => projectService.deleteProject(id)));
      setSelectedProjects([]);
      loadProjects();
    } catch (err) {
      setError('Failed to delete selected projects. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (projects.length === 0) return;
    setIsDeleting(true);
    try {
      await Promise.all(projects.map(p => projectService.deleteProject(p.id)));
      setSelectedProjects([]);
      loadProjects();
    } catch (err) {
      setError('Failed to delete all projects. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    
    setIsDeleting(true);
    try {
      await projectService.deleteProject(projectToDelete.id);
      loadProjects(); // Reload the list
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchiveProject = async (projectId: string) => {
    try {
      await projectService.updateProjectStatus(projectId, 'archived');
      loadProjects(); // Reload the list
    } catch (err) {
      console.error('Error archiving project:', err);
      setError('Failed to archive project. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-neon-green/20 text-neon-green border border-neon-green/30';
      case 'completed': return 'bg-primary/20 text-primary border border-primary/30';
      case 'archived': return 'bg-muted/50 text-muted-foreground border border-muted/30';
      default: return 'bg-muted/50 text-muted-foreground border border-muted/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#181818] to-[#ea8dcc] relative overflow-hidden" style={{
        background: 'radial-gradient(ellipse 160% 120% at top, #181919 0%, #181919 32%, #1e2961 45%, #4b75f4 58%, #7b82ea 68%, #ea8dcc 82%, #ff6b35 100%)'
      }}>
        <Navigation />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-white/70">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

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
      
      {/* Navigation */}
      <Navigation />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My Projects</h1>
            <p className="text-white/70 mt-2">
              Manage and continue working on your AI-generated projects
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <button
              onClick={handleDeleteAll}
              className="btn-glass px-4 py-2 text-sm text-destructive border-destructive/50"
              disabled={projects.length === 0 || isDeleting}
            >
              Delete All
            </button>
            <button
              onClick={handleDeleteSelected}
              className="btn-glass px-4 py-2 text-sm text-destructive border-destructive/50"
              disabled={selectedProjects.length === 0 || isDeleting}
            >
              Delete Selected
            </button>
            <button
              onClick={() => navigate('/workspace')}
              className="btn-neon flex items-center gap-2"
            >
              <Plus size={20} />
              New Project
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex space-x-1 mb-6 glass p-1 rounded-xl">
          {['all', 'active', 'completed', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status as 'all' | 'active' | 'completed' | 'archived');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === status
                  ? 'bg-primary text-primary-foreground shadow-lg glow-cyan'
                  : 'text-muted-foreground hover:text-foreground hover:bg-glass/20'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {error && (
          <div className="glass border-destructive/50 bg-destructive/10 text-destructive px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {/* Projects grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="glass-strong p-8 rounded-2xl max-w-md mx-auto">
              <Folder size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No projects found
              </h3>
              <p className="text-muted-foreground mb-6">
                Get started by creating your first AI-generated project.
              </p>
              <button
                onClick={() => navigate('/workspace')}
                className="btn-neon flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Create Project
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="mr-2 scale-125 accent-primary"
                aria-label="Select all projects"
              />
              <span className="text-muted-foreground text-sm">Select All</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="glass-strong rounded-2xl hover:bg-glass/30 transition-all hover:glow-cyan group relative"
                >
                  <div className="p-6 pt-2">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project.id)}
                          onChange={() => handleSelectProject(project.id)}
                          className="scale-125 accent-primary ml-2"
                          aria-label={`Select project ${project.name}`}
                        />
                      </div>
                    </div>
                    {project.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span className="capitalize">{project.aiProvider}</span>
                        <span className="mx-1">•</span>
                        <span className="capitalize">{project.template}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Updated {formatDate(project.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Folder size={14} />
                        <span>{project.files.length} files</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/workspace/${project.id}`)}
                        className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-1 transition-all hover:glow-cyan"
                      >
                        <Eye size={16} />
                        Open
                      </button>
                      {project.status !== 'archived' && (
                        <button
                          onClick={() => handleArchiveProject(project.id)}
                          className="btn-glass px-3 py-2 text-sm"
                          title="Archive project"
                        >
                          <Archive size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="glass border-destructive/30 bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-2 rounded-xl text-sm transition-all hover:border-destructive/50"
                        title="Delete project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2 glass p-2 rounded-xl">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-glass/20 transition-all"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-glass/20 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glass-strong border-glass-border/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Project
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone and will permanently remove all project files and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="btn-glass"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProject}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/80 text-destructive-foreground"
            >
              {isDeleting ? 'Deleting...' : 'Delete Project'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectsPage;