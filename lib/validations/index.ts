import { z } from 'zod'

// User Profile Schemas
export const userProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  company: z.string().max(255).optional(),
})

// Auth Schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['brand', 'school_admin', 'student', 'consumer', 'influencer']),
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  company: z.string().optional(),
  school_id: z.string().uuid().optional(),
  brand_id: z.string().uuid().optional(),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Campaign Schemas
export const campaignSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  brief_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  budget_min: z.number().min(0).optional(),
  budget_max: z.number().min(0).optional(),
  target_audience: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  deadline: z.string().optional(),
  public: z.boolean().default(false),
}).refine(
  (data) => {
    if (data.budget_min && data.budget_max) {
      return data.budget_min <= data.budget_max
    }
    return true
  },
  {
    message: 'Minimum budget cannot be greater than maximum budget',
    path: ['budget_max'],
  }
)

// Campaign Application Schema
export const campaignApplicationSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000),
  portfolio_url: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  expected_budget: z.number().min(0).optional(),
})

// School Schema
export const schoolSchema = z.object({
  name: z.string().min(1, 'School name is required').max(255),
  description: z.string().max(1000).optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  address: z.string().max(500).optional(),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
})

// Brand Schema
export const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255),
  description: z.string().max(1000).optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  industry: z.string().max(100).optional(),
  company_size: z.string().max(50).optional(),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
})

// Request Access Schema
export const requestAccessSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.enum(['brand', 'school_admin', 'student', 'consumer', 'influencer']),
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  company: z.string().max(255).optional(),
  message: z.string().min(1, 'Message is required').max(500),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// File Upload Schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB
    'File size must be less than 10MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
    'File must be an image (JPEG, PNG, WebP) or PDF'
  ),
})

// Project Schema
export const projectSchema = z.object({
  campaign_id: z.string().uuid('Invalid campaign ID'),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required').max(2000),
  file_urls: z.array(z.string().url()).default([]),
  image_urls: z.array(z.string().url()).default([]),
})

// Vote Schema
export const voteSchema = z.object({
  project_id: z.string().uuid().optional(),
  campaign_id: z.string().uuid().optional(),
  value: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
}).refine(
  (data) => Boolean(data.project_id) !== Boolean(data.campaign_id),
  {
    message: 'Vote must target either a project or campaign, not both',
    path: ['project_id'],
  }
)

// Market Test Schema
export const marketTestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required').max(2000),
  questions: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'multiple_choice', 'rating', 'yes_no']),
    question: z.string().min(1, 'Question is required'),
    options: z.array(z.string()).optional(),
    required: z.boolean().default(true),
  })).min(1, 'At least one question is required'),
  target_audience: z.array(z.string()).default([]),
  max_responses: z.number().int().min(1).max(1000).default(100),
  expires_at: z.string().optional(),
  school_id: z.string().uuid().optional(),
})

// Campaign Acceptance Schema  
export const campaignAcceptanceSchema = z.object({
  campaign_id: z.string().uuid('Invalid campaign ID'),
})

// Common validation helpers
export const emailSchema = z.string().email('Invalid email address')
export const urlSchema = z.string().url('Invalid URL').optional().or(z.literal(''))
export const uuidSchema = z.string().uuid('Invalid ID format')
export const positiveNumberSchema = z.number().min(0, 'Must be a positive number')

// Type exports
export type UserProfileInput = z.infer<typeof userProfileSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type CampaignInput = z.infer<typeof campaignSchema>
export type CampaignApplicationInput = z.infer<typeof campaignApplicationSchema>
export type SchoolInput = z.infer<typeof schoolSchema>
export type BrandInput = z.infer<typeof brandSchema>
export type RequestAccessInput = z.infer<typeof requestAccessSchema>
export type FileUploadInput = z.infer<typeof fileUploadSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type VoteInput = z.infer<typeof voteSchema>
export type MarketTestInput = z.infer<typeof marketTestSchema>
export type CampaignAcceptanceInput = z.infer<typeof campaignAcceptanceSchema>