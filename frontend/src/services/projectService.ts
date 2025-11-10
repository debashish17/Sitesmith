const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Helper function for fetch requests
async function fetchWithErrorHandling<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export interface ProjectFile {
  path: string;
  content: string;
  type: 'file' | 'folder';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStep {
  id: number;
  title: string;
  description: string;
  type: string;
  status: 'pending' | 'completed' | 'failed';
  code?: string;
  path?: string;
  createdAt: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface SmartChangeRequest {
  userRequest: string;
  includeIndexing?: boolean;
}

export interface SmartChangeResponse {
  success: boolean;
  analysis: {
    success: boolean;
    changeRequest: {
      text: string;
      intent: 'modify' | 'add' | 'remove' | 'style' | 'functionality';
      targets: string[];
      confidence: number;
      context: Array<{
        filePath: string;
        type: string;
        content: string;
        semanticTags: string[];
      }>;
    };
    optimizedPrompt: string;
    affectedFiles: string[];
    estimatedComplexity: 'low' | 'medium' | 'high';
    suggestions?: string[];
  };
  message: string;
}

export interface Project {
  _id: string;
  id: string;
  name: string;
  description?: string;
  prompt: string;
  aiProvider: 'claude' | 'nvidia';
  template: string;
  files: ProjectFile[];
  steps: ProjectStep[];
  conversation: ConversationMessage[];
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  prompt: string;
  aiProvider: 'claude' | 'nvidia';
  template: string;
}

export interface ProjectsResponse {
  success: boolean;
  projects: Project[];
  pagination: {
    current: number;
    total: number;
    count: number;
    totalItems: number;
  };
}

export interface ProjectResponse {
  success: boolean;
  project: Project;
}

export const projectService = {
  // Create a new project
  async createProject(data: CreateProjectData): Promise<ProjectResponse> {
    return fetchWithErrorHandling<ProjectResponse>(`${BACKEND_URL}/api/projects`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all projects
  async getProjects(status?: string, page: number = 1, limit: number = 20): Promise<ProjectsResponse> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return fetchWithErrorHandling<ProjectsResponse>(`${BACKEND_URL}/api/projects?${params}`);
  },

  // Get a specific project
  async getProject(id: string): Promise<ProjectResponse> {
    return fetchWithErrorHandling<ProjectResponse>(`${BACKEND_URL}/api/projects/${id}`);
  },

  // Update project
  async updateProject(id: string, data: Partial<Project>): Promise<ProjectResponse> {
    return fetchWithErrorHandling<ProjectResponse>(`${BACKEND_URL}/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete project
  async deleteProject(id: string): Promise<{ success: boolean; message: string }> {
    return fetchWithErrorHandling<{ success: boolean; message: string }>(`${BACKEND_URL}/api/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Add file to project
  async addFileToProject(id: string, file: { path: string; content: string; type?: 'file' | 'folder' }) {
    return fetchWithErrorHandling<unknown>(`${BACKEND_URL}/api/projects/${id}/files`, {
      method: 'POST',
      body: JSON.stringify(file),
    });
  },

  // Add conversation message
  async addConversationMessage(id: string, message: { role: 'user' | 'assistant'; content: string }) {
    return fetchWithErrorHandling<unknown>(`${BACKEND_URL}/api/projects/${id}/conversation`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },

  // Update project status
  async updateProjectStatus(id: string, status: 'active' | 'completed' | 'archived'): Promise<ProjectResponse> {
    return this.updateProject(id, { status });
  },

  // Process smart change request using NLP
  async processSmartChange(id: string, data: SmartChangeRequest): Promise<SmartChangeResponse> {
    return fetchWithErrorHandling<SmartChangeResponse>(`${BACKEND_URL}/api/projects/${id}/smart-change`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};