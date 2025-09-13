-- ZEST MVP Database Schema
-- This schema supports multi-role authentication and campaign management

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User roles enum
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'brand', 
  'school_admin',
  'student',
  'consumer',
  'influencer'
);

-- Campaign status enum
CREATE TYPE campaign_status AS ENUM (
  'draft',
  'active', 
  'paused',
  'completed',
  'cancelled'
);

-- Application status enum  
CREATE TYPE application_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'completed'
);

-- Notification type enum
CREATE TYPE notification_type AS ENUM (
  'info',
  'success',
  'warning', 
  'error'
);

-- Schools table
CREATE TABLE schools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  logo_url VARCHAR(255),
  address TEXT,
  contact_email VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands table
CREATE TABLE brands (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  logo_url VARCHAR(255),
  industry VARCHAR(100),
  company_size VARCHAR(50),
  contact_email VARCHAR(255),
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (extends auth.users)
CREATE TABLE user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role user_role NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  bio TEXT,
  website VARCHAR(255),
  social_links JSONB DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  brief_url VARCHAR(255),
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  target_audience TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}', 
  deliverables TEXT[] DEFAULT '{}',
  deadline TIMESTAMP WITH TIME ZONE,
  status campaign_status DEFAULT 'draft',
  public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign applications table
CREATE TABLE campaign_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  portfolio_url VARCHAR(255),
  expected_budget DECIMAL(10,2),
  status application_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type notification_type DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  action_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_school_id ON user_profiles(school_id);
CREATE INDEX idx_user_profiles_brand_id ON user_profiles(brand_id);
CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_public ON campaigns(public);
CREATE INDEX idx_campaign_applications_campaign_id ON campaign_applications(campaign_id);
CREATE INDEX idx_campaign_applications_user_id ON campaign_applications(user_id);
CREATE INDEX idx_campaign_applications_status ON campaign_applications(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_applications_updated_at BEFORE UPDATE ON campaign_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();