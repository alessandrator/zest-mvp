-- Migration: Create user_profiles table
-- This migration ensures the user_profiles table exists with the correct structure
-- Run this if you get the error: "Could not find the table 'public.user_profiles' in the schema cache"

-- First, drop the table if it exists (in case there's a malformed version)
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Recreate the user_profiles table with correct syntax
CREATE TABLE user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Recreate indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_school_id ON user_profiles(school_id);
CREATE INDEX idx_user_profiles_brand_id ON user_profiles(brand_id);

-- Recreate trigger
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Users can read their own profile" ON user_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Super admins can read all profiles" ON user_profiles
  FOR SELECT USING (is_super_admin());

CREATE POLICY "Super admins can update all profiles" ON user_profiles
  FOR UPDATE USING (is_super_admin());

CREATE POLICY "Brand users can read profiles of their applicants" ON user_profiles
  FOR SELECT USING (
    get_user_role() = 'brand' AND
    user_id IN (
      SELECT ca.user_id 
      FROM campaign_applications ca
      JOIN campaigns c ON ca.campaign_id = c.id
      WHERE c.brand_id = get_user_brand_id()
    )
  );