# ZEST MVP - Digital Marketing Platform

Connect brands with students and influencers through innovative digital marketing campaigns.

## 🚀 Features

- **Multi-Role Authentication**: Support for super admins, brands, school admins, students, consumers, and influencers
- **Campaign Management**: Brands can create and manage marketing campaigns with approval workflows
- **Project Submission System**: Students and creators can submit projects for campaigns with file uploads
- **Voting System**: Users can vote and rate projects and campaigns with 1-5 star ratings
- **Market Test Management**: Brands can create market research tests with approval workflows
- **Campaign Acceptance Workflow**: Students/creators can browse and accept campaigns
- **File Upload System**: Secure file uploads with 10MB limits and storage bucket organization
- **Application System**: Creators can apply to campaigns with portfolios and proposals
- **Access Request System**: New users can request access with approval workflow
- **Password Reset**: Secure forgot password functionality with email verification
- **Role-Based Access Control (RBAC)**: Secure access control based on user roles
- **Super Admin Dashboard**: Centralized approval interface for projects and market tests
- **Responsive Design**: Modern, mobile-first design with TailwindCSS
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Real-time Updates**: Built on Supabase for real-time data synchronization
- **Environment Validation**: Runtime checks for required configuration

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Row Level Security (RLS)
- **Validation**: Zod schemas
- **UI Components**: Custom components with shadcn/ui patterns
- **Fonts**: Inter & Montserrat (via CSS fallbacks)
- **Deployment**: Vercel-ready

## 🎨 Design System

### Colors
- **Primary**: #F6E05E (Yellow) - Brand highlight color
- **Dark**: #1A1A1A - Primary text and dark elements  
- **White**: #FFFFFF - Backgrounds and light elements
- **Gray**: #BFBFBF - Secondary text and borders

### Fonts
- **Sans-serif**: Inter (body text)
- **Display**: Montserrat (headings and brand text)

## 📁 Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── campaigns/         # Public campaigns page
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/            # Authentication pages
│   ├── request-access/   # Access request form
│   └── layout.tsx        # Root layout with fonts & providers
├── components/
│   ├── layouts/          # Navigation and layout components
│   └── ui/              # Reusable UI components
├── lib/
│   ├── auth/            # Authentication helpers & RBAC
│   ├── supabase/        # Supabase client configuration
│   ├── utils/           # Utility functions
│   └── validations/     # Zod schemas
├── db/
│   ├── schema.sql       # Database schema
│   ├── policies.sql     # Row Level Security policies
│   └── seed.sql         # Sample data
├── public/branding/     # Brand assets and logos
└── types/              # TypeScript type definitions
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the repository
```bash
git clone <repository-url>
cd zest-mvp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the environment example file:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

#### Create tables and policies
Run the SQL files in your Supabase SQL editor in this order:
1. `db/schema.sql` - Creates tables and indexes (including new `access_requests` table)
2. `db/policies.sql` - Sets up Row Level Security policies
3. `db/seed.sql` - Adds sample data (optional)

#### Enable Authentication
In your Supabase dashboard:
1. Go to Authentication > Settings
2. Enable email authentication
3. Configure any additional providers needed

For detailed setup instructions and troubleshooting, see [docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 👥 User Roles & Permissions

### Super Admin
- Full system access
- Approve/reject projects and market tests
- Manage all users, brands, and schools
- View all campaigns and applications
- Access comprehensive analytics dashboard

### Brand
- Create and manage campaigns (max 10 per brand)
- Monitor project submissions and approvals
- Create market research tests
- Review applications from creators
- View campaign analytics and performance
- Approve/reject creator projects

### School Admin  
- Manage school information and students
- Create educational campaigns and market tests
- View student activities and projects
- Monitor school-specific analytics

### Student
- Browse and accept public campaigns
- Submit projects with file uploads (max 10MB)
- Vote on other projects and campaigns
- Track project approval status and feedback
- Manage personal portfolio and submissions

### Influencer
- Apply to campaigns with larger reach requirements
- Submit professional-grade projects
- Access premium campaign opportunities
- Manage extensive portfolios and analytics
- Vote and rate community content

### Consumer
- Participate in consumer-focused campaigns and market tests
- Provide product feedback and reviews
- Vote on projects and campaign content
- Access consumer research opportunities

## 🔐 Authentication Flow

1. **Public Access**: Home, campaigns, request access pages
2. **Authentication Required**: Dashboard and management pages
3. **Role-Based Redirects**: Users redirected to appropriate dashboard
4. **Row Level Security**: Database-level permission enforcement

### User Workflows

#### Brand/School Workflow
1. Create campaigns with detailed briefs and requirements
2. Set budget ranges and target audiences
3. Monitor campaign applications and acceptances
4. Review and approve submitted projects
5. Create market research tests for user feedback

#### Student/Creator Workflow  
1. Browse available public campaigns
2. Accept campaigns of interest
3. Submit projects with files and descriptions
4. Track approval status and feedback
5. Vote and rate other community projects
6. Build portfolio and reputation

#### Super Admin Workflow
1. Monitor all platform activity from centralized dashboard
2. Approve/reject submitted projects for quality control
3. Activate market tests and campaigns
4. Manage user access and permissions
5. View comprehensive platform analytics

### Password Requirements

For security, all user passwords must meet the following criteria:
- **Minimum 8 characters**
- **At least one uppercase letter (A-Z)**
- **At least one number (0-9)**

These requirements are enforced both on the frontend (immediate feedback) and backend (API validation) using Zod schemas.

## 📊 Database Schema

### Core Tables
- `user_profiles` - Extended user information with roles and brand/school associations
- `schools` - Educational institutions  
- `brands` - Company/brand information
- `campaigns` - Marketing campaigns with approval workflows
- `campaign_applications` - Creator applications to campaigns
- `campaign_acceptances` - Tracking which users accepted campaigns
- `projects` - Student/creator project submissions with file storage
- `votes` - Rating system for projects and campaigns (1-5 stars)
- `market_tests` - Market research tests with questions and responses
- `notifications` - User notifications and alerts

### New Functionality
- **Project Management**: Complete project lifecycle from creation to approval
- **Voting System**: 5-star rating system with optional comments
- **Market Research**: Structured tests with multiple question types
- **File Storage**: Secure file uploads organized by user and project
- **Campaign Limits**: Automatic enforcement of 10 campaign limit per brand
- **Approval Workflows**: Multi-stage approval process for content quality

### Key Features
- UUID primary keys
- Automatic timestamps with triggers
- Row Level Security (RLS) policies for data access control
- Proper foreign key relationships and constraints
- Performance indexes for common queries
- File size limits and type validation
- Campaign participation tracking

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 📞 Support

For support, email support@zest.com or create an issue in this repository.
