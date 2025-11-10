import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  aiProvider: 'claude' | 'nvidia';
  template: string; // 'react' | 'node' | 'custom'
  files: Array<{
    path: string;
    content: string;
    type: 'file' | 'folder';
    createdAt: Date;
    updatedAt: Date;
  }>;
  steps: Array<{
    id: number;
    title: string;
    description: string;
    type: string;
    status: 'pending' | 'completed' | 'failed';
    code?: string;
    path?: string;
    createdAt: Date;
  }>;
  conversation: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }>;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date;
}

const FileSchema = new Schema({
  path: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['file', 'folder'], default: 'file' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const StepSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  code: { type: String },
  path: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const ConversationSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ProjectSchema = new Schema({
  id: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  prompt: { type: String, required: true },
  aiProvider: { type: String, enum: ['claude', 'nvidia'], required: true },
  template: { type: String, required: true },
  files: [FileSchema],
  steps: [StepSchema],
  conversation: [ConversationSchema],
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastAccessedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
ProjectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better query performance (removed duplicate id index)
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ lastAccessedAt: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);