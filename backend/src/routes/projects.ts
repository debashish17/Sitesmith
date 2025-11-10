import express from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  addFileToProject,
  addConversationMessage,
  deleteProject,
  processSmartChange
} from '../controllers/projectController.js';

const router = express.Router();

// Project CRUD operations
router.post('/', createProject);                          // POST /api/projects
router.get('/', getProjects);                             // GET /api/projects
router.get('/:id', getProject);                           // GET /api/projects/:id
router.put('/:id', updateProject);                        // PUT /api/projects/:id
router.delete('/:id', deleteProject);                     // DELETE /api/projects/:id

// Project-specific operations
router.post('/:id/files', addFileToProject);              // POST /api/projects/:id/files
router.post('/:id/conversation', addConversationMessage); // POST /api/projects/:id/conversation
router.post('/:id/smart-change', processSmartChange);     // POST /api/projects/:id/smart-change

export default router;