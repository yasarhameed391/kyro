import * as mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  websiteType: { type: String, required: true },
  features: [String],
  modules: [String],
  structure: [String],
  downloadPath: String,
  createdAt: { type: Date, default: Date.now }
});

export interface IProject extends mongoose.Document {
  projectId: string;
  userId: mongoose.Types.ObjectId;
  websiteType: string;
  features: string[];
  modules: string[];
  structure: string[];
  downloadPath: string;
  createdAt: Date;
}

export const Project = mongoose.model<IProject>('Project', projectSchema);
