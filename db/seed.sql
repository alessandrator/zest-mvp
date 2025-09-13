-- ZEST MVP Seed Data
-- This file creates demo data for testing the application

-- Insert demo schools
INSERT INTO schools (id, name, description, website, contact_email) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'University of Technology',
  'Leading technology university with innovative programs in digital marketing and business.',
  'https://utech.edu',
  'contact@utech.edu'
),
(
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'Design Institute',
  'Premier creative arts and design school specializing in digital media.',
  'https://designinstitute.edu',
  'info@designinstitute.edu'
);

-- Insert demo brands
INSERT INTO brands (id, name, description, website, industry, company_size, contact_email, verified) VALUES
(
  '550e8400-e29b-41d4-a716-446655440010'::uuid,
  'TechFlow Solutions',
  'Innovative SaaS company focused on productivity and workflow automation.',
  'https://techflow.com',
  'Technology',
  '50-200',
  'partnerships@techflow.com',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440011'::uuid,
  'EcoLife Brands',
  'Sustainable lifestyle brand promoting eco-friendly products and practices.',
  'https://ecolife.com',
  'Consumer Goods',
  '10-50',
  'marketing@ecolife.com',
  true
);

-- Insert demo user profiles
-- Note: These will need actual auth.users entries in a real setup
-- For demo purposes, we'll use placeholder UUIDs that should be replaced with real user IDs

-- Super Admin
INSERT INTO user_profiles (id, user_id, role, first_name, last_name, verified) VALUES
(
  '550e8400-e29b-41d4-a716-446655440020'::uuid,
  '550e8400-e29b-41d4-a716-446655440021'::uuid,
  'super_admin',
  'Admin',
  'User',
  true
);

-- Brand User
INSERT INTO user_profiles (id, user_id, role, first_name, last_name, brand_id, verified) VALUES
(
  '550e8400-e29b-41d4-a716-446655440030'::uuid,
  '550e8400-e29b-41d4-a716-446655440031'::uuid,
  'brand',
  'Sarah',
  'Johnson',
  '550e8400-e29b-41d4-a716-446655440010'::uuid,
  true
);

-- School Admin
INSERT INTO user_profiles (id, user_id, role, first_name, last_name, school_id, verified) VALUES
(
  '550e8400-e29b-41d4-a716-446655440040'::uuid,
  '550e8400-e29b-41d4-a716-446655440041'::uuid,
  'school_admin',
  'Dr. Michael',
  'Chen',
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  true
);

-- Student
INSERT INTO user_profiles (id, user_id, role, first_name, last_name, school_id, bio) VALUES
(
  '550e8400-e29b-41d4-a716-446655440050'::uuid,
  '550e8400-e29b-41d4-a716-446655440051'::uuid,
  'student',
  'Emma',
  'Rodriguez',
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Digital marketing student passionate about social media and content creation.'
);

-- Influencer
INSERT INTO user_profiles (id, user_id, role, first_name, last_name, bio, website, social_links) VALUES
(
  '550e8400-e29b-41d4-a716-446655440060'::uuid,
  '550e8400-e29b-41d4-a716-446655440061'::uuid,
  'influencer',
  'Alex',
  'Thompson',
  'Lifestyle influencer with 50K+ followers. Specializing in tech reviews and productivity content.',
  'https://alexthompson.com',
  '{"instagram": "@alexthompson", "tiktok": "@alex.thompson", "youtube": "AlexTechReviews"}'::jsonb
);

-- Consumer
INSERT INTO user_profiles (id, user_id, role, first_name, last_name, bio) VALUES
(
  '550e8400-e29b-41d4-a716-446655440070'::uuid,
  '550e8400-e29b-41d4-a716-446655440071'::uuid,
  'consumer',
  'Maria',
  'Garcia',
  'Tech enthusiast and early adopter. Love discovering new products and sharing honest reviews.'
);

-- Insert demo campaigns
INSERT INTO campaigns (
  id, 
  brand_id, 
  title, 
  description, 
  budget_min, 
  budget_max,
  target_audience,
  requirements,
  deliverables,
  deadline,
  status,
  public
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440080'::uuid,
  '550e8400-e29b-41d4-a716-446655440010'::uuid,
  'TechFlow App Launch Campaign',
  'We''re launching our new productivity app and looking for students and young professionals to create authentic content showcasing how our app helps with daily productivity and workflow management.',
  500,
  2000,
  ARRAY['students', 'young professionals', 'productivity enthusiasts'],
  ARRAY['Must be a current student or recent graduate', 'Active on social media (Instagram/TikTok)', 'Genuine interest in productivity tools'],
  ARRAY['3 Instagram posts', '2 TikTok videos', '1 detailed review blog post', 'Story highlights for 1 week'],
  (NOW() + INTERVAL '30 days'),
  'active',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440081'::uuid,
  '550e8400-e29b-41d4-a716-446655440011'::uuid,
  'Sustainable Campus Challenge',
  'Partner with us to promote sustainable living on campus! We''re looking for environmentally conscious students to showcase our eco-friendly product line and inspire sustainable habits among their peers.',
  300,
  1500,
  ARRAY['college students', 'environmental advocates', 'sustainability enthusiasts'],
  ARRAY['Currently enrolled student', 'Passion for environmental sustainability', 'Active campus involvement'],
  ARRAY['Campus sustainability challenge video', '2 product showcase posts', 'Educational carousel post', 'Peer testimonials'],
  (NOW() + INTERVAL '45 days'),
  'active',
  true
);

-- Insert demo campaign applications
INSERT INTO campaign_applications (
  campaign_id, 
  user_id, 
  message, 
  portfolio_url, 
  expected_budget,
  status
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440080'::uuid,
  '550e8400-e29b-41d4-a716-446655440051'::uuid,
  'Hi! I''m a computer science student at UTE with a strong focus on productivity and time management. I''ve been using productivity apps for years and would love to create authentic content about TechFlow. My Instagram has great engagement with fellow students.',
  'https://instagram.com/emmar_creates',
  800,
  'pending'
),
(
  '550e8400-e29b-41d4-a716-446655440080'::uuid,
  '550e8400-e29b-41d4-a716-446655440061'::uuid,
  'As a productivity-focused influencer with 50K+ followers, I''d be excited to showcase TechFlow to my audience. My content consistently gets high engagement, especially tech reviews and productivity tips.',
  'https://alexthompson.com/portfolio',
  1500,
  'approved'
),
(
  '550e8400-e29b-41d4-a716-446655440081'::uuid,
  '550e8400-e29b-41d4-a716-446655440051'::uuid,
  'I''m passionate about sustainability and actively involved in our campus environmental club. I''d love to help promote eco-friendly practices through this campaign and showcase EcoLife''s products to my peers.',
  'https://instagram.com/emmar_creates',
  600,
  'pending'
);

-- Insert demo notifications
INSERT INTO notifications (user_id, title, message, type, action_url) VALUES
(
  '550e8400-e29b-41d4-a716-446655440051'::uuid,
  'Application Received',
  'Your application for the TechFlow App Launch Campaign has been received and is under review.',
  'info',
  '/dashboard/applications'
),
(
  '550e8400-e29b-41d4-a716-446655440061'::uuid,
  'Application Approved!',
  'Congratulations! Your application for the TechFlow App Launch Campaign has been approved.',
  'success',
  '/dashboard/campaigns/550e8400-e29b-41d4-a716-446655440080'
),
(
  '550e8400-e29b-41d4-a716-446655440031'::uuid,
  'New Application',
  'You have a new application for your TechFlow App Launch Campaign.',
  'info',
  '/dashboard/campaigns/550e8400-e29b-41d4-a716-446655440080/applications'
);