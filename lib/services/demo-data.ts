import { User, Material, Correction, UserPermissions, Notification, School, Brand, Campaign, CampaignApplication } from '@/types'

/**
 * Demo Data for MVP
 * 
 * This file contains realistic demo data for all entities in the system.
 * In a real implementation, this would be replaced with database queries.
 * 
 * Integration Notes:
 * - Replace with real database queries (Supabase, Prisma, etc.)
 * - Add data seeding scripts for development/testing
 * - Implement proper data relationships and foreign keys
 * - Add data validation and sanitization
 * - Consider using factories for generating test data
 */

// Demo Schools
const demoSchools: School[] = [
  {
    id: 'school_1',
    name: 'Università Bocconi',
    description: 'Leading business and economics university',
    website: 'https://www.unibocconi.it',
    address: 'Via Bocconi, 8, 20136 Milano MI',
    contact_email: 'info@unibocconi.it',
    active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'school_2',
    name: 'Politecnico di Milano',
    description: 'Technical university specializing in engineering and architecture',
    website: 'https://www.polimi.it',
    address: 'Piazza Leonardo da Vinci, 32, 20133 Milano MI',
    contact_email: 'info@polimi.it',
    active: true,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z'
  }
]

// Demo Brands
const demoBrands: Brand[] = [
  {
    id: 'brand_1',
    name: 'TechFlow',
    description: 'Innovative tech startup focused on productivity tools',
    website: 'https://techflow.com',
    industry: 'Technology',
    company_size: '50-100',
    contact_email: 'partnerships@techflow.com',
    verified: true,
    active: true,
    created_at: '2024-01-20T14:00:00Z',
    updated_at: '2024-01-20T14:00:00Z'
  },
  {
    id: 'brand_2',
    name: 'EcoLife',
    description: 'Sustainable lifestyle brand promoting eco-friendly products',
    website: 'https://ecolife.com',
    industry: 'Consumer Goods',
    company_size: '10-50',
    contact_email: 'hello@ecolife.com',
    verified: true,
    active: true,
    created_at: '2024-01-18T11:00:00Z',
    updated_at: '2024-01-18T11:00:00Z'
  }
]

// Demo Users
const demoUsers: User[] = [
  {
    id: 'user_superadmin_1',
    email: 'admin@zest.com',
    role: 'super_admin',
    profile: {
      id: 'profile_superadmin_1',
      user_id: 'user_superadmin_1',
      first_name: 'Alessandro',
      last_name: 'Admin',
      verified: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user_school_admin_1',
    email: 'admin@unibocconi.it',
    role: 'school_admin',
    profile: {
      id: 'profile_school_admin_1',
      user_id: 'user_school_admin_1',
      first_name: 'Maria',
      last_name: 'Rossi',
      school_id: 'school_1',
      verified: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'user_school_admin_2',
    email: 'admin@polimi.it',
    role: 'school_admin',
    profile: {
      id: 'profile_school_admin_2',
      user_id: 'user_school_admin_2',
      first_name: 'Giuseppe',
      last_name: 'Bianchi',
      school_id: 'school_2',
      verified: true,
      created_at: '2024-01-10T09:30:00Z',
      updated_at: '2024-01-10T09:30:00Z'
    },
    created_at: '2024-01-10T09:30:00Z',
    updated_at: '2024-01-10T09:30:00Z'
  },
  {
    id: 'user_student_1',
    email: 'marco.verdi@studenti.unibocconi.it',
    role: 'student',
    profile: {
      id: 'profile_student_1',
      user_id: 'user_student_1',
      first_name: 'Marco',
      last_name: 'Verdi',
      school_id: 'school_1',
      verified: true,
      bio: 'Economics student passionate about digital marketing and sustainability',
      created_at: '2024-01-16T15:00:00Z',
      updated_at: '2024-01-16T15:00:00Z'
    },
    created_at: '2024-01-16T15:00:00Z',
    updated_at: '2024-01-16T15:00:00Z'
  },
  {
    id: 'user_student_2',
    email: 'sofia.neri@mail.polimi.it',
    role: 'student',
    profile: {
      id: 'profile_student_2',
      user_id: 'user_student_2',
      first_name: 'Sofia',
      last_name: 'Neri',
      school_id: 'school_2',
      verified: true,
      bio: 'Engineering student interested in tech innovation and app development',
      created_at: '2024-01-12T16:00:00Z',
      updated_at: '2024-01-12T16:00:00Z'
    },
    created_at: '2024-01-12T16:00:00Z',
    updated_at: '2024-01-12T16:00:00Z'
  },
  {
    id: 'user_influencer_1',
    email: 'lucia.ferrari@gmail.com',
    role: 'influencer',
    profile: {
      id: 'profile_influencer_1',
      user_id: 'user_influencer_1',
      first_name: 'Lucia',
      last_name: 'Ferrari',
      verified: true,
      bio: 'Lifestyle influencer with 50k followers, focused on sustainable living',
      website: 'https://luciaferrari.com',
      social_links: {
        instagram: '@luciaferrari',
        tiktok: '@lucia_eco'
      },
      created_at: '2024-01-14T12:00:00Z',
      updated_at: '2024-01-14T12:00:00Z'
    },
    created_at: '2024-01-14T12:00:00Z',
    updated_at: '2024-01-14T12:00:00Z'
  },
  {
    id: 'user_brand_1',
    email: 'partnerships@techflow.com',
    role: 'brand',
    profile: {
      id: 'profile_brand_1',
      user_id: 'user_brand_1',
      first_name: 'Andrea',
      last_name: 'Tech',
      company: 'TechFlow',
      verified: true,
      created_at: '2024-01-20T14:30:00Z',
      updated_at: '2024-01-20T14:30:00Z'
    },
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  }
]

// Demo Materials
const demoMaterials: Material[] = [
  {
    id: 'mat_001',
    student_id: 'user_student_1',
    school_id: 'school_1',
    title: 'Sustainable Marketing Campaign Analysis',
    description: 'A comprehensive analysis of eco-friendly marketing strategies used by leading brands in 2024',
    file_url: '/uploads/marco_marketing_analysis.pdf',
    file_type: 'pdf',
    status: 'submitted',
    visibility: 'school',
    subject: 'Marketing',
    tags: ['sustainability', 'marketing', 'campaign analysis'],
    metadata: { pages: 15, word_count: 3500 },
    submitted_at: '2024-02-01T10:00:00Z',
    created_at: '2024-02-01T09:30:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 'mat_002',
    student_id: 'user_student_1',
    school_id: 'school_1',
    title: 'Social Media Content Strategy',
    description: 'Strategic framework for creating engaging social media content for B2B companies',
    file_url: '/uploads/marco_social_strategy.pptx',
    file_type: 'presentation',
    status: 'approved',
    visibility: 'public',
    subject: 'Digital Marketing',
    tags: ['social media', 'content strategy', 'B2B'],
    metadata: { slides: 20 },
    submitted_at: '2024-01-25T14:00:00Z',
    reviewed_at: '2024-01-28T16:00:00Z',
    approved_at: '2024-01-30T10:00:00Z',
    created_at: '2024-01-25T13:30:00Z',
    updated_at: '2024-01-30T10:00:00Z'
  },
  {
    id: 'mat_003',
    student_id: 'user_student_2',
    school_id: 'school_2',
    title: 'Mobile App UI/UX Design Case Study',
    description: 'Design process and user testing results for a productivity mobile application',
    file_url: '/uploads/sofia_app_design.zip',
    file_type: 'archive',
    status: 'under_review',
    visibility: 'school',
    subject: 'Design',
    tags: ['ui/ux', 'mobile app', 'user testing'],
    metadata: { files: 25, total_size: '45MB' },
    submitted_at: '2024-02-03T11:00:00Z',
    created_at: '2024-02-03T10:30:00Z',
    updated_at: '2024-02-03T11:00:00Z'
  },
  {
    id: 'mat_004',
    student_id: 'user_student_2',
    school_id: 'school_2',
    title: 'AI-Powered Student Assistance Platform',
    description: 'Technical documentation and prototype for an AI chatbot helping university students',
    file_url: '/uploads/sofia_ai_platform.pdf',
    file_type: 'pdf',
    status: 'requires_changes',
    visibility: 'school',
    subject: 'Computer Science',
    tags: ['artificial intelligence', 'chatbot', 'education technology'],
    metadata: { pages: 28, word_count: 6200 },
    submitted_at: '2024-01-29T16:00:00Z',
    reviewed_at: '2024-02-02T09:00:00Z',
    created_at: '2024-01-29T15:30:00Z',
    updated_at: '2024-02-02T09:00:00Z'
  }
]

// Demo Corrections
const demoCorrections: Correction[] = [
  {
    id: 'corr_001',
    material_id: 'mat_001',
    teacher_id: 'user_school_admin_1',
    content: 'Excellent analysis overall! Consider adding more recent case studies from 2024 to strengthen your arguments.',
    type: 'feedback',
    status: 'active',
    created_at: '2024-02-02T14:00:00Z',
    updated_at: '2024-02-02T14:00:00Z'
  },
  {
    id: 'corr_002',
    material_id: 'mat_001',
    teacher_id: 'user_school_admin_1',
    content: 'Please provide more specific metrics in the ROI section. Current data needs quantitative support.',
    type: 'suggestion',
    status: 'active',
    line_number: 8,
    highlight_text: 'ROI Analysis',
    created_at: '2024-02-02T14:15:00Z',
    updated_at: '2024-02-02T14:15:00Z'
  },
  {
    id: 'corr_003',
    material_id: 'mat_002',
    teacher_id: 'user_school_admin_1',
    content: 'Outstanding work! This strategy framework is comprehensive and well-researched. Approved for public visibility.',
    type: 'approval',
    status: 'resolved',
    created_at: '2024-01-28T16:00:00Z',
    updated_at: '2024-01-30T10:00:00Z'
  },
  {
    id: 'corr_004',
    material_id: 'mat_003',
    teacher_id: 'user_school_admin_2',
    content: 'Great design work! The user flow is intuitive. Please add accessibility considerations to the final section.',
    type: 'feedback',
    status: 'active',
    created_at: '2024-02-04T10:00:00Z',
    updated_at: '2024-02-04T10:00:00Z'
  },
  {
    id: 'corr_005',
    material_id: 'mat_004',
    teacher_id: 'user_school_admin_2',
    content: 'The technical implementation section needs more detail. Please expand on the machine learning algorithms used and provide performance benchmarks.',
    type: 'error',
    status: 'active',
    line_number: 15,
    highlight_text: 'Machine Learning Implementation',
    created_at: '2024-02-02T09:00:00Z',
    updated_at: '2024-02-02T09:00:00Z'
  }
]

// Demo User Permissions
const demoPermissions: UserPermissions[] = [
  {
    user_id: 'user_superadmin_1',
    can_upload: true,
    can_review: true,
    can_approve: true,
    can_manage_school: true,
    can_manage_users: true,
    is_blocked: false
  },
  {
    user_id: 'user_school_admin_1',
    can_upload: false,
    can_review: true,
    can_approve: false,
    can_manage_school: true,
    can_manage_users: false,
    is_blocked: false
  },
  {
    user_id: 'user_school_admin_2',
    can_upload: false,
    can_review: true,
    can_approve: false,
    can_manage_school: true,
    can_manage_users: false,
    is_blocked: false
  },
  {
    user_id: 'user_student_1',
    can_upload: true,
    can_review: false,
    can_approve: false,
    can_manage_school: false,
    can_manage_users: false,
    is_blocked: false
  },
  {
    user_id: 'user_student_2',
    can_upload: true,
    can_review: false,
    can_approve: false,
    can_manage_school: false,
    can_manage_users: false,
    is_blocked: false
  },
  {
    user_id: 'user_influencer_1',
    can_upload: true,
    can_review: false,
    can_approve: false,
    can_manage_school: false,
    can_manage_users: false,
    is_blocked: false
  },
  {
    user_id: 'user_brand_1',
    can_upload: false,
    can_review: false,
    can_approve: false,
    can_manage_school: false,
    can_manage_users: false,
    is_blocked: false
  }
]

// Demo Notifications
const demoNotifications: Notification[] = [
  {
    id: 'notif_001',
    user_id: 'user_student_1',
    title: 'Feedback Received',
    message: 'Your marketing analysis has received feedback from Prof. Rossi',
    type: 'info',
    read: false,
    action_url: '/dashboard/student/materials/mat_001',
    created_at: '2024-02-02T14:00:00Z'
  },
  {
    id: 'notif_002',
    user_id: 'user_student_1',
    title: 'Material Approved!',
    message: 'Your Social Media Strategy has been approved and is now public',
    type: 'success',
    read: true,
    action_url: '/dashboard/student/materials/mat_002',
    created_at: '2024-01-30T10:00:00Z'
  },
  {
    id: 'notif_003',
    user_id: 'user_school_admin_1',
    title: 'New Student Upload',
    message: 'Marco Verdi has uploaded "Sustainable Marketing Campaign Analysis" for review',
    type: 'info',
    read: false,
    action_url: '/dashboard/school/materials/mat_001',
    created_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 'notif_004',
    user_id: 'user_student_2',
    title: 'Changes Requested',
    message: 'Your AI Platform project needs revisions. Please check the feedback.',
    type: 'warning',
    read: false,
    action_url: '/dashboard/student/materials/mat_004',
    created_at: '2024-02-02T09:00:00Z'
  },
  {
    id: 'notif_005',
    user_id: 'user_superadmin_1',
    title: 'Material Pending Approval',
    message: 'High-quality content from Università Bocconi awaits your approval',
    type: 'info',
    read: false,
    action_url: '/dashboard/admin/approvals',
    created_at: '2024-02-01T15:00:00Z'
  }
]

// Demo Campaigns
const demoCampaigns: Campaign[] = [
  {
    id: 'campaign_001',
    brand_id: 'brand_1',
    title: 'TechFlow App Launch Campaign',
    description: 'Help us promote our new productivity app to university students',
    budget_min: 500,
    budget_max: 1500,
    target_audience: ['students', 'young professionals'],
    requirements: ['Social media presence', 'Tech-savvy audience'],
    deliverables: ['Instagram posts', 'Story content', 'App review video'],
    deadline: '2024-03-15T00:00:00Z',
    status: 'active',
    public: true,
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-02-01T09:00:00Z'
  },
  {
    id: 'campaign_002',
    brand_id: 'brand_2',
    title: 'EcoLife Sustainable Living Challenge',
    description: 'Join our 30-day sustainable living challenge and inspire others',
    budget_min: 300,
    budget_max: 800,
    target_audience: ['eco-conscious youth', 'lifestyle enthusiasts'],
    requirements: ['Environmental awareness', 'Active social media'],
    deliverables: ['Daily challenge posts', 'Tips and tricks content', 'Final transformation video'],
    deadline: '2024-02-28T00:00:00Z',
    status: 'active',
    public: true,
    created_at: '2024-01-20T14:00:00Z',
    updated_at: '2024-01-20T14:00:00Z'
  }
]

// Demo Campaign Applications
const demoCampaignApplications: CampaignApplication[] = [
  {
    id: 'app_001',
    campaign_id: 'campaign_001',
    user_id: 'user_student_1',
    message: 'I am very interested in promoting TechFlow. As an economics student with a passion for productivity tools, I believe I can effectively reach the target audience.',
    portfolio_url: 'https://marcoverdi.portfolio.com',
    expected_budget: 1000,
    status: 'pending',
    created_at: '2024-02-02T10:00:00Z',
    updated_at: '2024-02-02T10:00:00Z'
  },
  {
    id: 'app_002',
    campaign_id: 'campaign_002',
    user_id: 'user_influencer_1',
    message: 'EcoLife aligns perfectly with my values and content. I have been promoting sustainable living for 2 years and have an engaged eco-conscious audience.',
    portfolio_url: 'https://luciaferrari.com/portfolio',
    expected_budget: 750,
    status: 'approved',
    created_at: '2024-01-25T16:00:00Z',
    updated_at: '2024-01-28T09:00:00Z'
  },
  {
    id: 'app_003',
    campaign_id: 'campaign_001',
    user_id: 'user_student_2',
    message: 'As an engineering student, I understand the technical aspects of productivity apps and can create detailed reviews that highlight the app\'s features.',
    expected_budget: 800,
    status: 'pending',
    created_at: '2024-02-03T12:00:00Z',
    updated_at: '2024-02-03T12:00:00Z'
  }
]

// Export demo data
export const demoData = {
  schools: demoSchools,
  brands: demoBrands,
  users: demoUsers,
  materials: demoMaterials,
  corrections: demoCorrections,
  permissions: demoPermissions,
  notifications: demoNotifications,
  campaigns: demoCampaigns,
  campaignApplications: demoCampaignApplications
}

/**
 * Helper functions for demo data
 */
export const demoHelpers = {
  getUserById: (id: string) => demoUsers.find(u => u.id === id),
  getSchoolById: (id: string) => demoSchools.find(s => s.id === id),
  getBrandById: (id: string) => demoBrands.find(b => b.id === id),
  getMaterialsByStudent: (studentId: string) => demoMaterials.filter(m => m.student_id === studentId),
  getMaterialsBySchool: (schoolId: string) => demoMaterials.filter(m => m.school_id === schoolId),
  getCorrectionsByMaterial: (materialId: string) => demoCorrections.filter(c => c.material_id === materialId),
  getUnreadNotifications: (userId: string) => demoNotifications.filter(n => n.user_id === userId && !n.read)
}