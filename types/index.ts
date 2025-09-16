export type UserRole = 
  | 'super_admin' 
  | 'brand' 
  | 'school_admin' 
  | 'student' 
  | 'consumer' 
  | 'influencer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  phone?: string | null;
  company?: string | null;
  school_id?: string | null;
  bio?: string | null;
  website?: string | null;
  social_links?: Record<string, unknown> | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  address?: string;
  contact_email?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  industry?: string;
  company_size?: string;
  contact_email?: string;
  verified: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  brief_url?: string;
  budget_min?: number;
  budget_max?: number;
  target_audience: string[];
  requirements: string[];
  deliverables: string[];
  deadline?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  public: boolean;
  created_at: string;
  updated_at: string;
  brand?: Brand;
}

export interface CampaignApplication {
  id: string;
  campaign_id: string;
  user_id: string;
  message: string;
  portfolio_url?: string;
  expected_budget?: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
  campaign?: Campaign;
  user?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url?: string;
  created_at: string;
}

// New types for the backend services

export interface Material {
  id: string;
  student_id: string;
  school_id?: string;
  title: string;
  description: string;
  file_url?: string;
  file_type: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'requires_changes';
  visibility: 'private' | 'school' | 'public';
  subject?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  submitted_at?: string;
  reviewed_at?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  student?: User;
  school?: School;
  corrections?: Correction[];
}

export interface Correction {
  id: string;
  material_id: string;
  teacher_id: string;
  content: string;
  type: 'feedback' | 'suggestion' | 'error' | 'approval' | 'rejection';
  status: 'active' | 'resolved' | 'archived';
  line_number?: number;
  highlight_text?: string;
  created_at: string;
  updated_at: string;
  teacher?: User;
  material?: Material;
}

export interface Permission {
  id: string;
  user_id: string;
  granted_by: string;
  permission_type: 'upload' | 'review' | 'approve' | 'manage_school' | 'manage_users';
  resource_id?: string;
  resource_type?: string;
  active: boolean;
  expires_at?: string;
  reason?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  granted_by_user?: User;
}

export interface UserPermissions {
  user_id: string;
  can_upload: boolean;
  can_review: boolean;
  can_approve: boolean;
  can_manage_school: boolean;
  can_manage_users: boolean;
  is_blocked: boolean;
  block_reason?: string;
  blocked_at?: string;
  blocked_by?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}