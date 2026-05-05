export type WebsiteType = 'basic' | 'ecommerce' | 'social' | 'blog';

export type Feature = 'auth' | 'payments' | 'admin';

export interface GenerateRequest {
  websiteType: WebsiteType;
  features: Feature[];
  projectName?: string;
}

export interface GeneratedProject {
  projectId: string;
  projectName?: string;
  downloadPath: string;
  previewUrl?: string;
  structure: string[];
  modules?: string[];
  message?: string;
}

export interface ProjectMetadata {
  projectId: string;
  projectName?: string;
  websiteType: string;
  features: Feature[];
  modules: string[];
  structure: string[];
  downloadPath: string;
  previewUrl: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
  error?: string;
}

export interface ProjectsResponse {
  success: boolean;
  data?: ProjectMetadata[];
  error?: string;
}

export interface GenerateResponse {
  success: boolean;
  data?: GeneratedProject;
  error?: string;
}
