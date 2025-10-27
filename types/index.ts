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
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  phone?: string | null;
  company?: string | null;
  school_id?: string | null;
  brand_id?: string | null;
  bio?: string | null;
  website?: string | null;
  social_links?: Record<string, unknown> | null;
  verified: boolean;
  active: boolean;
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