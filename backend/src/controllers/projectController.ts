import type { Request, Response } from 'express';
import { Project } from '../models/Project.js';
import type { IProject } from '../models/Project.js';
import { v4 as uuidv4 } from 'uuid';
import SmartChangeHandler from '../nlp/SmartChangeHandler.js';

// Initialize the smart change handler
const smartChangeHandler = new SmartChangeHandler();

// Create a new project
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🆕 CREATE PROJECT REQUEST');
    console.log('  - Name:', req.body.name);
    console.log('  - Files count:', req.body.files?.length || 0);
    console.log('  - Steps count:', req.body.steps?.length || 0);
    console.log('  - Conversation count:', req.body.conversation?.length || 0);
    
    // Log first file and step to verify structure
    if (req.body.files?.length > 0) {
      console.log('  - First file:', JSON.stringify(req.body.files[0], null, 2));
    }
    if (req.body.steps?.length > 0) {
      console.log('  - First step:', JSON.stringify(req.body.steps[0], null, 2));
    }
    
    const { name, description, prompt, aiProvider, template, files, steps, conversation } = req.body;

    if (!name || !prompt || !aiProvider || !template) {
      console.log('❌ Validation failed - missing required fields');
      res.status(400).json({ 
        error: 'Missing required fields: name, prompt, aiProvider, and template are required' 
      });
      return;
    }

    const projectId = uuidv4();
    console.log('  - Generated project ID:', projectId);
    
    const project = new Project({
      id: projectId,
      name,
      description,
      prompt,
      aiProvider,
      template,
      files: files || [],
      steps: steps || [],
      conversation: conversation || [],
      status: 'active'
    });

    console.log('  - Saving to MongoDB...');
    const savedProject = await project.save();
    console.log('✅ Project created successfully:', savedProject.id);
    console.log('  - Files in savedProject:', savedProject.files?.length || 0);
    console.log('  - Steps in savedProject:', savedProject.steps?.length || 0);
    console.log('  - Conversation in savedProject:', savedProject.conversation?.length || 0);
    
    // Convert to plain object to ensure all fields are included
    const projectObj = savedProject.toObject();
    console.log('  - Files in toObject():', projectObj.files?.length || 0);
    console.log('  - Steps in toObject():', projectObj.steps?.length || 0);
    
    res.status(201).json({ 
      success: true, 
      project: projectObj,
      message: 'Project created successfully' 
    });
  } catch (error) {
    console.error('❌ Error creating project:', error);
    res.status(500).json({ 
      error: 'Failed to create project',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all projects
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    
    const filter: any = {};
    if (status && typeof status === 'string') {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const projects = await Project
      .find(filter)
      .sort({ lastAccessedAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .select('-conversation -files.content'); // Exclude large fields for list view

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      projects,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        count: projects.length,
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch projects',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get a specific project by ID
export const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const project = await Project.findOne({ id });
    
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Update last accessed time
    project.lastAccessedAt = new Date();
    await project.save();

    res.json({ success: true, project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ 
      error: 'Failed to fetch project',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update project
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔄 UPDATE PROJECT REQUEST');
    console.log('  - Project ID:', req.params.id);
    console.log('  - Name:', req.body.name);
    console.log('  - Files count:', req.body.files?.length || 0);
    console.log('  - Steps count:', req.body.steps?.length || 0);
    console.log('  - Conversation count:', req.body.conversation?.length || 0);
    
    const { id } = req.params;
    const updateData = req.body;

    // Remove immutable fields
    delete updateData.id;
    delete updateData.createdAt;

    const project = await Project.findOne({ id });

    if (!project) {
      console.log('❌ Project not found:', id);
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    console.log('  - Found existing project:', project.name);
    console.log('  - Current files:', project.files?.length || 0);

    // Handle files update intelligently - merge instead of replace
    if (updateData.files && Array.isArray(updateData.files)) {
      console.log('  - Merging files...');
      const existingFilesMap = new Map(project.files.map((f: any) => [f.path, f]));
      
      let filesUpdated = 0;
      let filesAdded = 0;
      
      // Update or add each file from the update data
      updateData.files.forEach((newFile: any) => {
        const existingFile = existingFilesMap.get(newFile.path);
        if (existingFile) {
          // Update existing file
          existingFile.content = newFile.content;
          existingFile.updatedAt = new Date();
          filesUpdated++;
        } else {
          // Add new file
          project.files.push({
            path: newFile.path,
            content: newFile.content,
            type: newFile.type || 'file',
            createdAt: new Date(),
            updatedAt: new Date()
          });
          filesAdded++;
        }
      });
      
      console.log(`  - Files updated: ${filesUpdated}, added: ${filesAdded}`);
      
      // Don't overwrite files array from updateData
      delete updateData.files;
    }

    // Update other fields
    Object.assign(project, updateData);
    project.lastAccessedAt = new Date();
    
    console.log('  - Saving to MongoDB...');
    await project.save();

    console.log('✅ Project updated successfully:', project.id);
    console.log('  - Total files:', project.files?.length || 0);
    console.log('  - Total steps:', project.steps?.length || 0);

    res.json({ 
      success: true, 
      project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating project:', error);
    res.status(500).json({ 
      error: 'Failed to update project',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Add file to project
export const addFileToProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { path, content, type = 'file' } = req.body;

    if (!path || content === undefined) {
      res.status(400).json({ error: 'Path and content are required' });
      return;
    }

    const project = await Project.findOne({ id });
    
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Check if file already exists and update it, or add new one
    const existingFileIndex = project.files.findIndex((f: any) => f.path === path);
    
    if (existingFileIndex !== -1) {
      const existingFile = project.files[existingFileIndex];
      if (existingFile) {
        existingFile.content = content;
        existingFile.updatedAt = new Date();
      }
    } else {
      project.files.push({
        path,
        content,
        type,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    project.lastAccessedAt = new Date();
    await project.save();

    res.json({ 
      success: true, 
      message: 'File added/updated successfully',
      file: { path, type }
    });
  } catch (error) {
    console.error('Error adding file to project:', error);
    res.status(500).json({ 
      error: 'Failed to add file to project',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Add conversation message
export const addConversationMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role, content } = req.body;

    if (!role || !content) {
      res.status(400).json({ error: 'Role and content are required' });
      return;
    }

    const project = await Project.findOne({ id });
    
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    project.conversation.push({
      role,
      content,
      timestamp: new Date()
    });

    project.lastAccessedAt = new Date();
    await project.save();

    res.json({ 
      success: true, 
      message: 'Conversation updated successfully'
    });
  } catch (error) {
    console.error('Error adding conversation message:', error);
    res.status(500).json({ 
      error: 'Failed to add conversation message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const project = await Project.findOneAndDelete({ id });
    
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json({ 
      success: true, 
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ 
      error: 'Failed to delete project',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Process smart change request using NLP
export const processSmartChange = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🤖 SMART CHANGE REQUEST');
    const { id } = req.params;
    const { userRequest, includeIndexing = false } = req.body;

    if (!userRequest) {
      res.status(400).json({ error: 'userRequest is required' });
      return;
    }

    console.log('  - Project ID:', id);
    console.log('  - User Request:', userRequest);
    console.log('  - Include Indexing:', includeIndexing);

    const project = await Project.findOne({ id });
    
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Prepare current files for NLP analysis
    const currentFiles = project.files.map((file: any) => ({
      path: file.path,
      content: file.content
    }));

    console.log('  - Analyzing', currentFiles.length, 'files');

    // Index project files if requested (typically only on first smart change)
    if (includeIndexing) {
      console.log('  - Indexing project files for semantic search...');
      await smartChangeHandler.indexProjectFiles(currentFiles);
    }

    // Process the change request with NLP
    const smartResponse = await smartChangeHandler.processChangeRequest(
      userRequest,
      currentFiles
    );

    console.log('✅ Smart change processed');
    console.log('  - Intent:', smartResponse.changeRequest.intent);
    console.log('  - Confidence:', smartResponse.changeRequest.confidence.toFixed(2));
    console.log('  - Affected files:', smartResponse.affectedFiles.length);
    console.log('  - Complexity:', smartResponse.estimatedComplexity);

    // Add the smart analysis to conversation for context
    const analysisMessage = {
      role: 'system' as const,
      content: JSON.stringify({
        type: 'smart_analysis',
        originalRequest: userRequest,
        analysis: smartResponse
      }),
      timestamp: new Date()
    };

    project.conversation.push(analysisMessage);
    project.lastAccessedAt = new Date();
    await project.save();

    res.json({
      success: true,
      analysis: smartResponse,
      message: 'Smart change analysis completed'
    });

  } catch (error) {
    console.error('❌ Error processing smart change:', error);
    res.status(500).json({ 
      error: 'Failed to process smart change',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};