-- Row Level Security Policies for ZEST MVP
-- These policies ensure users can only access data they're authorized to see

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM user_profiles 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get user's brand_id
CREATE OR REPLACE FUNCTION get_user_brand_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT brand_id 
    FROM user_profiles 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get user's school_id
CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT school_id 
    FROM user_profiles 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schools policies
CREATE POLICY "Public read access to active schools" ON schools
  FOR SELECT USING (active = true);

CREATE POLICY "Super admins can do anything with schools" ON schools
  FOR ALL USING (is_super_admin());

CREATE POLICY "School admins can update their own school" ON schools
  FOR UPDATE USING (
    get_user_role() = 'school_admin' AND 
    id = get_user_school_id()
  );

-- Brands policies
CREATE POLICY "Public read access to active brands" ON brands
  FOR SELECT USING (active = true);

CREATE POLICY "Super admins can do anything with brands" ON brands
  FOR ALL USING (is_super_admin());

CREATE POLICY "Brand users can update their own brand" ON brands
  FOR UPDATE USING (
    get_user_role() = 'brand' AND 
    id = get_user_brand_id()
  );

-- User profiles policies
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

-- Campaigns policies
CREATE POLICY "Public read access to public active campaigns" ON campaigns
  FOR SELECT USING (public = true AND status = 'active');

CREATE POLICY "Brand users can manage their own campaigns" ON campaigns
  FOR ALL USING (brand_id = get_user_brand_id());

CREATE POLICY "Super admins can do anything with campaigns" ON campaigns
  FOR ALL USING (is_super_admin());

CREATE POLICY "Students and influencers can read active campaigns" ON campaigns
  FOR SELECT USING (
    (get_user_role() IN ('student', 'influencer', 'consumer')) AND
    status = 'active'
  );

-- Campaign applications policies
CREATE POLICY "Users can manage their own applications" ON campaign_applications
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Brand users can read applications for their campaigns" ON campaign_applications
  FOR SELECT USING (
    get_user_role() = 'brand' AND
    campaign_id IN (
      SELECT id FROM campaigns WHERE brand_id = get_user_brand_id()
    )
  );

CREATE POLICY "Brand users can update applications for their campaigns" ON campaign_applications
  FOR UPDATE USING (
    get_user_role() = 'brand' AND
    campaign_id IN (
      SELECT id FROM campaigns WHERE brand_id = get_user_brand_id()
    )
  );

CREATE POLICY "Super admins can do anything with applications" ON campaign_applications
  FOR ALL USING (is_super_admin());

-- Notifications policies
CREATE POLICY "Users can read their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Super admins can do anything with notifications" ON notifications
  FOR ALL USING (is_super_admin());